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
        ticket: {
          cyan: '#00f0ff',
          purple: '#6c2bd9',
          pink: '#ff2d78',
          dark: '#0a0a1a',
          surface: '#12122a',
          border: '#1e1e3f',
        },
        gold: {
          DEFAULT: '#c9a84c',
          dim: '#c9a84c',
          light: '#e8d48b',
        },
        vault: {
          bg: '#0a0a1a',
          surface: '#12122a',
          border: '#1e1e3f',
        },
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)' },
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
