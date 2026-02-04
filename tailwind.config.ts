import type { Config } from "tailwindcss"
import tailwindAnimate from "tailwindcss-animate"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Geist', 'Space Grotesk', 'sans-serif'],
        display: ['Geist', 'Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neural: {
          "950": "#020617",
          "900": "#0f172a",
          "800": "#1e293b",
          "700": "#334155",
          "600": "#475569",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-cyan": "0 10px 30px rgba(99, 102, 241, 0.18)",
        "glow-cyan-lg": "0 16px 40px rgba(99, 102, 241, 0.22)",
        "glow-indigo": "0 10px 30px rgba(99, 102, 241, 0.18)",
        "glow-indigo-lg": "0 16px 40px rgba(99, 102, 241, 0.22)",
        "glow-purple": "0 10px 30px rgba(99, 102, 241, 0.18)",
        "glow-purple-lg": "0 16px 40px rgba(99, 102, 241, 0.22)",
        "glass": "0 12px 36px rgba(15, 23, 42, 0.08)",
        "card-soft": "0 20px 50px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-neural": "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
        "gradient-lab": "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
        "gradient-cyan-glow": "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 100%)",
        "gradient-indigo-glow": "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 100%)",
        "gradient-ai-border": "conic-gradient(from 0deg, #6366F1, #A5B4FC, #6366F1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-neural": {
          "0%, 100%": {
            boxShadow: "0 0 16px rgba(99, 102, 241, 0.18), 0 0 32px rgba(99, 102, 241, 0.08)",
          },
          "50%": {
            boxShadow: "0 0 24px rgba(99, 102, 241, 0.26), 0 0 48px rgba(99, 102, 241, 0.12)",
          },
        },
        // Holographic Bust animations
        "hologram-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "hologram-glow-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "hologram-flicker": {
          "0%, 100%": { opacity: "1", transform: "skewX(0deg)" },
          "5%": { opacity: "0.85", transform: "skewX(0.5deg)" },
          "10%": { opacity: "1", transform: "skewX(-0.3deg)" },
          "15%": { opacity: "0.9", transform: "skewX(0deg)" },
          "40%": { opacity: "1", transform: "skewX(0deg)" },
          "42%": { opacity: "0.8", transform: "skewX(1deg) translateX(2px)" },
          "44%": { opacity: "1", transform: "skewX(0deg)" },
          "70%": { opacity: "1", transform: "skewX(0deg)" },
          "72%": { opacity: "0.88", transform: "skewX(-0.5deg)" },
          "74%": { opacity: "1", transform: "skewX(0deg)" },
        },
        "hologram-scan": {
          "0%": { top: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        "hologram-glitch-slice": {
          "0%, 100%": { opacity: "0", transform: "translateX(0)" },
          "20%": { opacity: "0" },
          "21%": { opacity: "1", transform: "translateX(3px)" },
          "23%": { opacity: "0", transform: "translateX(-2px)" },
          "60%": { opacity: "0" },
          "61%": { opacity: "1", transform: "translateX(-4px)" },
          "63%": { opacity: "0", transform: "translateX(1px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-neural": "pulse-neural 2s ease-in-out infinite",
        // Holographic Bust animations
        "hologram-float": "hologram-float 4s ease-in-out infinite",
        "hologram-pulse": "hologram-glow-pulse 4s ease-in-out infinite",
        "hologram-pulse-slow": "hologram-glow-pulse 6s ease-in-out infinite",
        "hologram-flicker": "hologram-flicker 8s ease-in-out infinite",
        "hologram-scan": "hologram-scan 3s linear infinite",
        "hologram-glitch-slice": "hologram-glitch-slice 6s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config

export default config
