import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useSettingsStore } from '../store/useSettingsStore';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import {
  Settings,
  Cloud,
  Sparkles,
  Sliders,
  RefreshCw,
  Zap,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const settings = useSettingsStore();

  const [formData, setFormData] = useState({
    thingSpeakChannel1: settings.thingSpeakChannel1,
    thingSpeakChannel2: settings.thingSpeakChannel2,
    thingSpeakReadKey1: settings.thingSpeakReadKey1,
    thingSpeakReadKey2: settings.thingSpeakReadKey2,
    thingSpeakWriteKey1: settings.thingSpeakWriteKey1,
    groqApiKey: settings.groqApiKey,
    refreshInterval: settings.refreshInterval,
    simulationMode: settings.simulationMode,
    soundAlerts: settings.soundAlerts,
    mq2Critical: settings.thresholds.mq2Critical,
    tempCritical: settings.thresholds.tempCritical,
  });

  const handleSave = (e) => {
    e.preventDefault();
    settings.setSettings({
      thingSpeakChannel1: formData.thingSpeakChannel1,
      thingSpeakChannel2: formData.thingSpeakChannel2,
      thingSpeakReadKey1: formData.thingSpeakReadKey1,
      thingSpeakReadKey2: formData.thingSpeakReadKey2,
      thingSpeakWriteKey1: formData.thingSpeakWriteKey1,
      groqApiKey: formData.groqApiKey,
      refreshInterval: Number(formData.refreshInterval),
      simulationMode: formData.simulationMode,
      soundAlerts: formData.soundAlerts,
    });

    settings.setThresholds({
      mq2Critical: Number(formData.mq2Critical),
      tempCritical: Number(formData.tempCritical),
    });

    toast.success('Configuration settings saved successfully!');
  };

  const handleReset = () => {
    settings.resetDefaults();
    setFormData({
      thingSpeakChannel1: '3441914',
      thingSpeakChannel2: '3441916',
      thingSpeakReadKey1: '67ORDYNNAD45C4TQ',
      thingSpeakReadKey2: 'CGQN4IYESGTU5C2X',
      thingSpeakWriteKey1: '6X5PS5YY3VJ7VEFG',
      groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
      refreshInterval: 15,
      simulationMode: false,
      soundAlerts: true,
      mq2Critical: 500,
      tempCritical: 45,
    });
    toast.success('Reset to default hardware credentials');
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            SYSTEM SETTINGS & HARDWARE CONFIGURATION
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            ThingSpeak Channels, Groq API Key, Polling Frequency & Hazard Thresholds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs font-mono shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ThingSpeak Config Card */}
        <GlassCard className="space-y-4 bg-white border-slate-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Cloud className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              THINGSPEAK REST API CHANNELS & READ/WRITE KEYS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-700">Channel 1 ID (7 Fields)</label>
              <input
                type="text"
                value={formData.thingSpeakChannel1}
                onChange={(e) => setFormData({ ...formData, thingSpeakChannel1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-700">Channel 1 Read Key</label>
              <input
                type="text"
                value={formData.thingSpeakReadKey1}
                onChange={(e) => setFormData({ ...formData, thingSpeakReadKey1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-700">Channel 1 Write Key (Field 8 Relay)</label>
              <input
                type="text"
                value={formData.thingSpeakWriteKey1}
                onChange={(e) => setFormData({ ...formData, thingSpeakWriteKey1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-700">Channel 2 ID (Servos & PIR)</label>
              <input
                type="text"
                value={formData.thingSpeakChannel2}
                onChange={(e) => setFormData({ ...formData, thingSpeakChannel2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-mono font-bold text-slate-700">Channel 2 Read Key</label>
              <input
                type="text"
                value={formData.thingSpeakReadKey2}
                onChange={(e) => setFormData({ ...formData, thingSpeakReadKey2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </GlassCard>

        {/* Groq Cloud Key */}
        <GlassCard className="space-y-4 bg-white border-slate-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              GROQ CLOUD API KEY (llama-3.3-70b-versatile)
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-700">Groq API Key</label>
            <input
              type="password"
              value={formData.groqApiKey}
              onChange={(e) => setFormData({ ...formData, groqApiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              placeholder="gsk_..."
            />
          </div>
        </GlassCard>

        {/* System & Alert Options */}
        <GlassCard className="space-y-4 bg-white border-slate-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              TELEMETRY POLLING & ALERT PREFERENCES
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-700">REST Refresh Interval (Seconds)</label>
              <select
                value={formData.refreshInterval}
                onChange={(e) => setFormData({ ...formData, refreshInterval: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value={5}>5 Seconds</option>
                <option value={10}>10 Seconds</option>
                <option value={15}>15 Seconds (Default)</option>
                <option value={30}>30 Seconds</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Sound Alerts</span>
                <span className="text-[10px] text-slate-500 font-medium">Audible alarms on gas hazards</span>
              </div>
              <ToggleSwitch
                enabled={formData.soundAlerts}
                onChange={(val) => setFormData({ ...formData, soundAlerts: val })}
              />
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono shadow-md transition-all"
          >
            Save All Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
};
