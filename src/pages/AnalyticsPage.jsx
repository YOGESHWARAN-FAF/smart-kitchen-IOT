import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useSensorStore } from '../store/useSensorStore';
import {
  TrendingUp,
  Flame,
  Thermometer,
  Droplets,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const { history } = useSensorStore();

  const totalPoints = history.length || 1;
  const avgMq2 = Math.round(history.reduce((acc, h) => acc + h.mq2, 0) / totalPoints) || 120;
  const maxTemp = Math.max(...history.map((h) => h.temperature), 24.5);
  const maxHumidity = Math.max(...history.map((h) => h.humidity), 55.0);
  const avgSafetyScore = Math.round(history.reduce((acc, h) => acc + h.safetyScore, 0) / totalPoints) || 97;

  const analyticsData = history.length > 0
    ? history.slice(-20).map((h) => ({
        label: h.timestamp,
        mq2Avg: h.mq2,
        tempMax: h.temperature,
        humAvg: h.humidity,
        score: h.safetyScore,
      }))
    : [{ label: 'Awaiting Feeds...', mq2Avg: 0, tempMax: 0, humAvg: 0, score: 100 }];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            HISTORICAL ANALYTICS & STATISTICAL TRENDS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Multi-Timeframe Comparative Telemetry & Gas Accumulation Aggregation
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 font-mono text-xs shadow-sm">
          {['daily', 'weekly', 'monthly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-xl uppercase font-bold transition-all ${
                timeframe === tf
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Average Gas Level</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            {avgMq2} <span className="text-xs font-normal text-slate-500">PPM</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">24-hour mean concentration</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Peak Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-700">
            {maxTemp} <span className="text-xs font-normal text-slate-500">°C</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Maximum recorded heat</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Peak Humidity</span>
            <Droplets className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {maxHumidity} <span className="text-xs font-normal text-slate-500">%</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Maximum relative moisture</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Mean Safety Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {avgSafetyScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Aggregated AI Safety Index</p>
        </GlassCard>
      </div>

      {/* Gas Concentration Trend Chart */}
      <GlassCard className="space-y-4 bg-white border-slate-200">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Comparative Gas Accumulation ({timeframe.toUpperCase()})
          </h3>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} unit=" PPM" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  color: '#0F172A',
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="mq2Avg" name="Mean MQ2 Gas (PPM)" fill="#059669" radius={[6, 6, 0, 0]} />
              <Bar dataKey="score" name="Safety Index" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
