import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export const LiveCharts = () => {
  const { history } = useSensorStore();
  const [activeTab, setActiveTab] = useState('gases');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl font-mono text-xs space-y-1">
          <p className="text-slate-900 font-bold border-b border-slate-200 pb-1 mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 font-bold" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-extrabold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="space-y-4 bg-white border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            <ChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              24-HOUR TELEMETRY ANALYTICS & TIMELINES
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time High-Frequency Sensor Stream (Recharts Engine)
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
          {[
            { id: 'gases', label: 'Gas Array (MQ2-5)' },
            { id: 'environment', label: 'Temp & Humidity' },
            { id: 'safety', label: 'AI Safety Score' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'gases' ? (
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="timestamp" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey="mq2" name="MQ2 (LPG)" stroke="#EF4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mq3" name="MQ3 (Alcohol)" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mq4" name="MQ4 (Methane)" stroke="#06B6D4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mq5" name="MQ5 (Hydrogen)" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          ) : activeTab === 'environment' ? (
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="timestamp" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={2} />
              <Area type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} />
            </AreaChart>
          ) : (
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="timestamp" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="safetyScore" name="Safety Score" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
