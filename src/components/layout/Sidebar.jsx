import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  History,
  Settings,
  ShieldCheck,
  Power,
  Activity,
  X,
} from 'lucide-react';
import { useSensorStore } from '../../store/useSensorStore';

export const Sidebar = ({ isOpen, onClose }) => {
  const { metrics, aiAnalysis } = useSensorStore();

  const navItems = [
    { name: 'Live Command', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Logs & History', path: '/history', icon: History },
    { name: 'Settings & IoT', path: '/settings', icon: Settings },
  ];

  const isExhaustActive = metrics.relayStatus === 1;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full lg:h-auto w-72 lg:w-64 shrink-0 border-r border-slate-200 bg-white p-5 flex flex-col justify-between shadow-xl lg:shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Navigation Header (Mobile close button) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 font-mono">NAVIGATION MENU</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              System Control
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Safety Score Widget */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">AI Safety Score</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-emerald-600">
                {aiAnalysis.safetyScore}
              </span>
              <span className="text-[11px] font-mono text-slate-500">/ 100</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  aiAnalysis.safetyScore > 80
                    ? 'bg-emerald-500'
                    : aiAnalysis.safetyScore > 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${aiAnalysis.safetyScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Kitchen Exhaust Fan Status Box */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                <Power className="w-3.5 h-3.5 text-emerald-600" /> Exhaust Relay
              </span>
              <span
                className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                  isExhaustActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isExhaustActive ? 'ACTIVE (ON)' : 'IDLE (OFF)'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" /> Auto IoT Telemetry
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

