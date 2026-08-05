import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Fan, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const RelayPanel = () => {
  const { metrics } = useSensorStore();

  const isExhaustActive = metrics.relayStatus === 1;

  return (
    <GlassCard className="flex flex-col justify-between h-full bg-white border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              isExhaustActive
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <Fan className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              KITCHEN EXHAUST FAN RELAY
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Auto-Interlocked with 4 MQ-4 LPG Sensors</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold badge-yellow">
          AUTO SENSING
        </span>
      </div>

      {/* Animated Exhaust Fan Spinning Indicator */}
      <div className="flex flex-col items-center justify-center my-4 space-y-3">
        <div className="relative flex items-center justify-center">
          <motion.div
            className={`h-24 w-24 rounded-full flex items-center justify-center border-4 ${
              isExhaustActive
                ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                : 'border-slate-300 bg-slate-100'
            }`}
          >
            <motion.div
              animate={{ rotate: isExhaustActive ? 360 : 0 }}
              transition={{ repeat: isExhaustActive ? Infinity : 0, duration: 1.2, ease: 'linear' }}
            >
              <Fan
                className={`w-12 h-12 ${isExhaustActive ? 'text-emerald-600' : 'text-slate-400'}`}
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="text-center font-mono">
          <div
            className={`text-base font-extrabold tracking-wide ${
              isExhaustActive ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {isExhaustActive ? 'EXHAUST FAN ACTIVE (ON)' : 'EXHAUST FAN IDLE (OFF)'}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            ThingSpeak Field 7 Relay Output
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 text-center">
        <span className="text-[11px] font-mono text-slate-600 font-bold flex items-center justify-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          Autonomous 4 MQ-4 LPG Interlock
        </span>
      </div>
    </GlassCard>
  );
};
