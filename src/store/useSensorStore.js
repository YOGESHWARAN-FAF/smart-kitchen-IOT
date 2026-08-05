import { create } from 'zustand';
import { useSettingsStore } from './useSettingsStore';
import { writeThingSpeakRelay } from '../services/thingspeak';

export const useSensorStore = create((set, get) => ({
  // Current Live Metrics (4 MQ-4 LPG Sensors + Environment & Actuators)
  metrics: {
    mq2: 120, // Field 1: MQ-4 LPG Sensor #1 (Zone 1 - Main Stove)
    mq3: 85,  // Field 2: MQ-4 LPG Sensor #2 (Zone 2 - Cylinder Line)
    mq4: 110, // Field 3: MQ-4 LPG Sensor #3 (Zone 3 - Ceiling Exhaust)
    mq5: 95,  // Field 4: MQ-4 LPG Sensor #4 (Zone 4 - Wall Ventilation)
    temperature: 24.5,
    humidity: 52.0,
    relayStatus: 0, // Field 7: Exhaust Fan Relay (0 = IDLE, 1 = RUNNING / Active Exhaust)
    manualRelay: 0,
    servo1: 45, // Servo 1: Window 1 (W1) Louvre Angle (0°-180°)
    servo2: 45, // Servo 2: Window 2 (W2) Louvre Angle (0°-180°)
    servo3: 0, // Servo 3: LPG Gas Regulator Valve (0° = ON / Supply Open, 90° = OFF / Safety Cut-Off)
    pirMotion: 1, // 1 = Occupant Motion Detected, 0 = Empty Kitchen
    leakDuration: 0, // Seconds LPG concentration has exceeded warning threshold
    lastUpdated: new Date().toISOString(),
  },

  // 24-Hour Timeline Feeds (History for Recharts)
  history: [],

  // AI Safety Engine State
  aiAnalysis: {
    emergencyLevel: 'NORMAL', // NORMAL, WARNING, CRITICAL, EMERGENCY
    safetyScore: 98, // 0 - 100
    safeToEnter: true,
    riskCategory: 'Optimal Safety',
    detectedGasType: 'None (Clean Air)',
    recommendedActions: [
      'Kitchen environment is stable and optimal.',
      'Solenoid safety valve is operating normally (LPG Gas Supply ON at 0°).',
      'Routine ventilation auto-cycle active.'
    ],
    immediateAction: 'None required.',
    confidence: '99%',
    reasoning: 'All 4 MQ-4 LPG gas sensors (Field 1-4) remain well below hazard thresholds. Thermal and humidity levels match ambient standards.',
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

    // 4 MQ-4 LPG Sensors max reading evaluation
    const maxLpgGas = Math.max(
      Number(merged.mq2) || 0,
      Number(merged.mq3) || 0,
      Number(merged.mq4) || 0,
      Number(merged.mq5) || 0
    );

    // Auto-actuation interlock logic for 3 Servos & Relay Fan when LPG is detected
    if (maxLpgGas > 300) {
      merged.servo3 = 90; // LPG Detected -> Turn Gas Valve OFF (Cut-Off at 90°)
      merged.servo1 = 90; // Open Window 1 (W1) for emergency LPG exhaust
      merged.servo2 = 90; // Open Window 2 (W2) for emergency LPG exhaust
      merged.relayStatus = 1; // Engage Exhaust Fan Relay (RUNNING)
    } else {
      merged.servo3 = 0; // Safe -> Keep Gas Valve ON (Supply Open at 0°)
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

