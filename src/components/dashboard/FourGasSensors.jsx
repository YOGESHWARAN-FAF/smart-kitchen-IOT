import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { CircularGauge } from '../ui/CircularGauge';
import { useSensorStore } from '../../store/useSensorStore';
import { Flame, Wind, Zap, Activity } from 'lucide-react';
import { getGasColor } from '../../services/helpers';

export const FourGasSensors = () => {
  const { metrics } = useSensorStore();

  const mq2Info = getGasColor(metrics.mq2, 300, 600);
  const mq3Info = getGasColor(metrics.mq3, 250, 500);
  const mq4Info = getGasColor(metrics.mq4, 300, 650);
  const mq5Info = getGasColor(metrics.mq5, 280, 550);

  const sensors = [
    {
      title: 'MQ2 Sensor',
      subtitle: 'LPG / Smoke / Propane',
      value: metrics.mq2,
      max: 1000,
      unit: 'PPM',
      status: mq2Info.status,
      color: mq2Info.hex,
      gradientId: 'mq2Grad',
      icon: Flame,
    },
    {
      title: 'MQ3 Sensor',
      subtitle: 'Alcohol Vapors & Ethanol',
      value: metrics.mq3,
      max: 1000,
      unit: 'PPM',
      status: mq3Info.status,
      color: mq3Info.hex,
      gradientId: 'mq3Grad',
      icon: Wind,
    },
    {
      title: 'MQ4 Sensor',
      subtitle: 'Methane / Natural Gas',
      value: metrics.mq4,
      max: 1000,
      unit: 'PPM',
      status: mq4Info.status,
      color: mq4Info.hex,
      gradientId: 'mq4Grad',
      icon: Zap,
    },
    {
      title: 'MQ5 Sensor',
      subtitle: 'Hydrogen & Town Gas',
      value: metrics.mq5,
      max: 1000,
      unit: 'PPM',
      status: mq5Info.status,
      color: mq5Info.hex,
      gradientId: 'mq5Grad',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping" />
          <h3 className="text-base font-extrabold tracking-tight text-slate-900">
            4-GAS SPECTRAL ARRAY VISUALIZER
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          Real-time Multi-Gas Sensor Array
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((s, idx) => (
          <GlassCard
            key={idx}
            glow={s.status === 'CRITICAL' ? 'rose' : s.status === 'WARNING' ? 'amber' : null}
            className="h-full flex flex-col justify-between bg-white border-slate-200"
          >
            <CircularGauge {...s} />
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
