import { useEffect, useRef, useCallback } from 'react';
import { useSensorStore } from '../store/useSensorStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { fetchThingSpeakData, fetchThingSpeakHistory } from '../services/thingspeak';
import { analyzeSafetyWithGroq } from '../services/groq';
import { startContinuousAlarm, stopContinuousAlarm } from '../services/alarmSound';
import toast from 'react-hot-toast';

// Global singleton flag to guarantee strictly ONCE toast notification per hazard occurrence
let hasFiredHazardToast = false;

export const useSensorPolling = () => {
  const {
    updateMetrics,
    setHistory,
    setAiAnalysis,
    setAiAnalyzing,
    setSystemHealth,
    addAlert,
  } = useSensorStore();

  const {
    thingSpeakChannel1,
    thingSpeakChannel2,
    thingSpeakReadKey1,
    thingSpeakReadKey2,
    groqApiKey,
    refreshInterval,
    soundAlerts,
    isMuted,
  } = useSettingsStore();

  const isInitialMount = useRef(true);

  // Initialize history on boot from real ThingSpeak REST API
  useEffect(() => {
    if (isInitialMount.current && thingSpeakChannel1) {
      isInitialMount.current = false;
      fetchThingSpeakHistory(thingSpeakChannel1, thingSpeakReadKey1, 60).then((realHistory) => {
        if (realHistory && realHistory.length > 0) {
          setHistory(realHistory);
        }
      });
    }
  }, [thingSpeakChannel1, thingSpeakReadKey1, setHistory]);

  // Execute Groq AI Analysis Call
  const runAIAnalysis = useCallback(
    async (currentMetrics) => {
      setAiAnalyzing(true);
      const res = await analyzeSafetyWithGroq(currentMetrics, groqApiKey);
      if (res.data) {
        setAiAnalysis(res.data);

        const maxLpg = Math.max(
          Number(currentMetrics.mq2) || 0,
          Number(currentMetrics.mq3) || 0,
          Number(currentMetrics.mq4) || 0,
          Number(currentMetrics.mq5) || 0
        );

        const isHazard =
          res.data.emergencyLevel === 'EMERGENCY' ||
          res.data.emergencyLevel === 'CRITICAL' ||
          res.data.emergencyLevel === 'WARNING' ||
          maxLpg > 300;

        if (isHazard) {
          // Play continuous siren alarm if soundAlerts is enabled
          if (soundAlerts !== false) {
            startContinuousAlarm();
          }

          // Fire toast strictly ONCE per hazard occurrence with fixed toast ID
          if (!hasFiredHazardToast) {
            hasFiredHazardToast = true;
            toast.error(`⚠️ ${res.data.immediateAction || 'LPG Gas Leak Detected on MQ-4 Array!'}`, {
              id: 'critical-gas-hazard-toast', // Guarantees single toast instance
              duration: 8000,
              position: 'top-right',
              style: {
                background: '#1A0E14',
                color: '#F43F5E',
                border: '1px solid #F43F5E',
              },
            });
          }

          addAlert({
            title: `CRITICAL LPG SENSOR ALARM: ${res.data.detectedGasType || 'LPG Gas Leak'}`,
            message: res.data.reasoning || `LPG concentration recorded at ${maxLpg} PPM on MQ-4 sensor array!`,
            type: 'critical',
          });
        } else {
          // Stop continuous alarm siren when environment returns to safe
          stopContinuousAlarm();

          // Reset single-toast flag & dismiss toast when environment returns to safe
          if (hasFiredHazardToast) {
            hasFiredHazardToast = false;
            toast.dismiss('critical-gas-hazard-toast');
          }
        }
      }
      setAiAnalyzing(false);
    },
    [groqApiKey, soundAlerts, setAiAnalysis, setAiAnalyzing, addAlert]
  );

  // Main Polling Loop Function (Decoupled from metrics state to prevent re-trigger loop)
  const pollData = useCallback(async () => {
    if (!thingSpeakChannel1) return;

    // Fetch Real-time ThingSpeak REST Data
    const tsResult = await fetchThingSpeakData({
      channel1Id: thingSpeakChannel1,
      channel2Id: thingSpeakChannel2,
      readKey1: thingSpeakReadKey1,
      readKey2: thingSpeakReadKey2,
    });

    if (tsResult.success) {
      const currentMetrics = useSensorStore.getState().metrics;
      const nextMetrics = { ...currentMetrics, ...tsResult.data };
      setSystemHealth({ thingSpeak: 'online', esp32: 'online' });
      updateMetrics(nextMetrics);
      runAIAnalysis(nextMetrics);
    } else {
      setSystemHealth({ thingSpeak: 'offline', esp32: 'checking' });
    }
  }, [
    thingSpeakChannel1,
    thingSpeakChannel2,
    thingSpeakReadKey1,
    thingSpeakReadKey2,
    updateMetrics,
    setSystemHealth,
    runAIAnalysis,
  ]);

  // Interval timer set to refreshInterval (default 15s)
  useEffect(() => {
    pollData();

    const intervalMs = Math.max(refreshInterval, 5) * 1000;
    const timer = setInterval(() => {
      pollData();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [refreshInterval, pollData]);

  return { pollNow: pollData };
};
