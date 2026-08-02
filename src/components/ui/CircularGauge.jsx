import React from 'react';
import { motion } from 'framer-motion';

export const CircularGauge = ({
  title = 'Sensor',
  subtitle = '',
  value = 0,
  max = 1000,
  unit = 'PPM',
  status = 'SAFE',
  color = '#10B981',
  gradientId = 'gaugeGradient',
  icon: Icon,
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const radius = 68;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * (circumference * 0.75); // 270 degree arc

  return (
    <div className="flex flex-col justify-between h-full p-2 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-100 text-emerald-700 border border-slate-200 shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">{title}</h4>
            {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-md text-xs font-mono font-extrabold uppercase tracking-wider ${
            status === 'CRITICAL'
              ? 'badge-red animate-pulse'
              : status === 'WARNING'
              ? 'badge-yellow'
              : 'badge-green'
          }`}
        >
          {status}
        </span>
      </div>

      {/* SVG Circular Arc */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-44 h-44 transform -rotate-135" viewBox="0 0 170 170">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx="85"
            cy="85"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth + 2}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Label Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">
            {value}
          </span>
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mt-0.5">
            {unit}
          </span>
          <span className="mt-1 text-xs font-black font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            {percentage}% CAPACITY
          </span>
        </div>
      </div>

      {/* Footer Level Meter */}
      <div className="w-full mt-2 space-y-1">
        <div className="flex justify-between text-xs text-slate-500 font-mono font-extrabold">
          <span>0 PPM</span>
          <span>{max} PPM</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: color,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
};
