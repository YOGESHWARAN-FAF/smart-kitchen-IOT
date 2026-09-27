import React, { useState, useEffect } from 'react';
import { useSensorStore } from '../../store/useSensorStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import {
  ShieldAlert,
  Wifi,
  Cloud,
  Cpu,
  Sparkles,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Zap,
  Menu,
  X,
  Bell,
  BellRing,
  BellOff,
} from 'lucide-react';
import { formatDate, formatTime } from '../../services/helpers';
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
} from '../../services/browserNotification';
import toast from 'react-hot-toast';

export const Header = ({ isMobileMenuOpen, onToggleMobileMenu }) => {
  const [now, setNow] = useState(new Date());
  const [notifPermission, setNotifPermission] = useState('default');
  const { systemHealth } = useSensorStore();
  const { soundAlerts, toggleSoundAlerts, isMuted, toggleMute } = useSettingsStore();

  useEffect(() => {
    setNotifPermission(getNotificationPermission());
  }, []);

  const handleNotificationClick = async () => {
    if (notifPermission === 'default') {
      const res = await requestNotificationPermission();
      setNotifPermission(res.permission);
      if (res.permission === 'granted') {
        toast.success('Mobile & Browser notifications enabled!');
        sendTestNotification();
      } else if (res.permission === 'denied') {
        toast.error('Notifications blocked in browser settings.');
      }
    } else if (notifPermission === 'granted') {
      sendTestNotification();
      toast.success('Test alert & vibration sent! Check device.');
    } else if (notifPermission === 'denied') {
      toast.error('Notifications are blocked in your browser settings. Please permit notifications for this site.');
    } else {
      toast('Notifications are not supported on this browser.');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl px-3.5 sm:px-6 lg:px-8 py-3 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
        {/* Left Section: Brand Logo & Title & Mobile Menu Button */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 shrink-0">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  AURA-GUARD <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded badge-yellow">PRO v2.5</span>
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                Autonomous AI Smart Kitchen Safety & IoT Monitoring Command Center
              </p>
              <p className="text-[10px] text-slate-500 font-medium sm:hidden">
                AI Smart Kitchen Command
              </p>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Center & Right Wrappers */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 w-full lg:w-auto">
          {/* Center Section: Real-time Date, Clock & Mode Badges */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-3 sm:px-4 py-1.5 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 shadow-inner overflow-x-auto max-w-full">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold shrink-0">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{formatTime(now)}</span>
            </div>
            <div className="h-3 w-px bg-slate-300 shrink-0" />
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(now)}</span>
            </div>
            <div className="hidden sm:block h-3 w-px bg-slate-300 shrink-0" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-extrabold badge-green shrink-0">
              <Zap className="w-3 h-3 text-emerald-600" />
              <span>REALTIME IoT</span>
            </div>
          </div>

          {/* Right Section: Live Connectivity Health Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full py-0.5">
            {/* WiFi Status */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono shrink-0">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] text-slate-800 font-bold">92%</span>
            </div>

            {/* ThingSpeak Status */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl badge-yellow text-xs font-mono shrink-0" title="ThingSpeak REST Status">
              <Cloud className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase font-bold">{systemHealth.thingSpeak}</span>
            </div>

            {/* Groq AI Engine Status */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-mono font-bold shadow-sm shrink-0" title="Groq AI REST Engine">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="text-[11px]">GROQ AI</span>
            </div>

            {/* ESP32 Status */}
            <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono shrink-0">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] text-slate-800 font-bold">ESP32</span>
            </div>

            {/* Mobile Browser Push Notification Button */}
            <button
              onClick={handleNotificationClick}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold transition-all shrink-0 ${
                notifPermission === 'granted'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-sm'
                  : notifPermission === 'denied'
                  ? 'bg-slate-100 text-slate-500 border-slate-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm animate-pulse hover:bg-amber-200'
              }`}
              title={
                notifPermission === 'granted'
                  ? 'Mobile Notifications Enabled - Click to test alert'
                  : notifPermission === 'denied'
                  ? 'Notifications Blocked in Browser - Click for info'
                  : 'Click to Enable Mobile Browser Notifications & Vibration'
              }
            >
              {notifPermission === 'granted' ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">ALERTS ON</span>
                  <span className="sm:hidden">ALERTS</span>
                </>
              ) : notifPermission === 'denied' ? (
                <>
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">MUTED</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                  <span>ENABLE ALERTS</span>
                </>
              )}
            </button>

            {/* Audio Alert Siren Mute Button */}
            <button
              onClick={toggleMute}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-bold transition-all shrink-0 ${
                isMuted
                  ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm animate-pulse'
              }`}
              title={isMuted ? 'Alarm Siren Muted - Click to Unmute' : 'Alarm Siren Active - Click to Mute'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600" />
                  <span>MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>ALARM ON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

