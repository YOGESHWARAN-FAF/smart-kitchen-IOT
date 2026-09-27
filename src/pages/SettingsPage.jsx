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
  Bell,
  Smartphone,
  Vibrate,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
} from '../services/browserNotification';

export const SettingsPage = () => {
  const settings = useSettingsStore();
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission());

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

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-mono">
            💡 <strong>Smart Safety Logic Active:</strong> Raw sensor streams are ingested from both channels (Gas array, Temp, Humidity, PIR Motion). Actuators (Window Servos 1 & 2, Gas Cut-Off Valve Servo 3, and Exhaust Fan Relay) are computed and driven automatically by dashboard interlock logic.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-700">Channel 1 ID (Fields 1-4: Gas Array, F5: Temp, F6: Humidity)</label>
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
              <label className="text-xs font-mono font-bold text-slate-700">Channel 1 Write Key (Optional Remote Write)</label>
              <input
                type="text"
                value={formData.thingSpeakWriteKey1}
                onChange={(e) => setFormData({ ...formData, thingSpeakWriteKey1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-slate-700">Channel 2 ID (Field 4: PIR Motion Occupancy)</label>
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
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                GROQ CLOUD AI ENGINE (openai/gpt-oss-20b, qwen/qwen3.8-27b, gpt-oss-120b)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Active Free Models Sequence • Zero Downtime Diagnostic Fallback</p>
            </div>
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

        {/* Mobile Browser Push Notifications & Vibration Card */}
        <GlassCard className="space-y-4 bg-white border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  MOBILE & BROWSER PUSH NOTIFICATIONS
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  System Alerts & Device Vibration when Gas is Detected
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-extrabold ${
              notifPermission === 'granted'
                ? 'badge-green'
                : notifPermission === 'denied'
                ? 'badge-red'
                : 'badge-yellow'
            }`}>
              {notifPermission === 'granted'
                ? 'PERMITTED (ACTIVE)'
                : notifPermission === 'denied'
                ? 'BLOCKED IN BROWSER'
                : 'ACTION REQUIRED'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Mobile Device Support</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Compatible with Chrome on Android, Samsung Internet, Firefox Mobile, and desktop browsers. Provides immediate push notification and tactile haptic vibration whenever MQ-4 sensors detect hazardous LPG gas.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Vibrate className="w-4 h-4 text-amber-600" />
                <span>Test Notification & Haptic Feedback</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {notifPermission !== 'granted' ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await requestNotificationPermission();
                      setNotifPermission(res.permission);
                      if (res.permission === 'granted') {
                        toast.success('Mobile notifications enabled!');
                        sendTestNotification();
                      } else {
                        toast.error(res.message);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" /> Enable Mobile Notifications
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sendTestNotification();
                      toast.success('Test alert & vibration sent! Check your device tray.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs font-mono shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5 text-yellow-300" /> Send Test Alert & Vibrate
                  </button>
                )}
              </div>
            </div>
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
