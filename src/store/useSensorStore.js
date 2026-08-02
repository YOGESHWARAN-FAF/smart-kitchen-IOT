import { create } from 'zustand';
import { useSettingsStore } from './useSettingsStore';
import { writeThingSpeakRelay } from '../services/thingspeak';

export const useSensorStore = create((set, get) => ({
  // Current Live Metrics
  metrics: {
    mq2: 120, // LPG, Smoke, Propane
    mq3: 85,  // Alcohol, Ethanol
    mq4: 110, // Methane, Natural Gas
    mq5: 95,  // Hydrogen, Town Gas
    temperature: 24.5,
    humidity: 52.0,
    relayStatus: 0, // 0 = Valve Open/Normal, 1 = Cutoff Engaged / Emergency
    manualRelay: 0,
    servo1: 45, // Exhaust Fan 1 Angle
    servo2: 90, // Damper 2 Angle
    servo3: 0, // LPG Gas Regulator Valve: 0° = ON (Normal/Supply Open), 90° = OFF (Gas Detected Cut Off)
    pirMotion: 1, // 1 = Motion Detected, 0 = No Motion
    leakDuration: 0, // Seconds gas has exceeded warning threshold
    lastUpdated: new Date().toISOString(),
  },

  // 24-Hour Timeline Feeds (History for Recharts)
  history: [],

  // AI Safety Engine State
  aiAnalysis: {
    emergencyLevel: 'NORMAL', // NORMAL, WARNING, CRITICAL, EMERGENCY
    safetyScore: 98, // 0 - 100
    safeToEnter: true,
    riskCategory: 'Low Risk',
    detectedGasType: 'None (Clean Air)',
    recommendedActions: [
      'Kitchen environment is stable and optimal.',
      'Solenoid safety valve is operating normally (Gas Supply ON at 0°).',
      'Routine ventilation auto-cycle active.'
    ],
    immediateAction: 'None required.',
    confidence: '99%',
    reasoning: 'All 4 gas sensors (MQ2-MQ5) remain well below hazard thresholds. Thermal and humidity levels match ambient room standards.',
    isAnalyzing: false,
    lastAnalyzed: null,
  },

  // System Connectivity & Health
  systemHealth: {
    thingSpeak: 'connecting', // 'online' | 'offline' | 'simulated'
    esp32: 'online',
    groq: 'ready',
    wifi: 'connected',
    signalStrength: 92,
  },

  // Alert Feed
  alerts: [],

  // Actions
  updateMetrics: (newMetrics) => {
    const prevMetrics = get().metrics;
    const merged = { ...prevMetrics, ...newMetrics, lastUpdated: new Date().toISOString() };

    // Auto-calculate Servo 3 (LPG Regulator Valve): ON (0°) when no gas, OFF (90°) when gas detected
    const maxGas = Math.max(
      Number(merged.mq2) || 0,
      Number(merged.mq3) || 0,
      Number(merged.mq4) || 0,
      Number(merged.mq5) || 0
    );

    if (maxGas > 300) {
      merged.servo3 = 90; // Gas detected -> Turn Gas Valve OFF (Cut Off at 90°)
    } else {
      merged.servo3 = 0; // No gas detected -> Keep Gas Valve ON (Supply Open at 0°)
    }

    // Compute History Point
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const historyItem = {
      timestamp,
      fullTime: new Date().toISOString(),
      mq2: Number(merged.mq2) || 0,
      mq3: Number(merged.mq3) || 0,
      mq4: Number(merged.mq4) || 0,
      mq5: Number(merged.mq5) || 0,
      temperature: Number(merged.temperature) || 0,
      humidity: Number(merged.humidity) || 0,
      relayStatus: Number(merged.relayStatus) || 0,
      pirMotion: Number(merged.pirMotion) || 0,
      safetyScore: get().aiAnalysis.safetyScore || 98,
    };

    set((state) => {
      // Limit history buffer to 120 points for smooth performance
      const updatedHistory = [...state.history, historyItem].slice(-120);
      return {
        metrics: merged,
        history: updatedHistory,
      };
    });
  },

  setHistory: (historyData) => set({ history: historyData }),

  setAiAnalysis: (analysis) => set((state) => ({
    aiAnalysis: { ...state.aiAnalysis, ...analysis, isAnalyzing: false, lastAnalyzed: new Date().toISOString() }
  })),

  setAiAnalyzing: (isAnalyzing) => set((state) => ({
    aiAnalysis: { ...state.aiAnalysis, isAnalyzing }
  })),

  setSystemHealth: (health) => set((state) => ({
    systemHealth: { ...state.systemHealth, ...health }
  })),

  addAlert: (alert) => set((state) => {
    const exists = state.alerts.some(a => a.id === alert.id || a.title === alert.title);
    if (exists) return state;
    return {
      alerts: [
        { id: Date.now(), timestamp: new Date().toLocaleTimeString(), read: false, ...alert },
        ...state.alerts.slice(0, 49) // keep last 50
      ]
    };
  }),

  dismissAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),

  clearAlerts: () => set({ alerts: [] }),
}));

