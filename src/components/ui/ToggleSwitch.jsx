import React from 'react';
import { motion } from 'framer-motion';

export const ToggleSwitch = ({
  checked = false,
  onChange,
  label = '',
  disabled = false,
  activeColor = 'bg-cyan-500',
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
      <div
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative h-6 w-11 rounded-full p-1 transition-colors duration-300 border ${
          checked
            ? `${activeColor} border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]`
            : 'bg-slate-800 border-slate-700'
        }`}
      >
        <motion.div
          className="h-4 w-4 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </label>
  );
};
