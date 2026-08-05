/**
 * Continuous Web Audio API Siren / Buzzer Alarm Manager with Mute Support
 */

let audioCtx = null;
let alarmIntervalId = null;
let isMuted = false;
let isAlarmRunning = false;

export const setAlarmMuted = (muted) => {
  isMuted = muted;
  if (isMuted && isAlarmRunning) {
    stopAlarmToneOnly();
  }
};

export const getAlarmMuted = () => isMuted;

const stopAlarmToneOnly = () => {
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
};

export const startContinuousAlarm = () => {
  isAlarmRunning = true;
  if (isMuted) return;
  if (alarmIntervalId) return; // Already running

  const playBeepPair = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new AudioCtx();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // High Tone Beep (880Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(950, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Low Tone Beep (650Hz)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(650, now + 0.2);
      gain2.gain.setValueAtTime(0.25, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.38);
    } catch (err) {
      console.warn('Audio alarm playback error:', err);
    }
  };

  // Play immediately and repeat every 500ms for continuous warning siren
  playBeepPair();
  alarmIntervalId = setInterval(playBeepPair, 500);
};

export const stopContinuousAlarm = () => {
  isAlarmRunning = false;
  stopAlarmToneOnly();
};
