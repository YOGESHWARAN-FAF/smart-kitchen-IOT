/**
 * Mobile & Browser Push Notification Service for Aura-Guard
 * Features:
 * - Native Web Notification API
 * - Mobile Haptic Vibration Patterns (Android Chrome, Firefox, Safari)
 * - Anti-flood notification debouncing via notification tags
 * - Interactive test utility
 */

// Check if Notification API is supported
export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Check if Vibration API is supported (Mobile devices)
export const isVibrationSupported = () => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

// Get current permission status: 'granted' | 'denied' | 'default' | 'unsupported'
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

// Request Notification Permission from the user
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return {
      supported: false,
      permission: 'unsupported',
      message: 'Browser notifications are not supported on this browser/device.',
    };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Vibrate briefly to confirm setup on mobile devices
      triggerMobileHaptic([100, 50, 100]);
      return {
        supported: true,
        permission: 'granted',
        message: 'Mobile browser notifications enabled successfully!',
      };
    } else if (permission === 'denied') {
      return {
        supported: true,
        permission: 'denied',
        message: 'Notification permission was denied. Please allow notifications in your browser settings.',
      };
    } else {
      return {
        supported: true,
        permission: 'default',
        message: 'Notification permission prompt was dismissed.',
      };
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return {
      supported: true,
      permission: Notification.permission || 'denied',
      message: err.message,
    };
  }
};

// Mobile Haptic Vibration Pattern
export const triggerMobileHaptic = (pattern = [400, 150, 400, 150, 800]) => {
  if (isVibrationSupported()) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Silent catch on devices with strict background vibration limits
    }
  }
};

// Stop Mobile Vibration
export const stopMobileHaptic = () => {
  if (isVibrationSupported()) {
    try {
      navigator.vibrate(0);
    } catch (e) {
      // Silent catch
    }
  }
};

// Gas Hazard Emergency Notification Dispatcher
export const showGasLeakNotification = (options = {}) => {
  const {
    maxGas = 0,
    immediateAction = 'LPG Gas Leak Detected! Autonomous cut-off valve engaged.',
    detectedGasType = 'LPG Gas Leak',
  } = options;

  // 1. Mobile Haptic Emergency Vibration (Severe double-pulse pattern)
  triggerMobileHaptic([500, 200, 500, 200, 1000]);

  // 2. Native System Notification
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const title = `🚨 CRITICAL HAZARD: ${maxGas} PPM (${detectedGasType})`;
      const body = `${immediateAction}\n• Windows 1 & 2: OPEN (90°)\n• Gas Valve: CUT-OFF (90°)\n• Exhaust Fan: ACTIVE (1)`;

      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'aura-guard-gas-leak-alert', // Ensures latest alert replaces previous rather than flooding
        renotify: true,
        requireInteraction: true,
        silent: false,
      });

      notification.onclick = () => {
        if (typeof window !== 'undefined') {
          window.focus();
        }
        notification.close();
      };
    } catch (err) {
      console.warn('Browser Notification dispatch error:', err.message);
    }
  }
};

// Test Notification Dispatcher (For user manual verification on mobile/desktop)
export const sendTestNotification = () => {
  triggerMobileHaptic([200, 100, 200]);

  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const n = new Notification('🔔 Aura-Guard Mobile Alert Test', {
        body: 'Mobile browser notifications and vibration feedback are operational! Emergency gas leak alerts will appear here.',
        icon: '/favicon.ico',
        tag: 'aura-guard-test-notification',
      });
      n.onclick = () => {
        if (typeof window !== 'undefined') window.focus();
        n.close();
      };
      return true;
    } catch (err) {
      console.warn('Test notification error:', err);
      return false;
    }
  }
  return false;
};
