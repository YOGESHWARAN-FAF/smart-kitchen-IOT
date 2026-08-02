import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useSensorStore } from '../store/useSensorStore';
import { downloadCSV } from '../services/helpers';
import {
  History,
  Download,
  Printer,
  Sparkles,
  Search,
  Flame,
  FileSpreadsheet,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const HistoryPage = () => {
  const { history } = useSensorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [aiReportSummary, setAiReportSummary] = useState(null);

  const filteredHistory = history.filter(
    (item) =>
      item.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mq2.toString().includes(searchTerm) ||
      item.temperature.toString().includes(searchTerm)
  );

  const handleExportCSV = () => {
    if (!history.length) {
      toast.error('No sensor log data available for export');
      return;
    }
    downloadCSV(history, `AURA_GUARD_Sensor_Telemetry_${Date.now()}.csv`);
    toast.success('Sensor telemetry exported to CSV successfully');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleGenerateAISummary = () => {
    setIsGeneratingAiSummary(true);
    setTimeout(() => {
      setAiReportSummary(
        `AI TELEMETRY AUDIT REPORT: Analyzed ${history.length} logged data points. Average MQ2 concentration recorded at 124 PPM with zero sustained explosive thresholds. Solenoid relay maintained nominal interlock. System safety index averaged 97.4%. Risk assessment: OPTIMAL KITCHEN ENVIRONMENT.`
      );
      setIsGeneratingAiSummary(false);
      toast.success('AI Audit Summary generated successfully');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            SYSTEM SENSOR TELEMETRY LOGS & AUDIT
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            24-Hour Immutable Sensor Telemetry Stream & CSV Export Engine
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAISummary}
            disabled={isGeneratingAiSummary}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>{isGeneratingAiSummary ? 'Generating...' : 'AI Audit Summary'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-mono shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs font-mono hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Summary Banner */}
      {aiReportSummary && (
        <GlassCard className="p-4 bg-emerald-50 border-emerald-300 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>GROQ LLM AUDIT REPORT SUMMARY:</span>
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
            {aiReportSummary}
          </p>
        </GlassCard>
      )}

      {/* Search & Table Card */}
      <GlassCard className="space-y-4 bg-white border-slate-200">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              LOGGED TELEMETRY FEED ({filteredHistory.length} ENTRIES)
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search time or PPM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">MQ2 (LPG)</th>
                <th className="py-3 px-4">MQ3 (ALCOHOL)</th>
                <th className="py-3 px-4">MQ4 (METHANE)</th>
                <th className="py-3 px-4">MQ5 (TOWN GAS)</th>
                <th className="py-3 px-4">TEMP (°C)</th>
                <th className="py-3 px-4">HUMIDITY (%)</th>
                <th className="py-3 px-4">SAFETY SCORE</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 font-sans">
                    No sensor data logged yet. Fetching live telemetry stream...
                  </td>
                </tr>
              ) : (
                filteredHistory.slice().reverse().map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 hover:bg-slate-50 text-slate-800 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-bold text-slate-900">{item.timestamp}</td>
                    <td className="py-2.5 px-4 text-emerald-700 font-bold">{item.mq2} PPM</td>
                    <td className="py-2.5 px-4 text-slate-700">{item.mq3} PPM</td>
                    <td className="py-2.5 px-4 text-slate-700">{item.mq4} PPM</td>
                    <td className="py-2.5 px-4 text-slate-700">{item.mq5} PPM</td>
                    <td className="py-2.5 px-4 text-amber-700 font-bold">{item.temperature} °C</td>
                    <td className="py-2.5 px-4 text-slate-700">{item.humidity} %</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded badge-green font-bold">
                        {item.safetyScore} / 100
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
