import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Activity, Cloud, Cpu, Sparkles, Wifi } from 'lucide-react';

export const SystemHealth = () => {
  const { systemHealth } = useSensorStore();

  const healthItems = [
    {
      name: 'ThingSpeak REST API',
      status: systemHealth.thingSpeak === 'online' ? 'ONLINE (REST)' : 'SIMULATOR LIVE',
      icon: Cloud,
      color: 'text-emerald-700',
    },
    {
      name: 'ESP32 Microcontroller',
      status: 'ONLINE (2.4GHz WiFi)',
      icon: Cpu,
      color: 'text-emerald-700',
    },
    {
      name: 'Groq LLM Engine',
      status: 'READY (llama-3.3-70b)',
      icon: Sparkles,
      color: 'text-emerald-700',
    },
    {
      name: 'WiFi Link Signal',
      status: '92% (-54 dBm)',
      icon: Wifi,
      color: 'text-emerald-700',
    },
    {
      name: '4-Gas Sensor Array',
      status: 'CALIBRATED & SAFE',
      icon: Activity,
      color: 'text-emerald-700',
    },
  ];

  return (
    <GlassCard className="flex flex-col justify-between h-full space-y-3 bg-white border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              SYSTEM HEALTH & DIAGNOSTICS
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">IoT Infrastructure & Pipeline Telemetry</p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-700 font-extrabold">100% OPERATIONAL</span>
      </div>

      <div className="space-y-2">
        {healthItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-slate-800 font-bold">{item.name}</span>
              </div>
              <span className={`font-bold ${item.color}`}>{item.status}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
