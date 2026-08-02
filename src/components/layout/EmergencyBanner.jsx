import React from 'react';
import { useSensorStore } from '../../store/useSensorStore';
import { AlertTriangle, ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EmergencyBanner = () => {
  const { aiAnalysis, metrics } = useSensorStore();

  const isEmergency =
    aiAnalysis.emergencyLevel === 'EMERGENCY' ||
    aiAnalysis.emergencyLevel === 'CRITICAL' ||
    metrics.mq2 > 500 ||
    metrics.mq4 > 500;

  if (!isEmergency) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-b border-rose-500/60 p-4 shadow-[0_10px_30px_rgba(244,63,94,0.4)] relative overflow-hidden z-30"
      >
        {/* Glowing hazard stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-rose-500 to-yellow-400 animate-pulse" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/30 border border-rose-400 text-rose-300 animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-xs font-black tracking-widest animate-pulse">
                  CRITICAL HAZARD
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {aiAnalysis.detectedGasType} DETECTED
                </h3>
              </div>
              <p className="text-xs text-rose-200 mt-1 font-medium">
                {aiAnalysis.immediateAction || 'Gas concentrations exceed safe explosive thresholds! Autonomous safety systems active.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-900/60 border border-rose-500/40 text-xs font-mono text-rose-200">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AUTONOMOUS SAFETY INTERLOCK</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
