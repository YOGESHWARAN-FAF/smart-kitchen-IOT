import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Droplets, CloudRain, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

export const HumidityMap = () => {
  const { metrics } = useSensorStore();
  const humidity = metrics.humidity || 50.0;

  return (
    <GlassCard className="flex flex-col justify-between h-full bg-white border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              HUMIDITY MOISTURE MAP
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Relative Humidity Index</p>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-slate-900">
          {humidity} %
        </span>
      </div>

      <div className="space-y-4 my-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 font-bold">
          <span className="flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-emerald-600" /> Dry (0%)
          </span>
          <span className="flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-emerald-700" /> Saturated (100%)
          </span>
        </div>

        <div className="relative h-6 w-full rounded-full bg-slate-100 p-1 border border-slate-200 overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600"
            initial={{ width: '0%' }}
            animate={{ width: `${humidity}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono">
          <div className="text-slate-600 font-medium">
            Moisture Level:{' '}
            <span
              className={`font-bold ${
                humidity > 80 || humidity < 25 ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {humidity > 80 ? 'HIGH CONDENSATION' : humidity < 25 ? 'VERY DRY AIR' : 'BALANCED COMFORT'}
            </span>
          </div>
          <div className="text-slate-600 font-bold">
            Optimal: <span className="text-slate-900">40 - 65 %</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
