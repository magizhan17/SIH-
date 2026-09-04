/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode
        'light-bg': '#FFFFFF',
        'light-secondary': '#F7F8FA',
        'light-card': '#FFFFFF',
        'light-border': '#E5E7EB',
        'light-text': '#111827',
        'light-text-secondary': '#6B7280',
        // Dark mode
        'dark-bg': '#0B0B0B',
        'dark-secondary': '#111111',
        'dark-card': '#161616',
        'dark-border': '#292929',
        'dark-text': '#FFFFFF',
        'dark-text-secondary': '#A1A1AA',
        // Status colors
        'status-healthy': '#16A34A',
        'status-warning': '#D97706',
        'status-high-risk': '#EA580C',
        'status-critical': '#DC2626',
        'status-info': '#0891B2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
