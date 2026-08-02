import React, { useState, useEffect } from 'react';
import { useSensorStore } from '../../store/useSensorStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import {
  ShieldAlert,
  Wifi,
  Cloud,
  Cpu,
  Sparkles,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { formatDate, formatTime } from '../../services/helpers';

export const Header = () => {
  const [now, setNow] = useState(new Date());
  const { systemHealth } = useSensorStore();
  const { soundAlerts, toggleSoundAlerts } = useSettingsStore();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section: Brand Logo & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <ShieldAlert className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  AURA-GUARD <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded badge-yellow">PRO v2.5</span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Autonomous AI Smart Kitchen Safety & IoT Monitoring Command Center
              </p>
            </div>
          </div>
        </div>

        {/* Center Section: Real-time Date, Clock & Mode Badges */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 shadow-inner">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formatTime(now)}</span>
          </div>
          <div className="h-3 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDate(now)}</span>
          </div>
          <div className="h-3 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-extrabold badge-green">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span>LIVE REALTIME IoT</span>
          </div>
        </div>

        {/* Right Section: Live Connectivity Health Badges */}
        <div className="flex items-center gap-2.5">
          {/* WiFi Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] text-slate-800 font-bold">92%</span>
          </div>

          {/* ThingSpeak Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl badge-yellow text-xs font-mono" title="ThingSpeak REST Status">
            <Cloud className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase font-bold">{systemHealth.thingSpeak}</span>
          </div>

          {/* Groq AI Engine Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-mono font-bold shadow-sm" title="Groq AI REST Engine">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span className="text-[11px]">GROQ AI</span>
          </div>

          {/* ESP32 Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] text-slate-800 font-bold">ESP32</span>
          </div>

          {/* Audio Alert Toggle */}
          <button
            onClick={toggleSoundAlerts}
            className={`p-2 rounded-xl border transition-all ${
              soundAlerts
                ? 'bg-rose-100 border-rose-300 text-rose-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle Sound Alerts"
          >
            {soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
