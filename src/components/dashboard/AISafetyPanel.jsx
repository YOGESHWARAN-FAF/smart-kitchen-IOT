import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import {
  Sparkles,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Cpu,
  UserCheck,
  AlertTriangle,
  Flame,
} from 'lucide-react';

export const AISafetyPanel = () => {
  const { aiAnalysis, metrics } = useSensorStore();

  const isOccupantPresent = metrics.pirMotion === 1;
  const isEmergency =
    aiAnalysis.emergencyLevel === 'EMERGENCY' || aiAnalysis.emergencyLevel === 'CRITICAL';

  return (
    <GlassCard className="p-6 space-y-6 relative overflow-hidden border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                GROQ AI SAFETY ENGINE & PIR OCCUPANT DIAGNOSTIC
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold badge-yellow">
                LLAMA-3.3-70B
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous Real-time Hazard Classification & Personalized Occupant Safety Instructions
            </p>
          </div>
        </div>

        {/* PIR Occupancy Status Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold ${
          isOccupantPresent ? 'badge-yellow' : 'badge-green'
        }`}>
          {isOccupantPresent ? <AlertTriangle className="w-4 h-4 text-amber-800 animate-bounce" /> : <UserCheck className="w-4 h-4 text-emerald-700" />}
          <span>PIR OCCUPANCY: {isOccupantPresent ? 'PERSON DETECTED IN KITCHEN' : 'Kitchen Empty'}</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Safety Score Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-500">Safety Score Index</span>
          <div className="flex items-baseline justify-between my-2">
            <span className="text-4xl font-black font-mono text-emerald-600">
              {aiAnalysis.safetyScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-700">
            {aiAnalysis.riskCategory}
          </span>
        </div>

        {/* Emergency Status */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-500">Emergency Level</span>
          <div className="my-2">
            <span
              className={`text-xl font-black font-mono uppercase tracking-wider ${
                isEmergency ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
              }`}
            >
              {aiAnalysis.emergencyLevel}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {isEmergency ? 'Hazard Active' : 'Optimal Environment'}
          </span>
        </div>

        {/* Safe To Enter */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-500">Entry Clearance</span>
          <div className="flex items-center gap-2 my-2">
            {aiAnalysis.safeToEnter ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            ) : (
              <XCircle className="w-7 h-7 text-rose-600 animate-bounce" />
            )}
            <span
              className={`text-lg font-black font-mono ${
                aiAnalysis.safeToEnter ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {aiAnalysis.safeToEnter ? 'SAFE TO ENTER' : 'RESTRICTED'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {aiAnalysis.safeToEnter ? 'Zone Permitted' : 'Evacuate Zone'}
          </span>
        </div>

        {/* Detected Gas */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-500">Gas Classification</span>
          <div className="flex items-center gap-2 my-2">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-sm font-extrabold text-amber-900 font-mono truncate">
              {aiAnalysis.detectedGasType}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">4-Sensor Array</span>
        </div>
      </div>

      {/* PIR Occupant Specific Instructions Banner */}
      {isOccupantPresent && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>PERSONALIZED KITCHEN OCCUPANT INSTRUCTIONS:</span>
          </div>
          <p className="text-xs font-medium leading-relaxed">
            PIR Motion Sensor detects a person inside the kitchen. Please ensure windows are open, avoid touching electrical switches or open gas flames, and follow AI advisory below.
          </p>
        </div>
      )}

      {/* AI Reasoning Narrative */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>LLM THERMODYNAMIC DIAGNOSIS & REASONING:</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {aiAnalysis.reasoning}
        </p>
      </div>

      {/* Action Directive Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Safety Protocols */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>RECOMMENDED SAFETY PROTOCOLS:</span>
          </div>
          <ul className="space-y-2">
            {aiAnalysis.recommendedActions?.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Immediate Priority Directive */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-800">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>IMMEDIATE PRIORITY DIRECTIVE:</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-rose-300 text-rose-900 text-xs font-mono font-bold leading-relaxed shadow-sm">
            {aiAnalysis.immediateAction || 'System operating under nominal safety specs. No emergency action needed.'}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
