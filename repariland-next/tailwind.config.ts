import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        space: ['var(--font-space)', 'system-ui', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        hologram: {
          cyan: '#00BFFF',
          blue: '#0077FF',
          gold: '#FFD700',
          deep: '#0A0A0F',
          darker: '#050508',
          panel: 'rgba(0, 191, 255, 0.08)',
          glow: 'rgba(0, 191, 255, 0.3)',
        },
        repariland: {
          coral: '#E63946',
          lime: '#2ECC71',
          azure: '#0EAFFF',
          magenta: '#FF4DB8',
          gold: '#F4D03F',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: 'calc(var(--radius) - 6px)',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        hologlow: '0 0 20px rgba(0, 191, 255, 0.3), 0 0 40px rgba(0, 191, 255, 0.1)',
        goldglow: '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
        panel: '0 0 15px rgba(0, 191, 255, 0.15), inset 0 0 15px rgba(0, 191, 255, 0.05)',
        elevate:
          'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 18px 48px -18px rgba(0,0,0,0.65)',
        elevateLg:
          'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 28px 64px -24px rgba(0,0,0,0.72)',
        dock: '0 -8px 32px -8px rgba(0,0,0,0.45)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 191, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '52%': { opacity: '0.3' },
          '54%': { opacity: '0.9' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        scanline: 'scanline 4s linear infinite',
        glitch: 'glitch 0.3s ease-in-out',
        flicker: 'flicker 4s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
