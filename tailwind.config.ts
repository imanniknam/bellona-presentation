import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ai: {
          bg:       '#020617',
          surface:  '#060d1f',
          elevated: '#0a1628',
          border:   'rgba(255,255,255,0.05)',
          green:    '#34d399',
          blue:     '#60a5fa',
          purple:   '#a78bfa',
          cyan:     '#22d3ee',
          amber:    '#fbbf24',
          red:      '#f87171',
          pink:     '#f472b6',
        },
      },
      spacing: {
        // Sidebar width token — used in ml-[sidebar] and w-[sidebar]
        'sidebar': '220px',
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-space)', 'ui-monospace', 'monospace'],
      },
      animation: {
        'blob':        'blob 12s infinite alternate',
        'blob-delay':  'blob 15s infinite alternate-reverse',
        'blob-slow':   'blob 20s infinite alternate',
        'glow-pulse':  'glow-pulse 3s ease-in-out infinite',
        'slide-up':    'slide-up 0.5s ease-out',
        'data-flow':   'data-flow 2s linear infinite',
        'scan':        'scan 4s linear infinite',
        'counter':     'counter 1s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(40px, -60px) scale(1.15)' },
          '66%':  { transform: 'translate(-30px, 30px) scale(0.9)' },
          '100%': { transform: 'translate(20px, -20px) scale(1.05)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'data-flow': {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        scan: {
          '0%':   { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px)',
        'radial-glow':  'radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '64px 64px',
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /^(bg|text|border|shadow|from|to|via)-(emerald|blue|purple|amber|cyan|pink|rose|green|teal|violet|slate)-(400|500)/ },
    { pattern: /\/(10|15|20|25)$/ },
  ],
}

export default config
