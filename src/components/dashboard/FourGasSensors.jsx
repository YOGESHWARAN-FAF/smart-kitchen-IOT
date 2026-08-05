import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { CircularGauge } from '../ui/CircularGauge';
import { useSensorStore } from '../../store/useSensorStore';
import { Flame, Fan, Sliders, ShieldAlert } from 'lucide-react';
import { getGasColor } from '../../services/helpers';

export const FourGasSensors = () => {
  const { metrics } = useSensorStore();

  const isRelayFanActive = metrics.relayStatus === 1 || metrics.manualRelay === 1;
  const isGasDetected = Math.max(metrics.mq2, metrics.mq3, metrics.mq4, metrics.mq5) > 300;

  const f1Info = getGasColor(metrics.mq2, 300, 600);
  const f2Info = getGasColor(metrics.mq3, 300, 600);
  const f3Info = getGasColor(metrics.mq4, 300, 600);
  const f4Info = getGasColor(metrics.mq5, 300, 600);

  const sensors = [
    {
      fieldId: 'Field 1',
      title: 'MQ-4 Sensor #1',
      subtitle: 'Zone 1: Stove Range LPG',
      value: metrics.mq2,
      max: 1000,
      unit: 'PPM',
      status: f1Info.status,
      color: f1Info.hex,
      gradientId: 'mq4_1Grad',
      icon: Flame,
    },
    {
      fieldId: 'Field 2',
      title: 'MQ-4 Sensor #2',
      subtitle: 'Zone 2: Cylinder Line LPG',
      value: metrics.mq3,
      max: 1000,
      unit: 'PPM',
      status: f2Info.status,
      color: f2Info.hex,
      gradientId: 'mq4_2Grad',
      icon: Flame,
    },
    {
      fieldId: 'Field 3',
      title: 'MQ-4 Sensor #3',
      subtitle: 'Zone 3: Ceiling Exhaust LPG',
      value: metrics.mq4,
      max: 1000,
      unit: 'PPM',
      status: f3Info.status,
      color: f3Info.hex,
      gradientId: 'mq4_3Grad',
      icon: Flame,
    },
    {
      fieldId: 'Field 4',
      title: 'MQ-4 Sensor #4',
      subtitle: 'Zone 4: Wall Vent LPG',
      value: metrics.mq5,
      max: 1000,
      unit: 'PPM',
      status: f4Info.status,
      color: f4Info.hex,
      gradientId: 'mq4_4Grad',
      icon: Flame,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header bar with global Relay Fan status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-1 gap-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping" />
          <h3 className="text-base font-extrabold tracking-tight text-slate-900">
            4 MQ-4 LPG SENSOR ARRAY VISUALIZER
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold ${
            isRelayFanActive
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <Fan className={`w-3.5 h-3.5 ${isRelayFanActive ? 'animate-spin text-emerald-600' : ''}`} />
            RELAY FAN: {isRelayFanActive ? 'RUNNING (ON)' : 'IDLE (OFF)'}
          </span>

          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold ${
            isGasDetected
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}>
            <Sliders className="w-3.5 h-3.5" />
            GAS VALVE: {isGasDetected ? 'OFF (90° CUT-OFF)' : 'ON (0° OPEN)'}
          </span>
        </div>
      </div>

      {/* 4 Sensor Field Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((s, idx) => (
          <GlassCard
            key={idx}
            glow={s.status === 'CRITICAL' ? 'rose' : s.status === 'WARNING' ? 'amber' : null}
            className="h-full flex flex-col justify-between bg-white border-slate-200 p-4"
          >
            <CircularGauge {...s} />

            {/* Respected Field Relay Fan & Servo Status Badge */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span className="font-bold text-slate-500">{s.fieldId}</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                isRelayFanActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                Fan: {isRelayFanActive ? 'RUNNING' : 'IDLE'}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
