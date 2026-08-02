import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      // ThingSpeak Configuration
      thingSpeakChannel1: '3441914',
      thingSpeakChannel2: '3441916',
      thingSpeakReadKey1: '67ORDYNNAD45C4TQ',
      thingSpeakReadKey2: 'CGQN4IYESGTU5C2X',
      thingSpeakWriteKey1: '6X5PS5YY3VJ7VEFG',

      // Groq AI API Key
      groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',

      // App Settings
      refreshInterval: 15,
      simulationMode: false,
      soundAlerts: false,

      // Sensor Emergency Thresholds
      thresholds: {
        mq2Warning: 300,
        mq2Critical: 600,
        mq3Warning: 250,
        mq3Critical: 500,
        mq4Warning: 300,
        mq4Critical: 650,
        mq5Warning: 280,
        mq5Critical: 550,
        tempWarning: 38.0,
        tempCritical: 50.0,
        humidityLow: 25,
        humidityHigh: 85,
      },

      // Update Actions
      setSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
      setThresholds: (newThresholds) =>
        set((state) => ({
          thresholds: { ...state.thresholds, ...newThresholds },
        })),
      toggleSimulationMode: () =>
        set((state) => ({ simulationMode: !state.simulationMode })),
      toggleSoundAlerts: () =>
        set((state) => ({ soundAlerts: !state.soundAlerts })),
      resetDefaults: () =>
        set({
          thingSpeakChannel1: '3441914',
          thingSpeakChannel2: '3441916',
          thingSpeakReadKey1: '67ORDYNNAD45C4TQ',
          thingSpeakReadKey2: 'CGQN4IYESGTU5C2X',
          thingSpeakWriteKey1: '6X5PS5YY3VJ7VEFG',
          groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
          refreshInterval: 15,
          simulationMode: false,
          soundAlerts: false,
        }),
    }),
    {
      name: 'smart-kitchen-settings',
    }
  )
);
