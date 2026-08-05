/**
 * Utility helper functions for AURA-GUARD Smart Kitchen Dashboard
 */

// Web Audio API emergency buzzer tone generator
export const playAlarmSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz A5 warning tone
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio alarm playback error:', e);
  }
};

// Gas concentration category color mapping
export const getGasColor = (value, warningThreshold = 300, criticalThreshold = 600) => {
  if (value >= criticalThreshold) {
    return {
      text: 'text-rose-500',
      bg: 'bg-rose-500/20',
      border: 'border-rose-500',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]',
      hex: '#F43F5E',
      status: 'CRITICAL'
    };
  }
  if (value >= warningThreshold) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-400/20',
      border: 'border-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      hex: '#F59E0B',
      status: 'WARNING'
    };
  }
  return {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/20',
    border: 'border-emerald-400/40',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    hex: '#10B981',
    status: 'SAFE'
  };
};

// Calculate gas level percentage (0 to 1000 PPM standard range)
export const calculateGasPercentage = (ppm, maxPpm = 1000) => {
  const pct = (ppm / maxPpm) * 100;
  return Math.min(Math.max(Math.round(pct), 0), 100);
};

// Emergency Level UI Style badge configuration
export const getEmergencyBadge = (level) => {
  switch (level?.toUpperCase()) {
    case 'EMERGENCY':
    case 'CRITICAL':
      return {
        label: 'EMERGENCY LEAK DETECTED',
        badgeClass: 'bg-rose-500/30 text-rose-400 border border-rose-500/60 emergency-border-blink',
        iconColor: '#F43F5E'
      };
    case 'WARNING':
      return {
        label: 'ELEVATED HAZARD WARNING',
        badgeClass: 'bg-amber-500/30 text-amber-300 border border-amber-500/60',
        iconColor: '#F59E0B'
      };
    default:
      return {
        label: 'SYSTEM OPTIMAL & SAFE',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
        iconColor: '#10B981'
      };
  }
};

// Convert array of objects to downloadable CSV
export const downloadCSV = (data, filename = 'kitchen_sensor_history.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      return `"${val !== undefined ? val : ''}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format Date nicely
export const formatDate = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
