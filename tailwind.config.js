/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        dark: {
          950: '#030508',
          900: '#070A0F',
          850: '#0D121F',
          800: '#131B2E',
          700: '#1E293B',
          600: '#334155',
        },
        accent: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          purple: '#A855F7',
          blue: '#3B82F6',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'heat-diffuse': 'heatDiffuse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(244, 63, 94, 0.9))' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heatDiffuse: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.15)', opacity: '0.95' },
        }
      }
    },
  },
  plugins: [],
}
