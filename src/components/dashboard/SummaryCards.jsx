import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import {
  Thermometer,
  Droplets,
  Flame,
  Wind,
  Zap,
  Activity,
  Power,
  UserCheck,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const SummaryCards = () => {
  const { metrics, aiAnalysis } = useSensorStore();

  const isOccupantPresent = metrics.pirMotion === 1;

  const cards = [
    {
      title: 'Temperature',
      value: `${metrics.temperature} °C`,
      subtitle: metrics.temperature > 38 ? 'Elevated Heat' : 'Ambient Safe',
      icon: Thermometer,
      color: metrics.temperature > 38 ? 'text-rose-600' : 'text-slate-900',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
      badge: metrics.temperature > 38 ? 'badge-red' : 'badge-green',
    },
    {
      title: 'Humidity',
      value: `${metrics.humidity} %`,
      subtitle: 'Relative Moisture',
      icon: Droplets,
      color: 'text-slate-900',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badge: 'badge-green',
    },
    {
      title: 'MQ-4 Sensor #1',
      value: `${metrics.mq2} PPM`,
      subtitle: 'Field 1: Stove Zone LPG',
      icon: Flame,
      color: metrics.mq2 > 300 ? 'text-rose-600' : 'text-slate-900',
      iconBg: 'bg-rose-100 text-rose-800 border-rose-200',
      badge: metrics.mq2 > 300 ? 'badge-red' : 'badge-green',
    },
    {
      title: 'MQ-4 Sensor #2',
      value: `${metrics.mq3} PPM`,
      subtitle: 'Field 2: Cylinder Zone LPG',
      icon: Flame,
      color: metrics.mq3 > 300 ? 'text-rose-600' : 'text-slate-900',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
      badge: metrics.mq3 > 300 ? 'badge-red' : 'badge-green',
    },
    {
      title: 'MQ-4 Sensor #3',
      value: `${metrics.mq4} PPM`,
      subtitle: 'Field 3: Ceiling Zone LPG',
      icon: Flame,
      color: metrics.mq4 > 300 ? 'text-rose-600' : 'text-slate-900',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badge: metrics.mq4 > 300 ? 'badge-red' : 'badge-green',
    },
    {
      title: 'MQ-4 Sensor #4',
      value: `${metrics.mq5} PPM`,
      subtitle: 'Field 4: Wall Vent LPG',
      icon: Flame,
      color: metrics.mq5 > 300 ? 'text-rose-600' : 'text-slate-900',
      iconBg: 'bg-purple-100 text-purple-800 border-purple-200',
      badge: metrics.mq5 > 300 ? 'badge-red' : 'badge-green',
    },
    {
      title: 'Exhaust Fan Relay',
      value: metrics.relayStatus === 1 ? 'RUNNING (ON)' : 'IDLE (OFF)',
      subtitle: 'Field 7 Relay Control',
      icon: Power,
      color: metrics.relayStatus === 1 ? 'text-emerald-700' : 'text-slate-700',
      iconBg: metrics.relayStatus === 1 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200',
      badge: metrics.relayStatus === 1 ? 'badge-green' : 'badge-yellow',
    },
    {
      title: 'PIR Motion Sensor',
      value: isOccupantPresent ? 'OCCUPANT PRESENT' : 'EMPTY KITCHEN',
      subtitle: isOccupantPresent ? 'Person Detected' : 'No Occupants',
      icon: UserCheck,
      color: isOccupantPresent ? 'text-amber-900' : 'text-slate-700',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
      badge: isOccupantPresent ? 'badge-yellow' : 'badge-green',
    },
    {
      title: 'AI Safety Score',
      value: `${aiAnalysis.safetyScore} / 100`,
      subtitle: aiAnalysis.riskCategory,
      icon: ShieldCheck,
      color: aiAnalysis.safetyScore > 80 ? 'text-emerald-700' : 'text-rose-600',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badge: aiAnalysis.safetyScore > 80 ? 'badge-green' : 'badge-red',
    },
    {
      title: 'Emergency Level',
      value: aiAnalysis.emergencyLevel,
      subtitle: aiAnalysis.emergencyLevel === 'NORMAL' ? 'System Safe' : 'Hazard Triggered',
      icon: AlertOctagon,
      color: aiAnalysis.emergencyLevel === 'NORMAL' ? 'text-emerald-700' : 'text-rose-600',
      iconBg: 'bg-rose-100 text-rose-800 border-rose-200',
      badge: aiAnalysis.emergencyLevel === 'NORMAL' ? 'badge-green' : 'badge-red',
    },
    {
      title: 'Safe To Enter',
      value: aiAnalysis.safeToEnter ? 'YES (SAFE)' : 'NO (HAZARD)',
      subtitle: aiAnalysis.safeToEnter ? 'Entry Permitted' : 'Evacuate Zone',
      icon: aiAnalysis.safeToEnter ? CheckCircle2 : XCircle,
      color: aiAnalysis.safeToEnter ? 'text-emerald-700' : 'text-rose-600',
      iconBg: aiAnalysis.safeToEnter ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200',
      badge: aiAnalysis.safeToEnter ? 'badge-green' : 'badge-red',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <GlassCard key={i} className="p-4 flex flex-col justify-between hover:border-emerald-500 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-700">{c.title}</span>
              <div className={`p-2 rounded-xl border ${c.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${c.color}`}>
                {c.value}
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold inline-block ${c.badge}`}>
                  {c.subtitle}
                </span>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
