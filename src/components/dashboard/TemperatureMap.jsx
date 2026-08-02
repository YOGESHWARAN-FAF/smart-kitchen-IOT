import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Thermometer, Sun, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export const TemperatureMap = () => {
  const { metrics } = useSensorStore();
  const temp = metrics.temperature || 24.0;
  
  const minTemp = 15;
  const maxTemp = 60;
  const percentage = Math.min(Math.max(((temp - minTemp) / (maxTemp - minTemp)) * 100, 0), 100);

  const getHeatColor = (t) => {
    if (t > 45) return 'from-amber-500 via-rose-500 to-red-600 text-rose-600';
    if (t > 35) return 'from-emerald-500 via-amber-400 to-rose-500 text-amber-700';
    return 'from-emerald-400 via-emerald-500 to-teal-600 text-emerald-700';
  };

  return (
    <GlassCard className="flex flex-col justify-between h-full bg-white border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              THERMAL GRADIENT MAP
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Ambient Kitchen Temperature</p>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-slate-900">
          {temp} °C
        </span>
      </div>

      <div className="space-y-4 my-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 font-bold">
          <span className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-emerald-600" /> Cool (15°C)
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" /> Critical (60°C)
          </span>
        </div>

        <div className="relative h-6 w-full rounded-full bg-slate-100 p-1 border border-slate-200 overflow-hidden shadow-inner">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getHeatColor(temp)}`}
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono">
          <div className="text-slate-600">
            Thermal State:{' '}
            <span
              className={`font-bold ${
                temp > 40 ? 'text-rose-600 animate-pulse' : temp > 32 ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {temp > 40 ? 'OVERHEAT HAZARD' : temp > 32 ? 'ELEVATED HEAT' : 'NORMAL AMBIENT'}
            </span>
          </div>
          <div className="text-slate-600 font-bold">
            Target Max: <span className="text-slate-900">50.0 °C</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
