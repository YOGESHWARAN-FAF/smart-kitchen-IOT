import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Bell, AlertTriangle, Trash2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AlertCenter = () => {
  const { alerts, dismissAlert, clearAlerts } = useSensorStore();

  return (
    <GlassCard className="flex flex-col justify-between h-full space-y-3 bg-white border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              LIVE ALERT LOG & AUDIT CENTER
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Hazard Event Triggers & Audit Feed</p>
          </div>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-rose-600 font-bold transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Clear Log
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <p className="text-xs font-mono font-bold">No active critical alerts or hazard events.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                  alert.type === 'critical'
                    ? 'bg-rose-50 border-rose-300 text-rose-900 emergency-border-blink'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 font-mono font-bold">
                      <span>{alert.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        [{alert.timestamp}]
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 font-sans leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-slate-400 hover:text-slate-700 transition-colors font-bold"
                >
                  &times;
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
