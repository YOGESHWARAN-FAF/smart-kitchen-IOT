import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Wind, Sliders, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export const ServoPanel = () => {
  const { metrics } = useSensorStore();

  const servos = [
    {
      name: 'Servo 1',
      title: 'Window 1 Vent Louvre',
      angle: metrics.servo1 || 0,
      index: 1,
      icon: Wind,
      color: 'text-emerald-700',
    },
    {
      name: 'Servo 2',
      title: 'Window 2 Vent Louvre',
      angle: metrics.servo2 || 0,
      index: 2,
      icon: Wind,
      color: 'text-emerald-700',
    },
    {
      name: 'Servo 3',
      title: 'LPG Gas Regulator Valve',
      angle: metrics.servo3 || 0,
      index: 3,
      icon: Flame,
      color: 'text-amber-700',
    },
  ];

  return (
    <GlassCard className="flex flex-col justify-between h-full space-y-4 bg-white border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              SERVO TELEMETRY MONITOR
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Automatic Position: Window 1 • Window 2 • Regulator</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold badge-yellow">PWM 0°-180°</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {servos.map((s) => {
          const Icon = s.icon;
          const percentage = Math.round((s.angle / 180) * 100);
          return (
            <div
              key={s.index}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{s.title}</p>
                </div>
                <span className="text-xs font-mono font-extrabold text-emerald-700">
                  {s.angle}°
                </span>
              </div>

              <div className="flex items-center justify-center my-2">
                <motion.div
                  className={`p-3 rounded-full bg-white border border-slate-200 shadow ${s.color}`}
                  animate={{ rotate: s.angle }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                  <span>0° (Closed)</span>
                  <span>{percentage}%</span>
                  <span>180° (Open)</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                  <motion.div
                    className="h-full bg-emerald-600 rounded-full"
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
