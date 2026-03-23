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
        // ── Monolith Design System ──
        surface: {
          DEFAULT: '#131313',
          dim: '#131313',
          bright: '#393939',
          container: {
            DEFAULT: '#1f1f1f',
            lowest: '#0e0e0e',
            low: '#1b1b1b',
            high: '#2a2a2a',
            highest: '#353535',
          },
          variant: '#353535',
        },
        primary: {
          DEFAULT: '#ffffff',
          container: '#d4d4d4',
          fixed: { DEFAULT: '#5d5f5f', dim: '#454747' },
        },
        secondary: {
          DEFAULT: '#c7c6c6',
          container: '#464747',
          fixed: { DEFAULT: '#c7c6c6', dim: '#ababab' },
        },
        'on-primary': '#1a1c1c',
        'on-surface': '#e2e2e2',
        'on-surface-variant': '#c6c6c6',
        'on-background': '#e2e2e2',
        outline: { DEFAULT: '#919191', variant: '#474747' },
        'inverse-surface': '#e2e2e2',
        'inverse-on-surface': '#303030',
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        label: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '9999px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'marquee': 'marquee 30s linear infinite',
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
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
