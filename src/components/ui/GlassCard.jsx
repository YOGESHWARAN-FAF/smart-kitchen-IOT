import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  glow = null, // 'cyan' | 'rose' | 'amber' | 'emerald' | null
  hover = true,
  onClick,
  ...props
}) => {
  let glowStyle = '';
  if (glow === 'cyan') glowStyle = 'border-emerald-400 shadow-md shadow-emerald-500/10';
  if (glow === 'rose') glowStyle = 'border-rose-400 shadow-md shadow-rose-500/10 emergency-border-blink';
  if (glow === 'amber') glowStyle = 'border-amber-400 shadow-md shadow-amber-500/10';
  if (glow === 'emerald') glowStyle = 'border-emerald-500 shadow-md shadow-emerald-500/15';

  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
