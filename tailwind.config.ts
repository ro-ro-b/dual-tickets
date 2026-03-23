import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── DUAL Tickets Design System ──
        // Warm dark base palette
        dual: {
          base: '#0d0b08',       // Page background
          surface: '#151210',    // Card/panel background
          elevated: '#1a1612',   // Elevated surface (inputs, hover)
          border: '#2a2420',     // Primary border
          'border-light': '#3a332c', // Lighter border
        },
        // Brand accents
        gold: {
          DEFAULT: '#e8a838',    // Primary accent
          light: '#f0c040',      // Lighter gold (gradients)
          dim: '#b8862b',        // Muted gold
        },
        amber: {
          DEFAULT: '#d4632a',    // Secondary accent / warm orange
        },
        // Semantic accents
        neon: '#39ff14',         // Success, live, on-chain
        purple: '#6c2bd9',      // Premium tier, special
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232, 168, 56, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(232, 168, 56, 0.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
