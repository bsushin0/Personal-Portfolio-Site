import type { Config } from "tailwindcss"

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
      padding: "2rem",
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
        /* Neural Deep Colors */
        neural: {
          "950": "#020617",
          "900": "#0f172a",
          "800": "#1e293b",
          "700": "#334155",
          "600": "#475569",
        },
        /* Accent Colors - Cyan Primary */
        accent: {
          "cyan": "#22D3EE",
          "indigo": "#6366F1",
          "pink": "#EC4899",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.2)",
        "glow-cyan-lg": "0 0 40px rgba(34, 211, 238, 0.3)",
        "glow-indigo": "0 0 20px rgba(99, 102, 241, 0.2)",
        "glow-indigo-lg": "0 0 40px rgba(99, 102, 241, 0.3)",
        "glow-purple": "0 0 20px rgba(157, 78, 221, 0.3)",
        "glow-purple-lg": "0 0 40px rgba(157, 78, 221, 0.5)",
        "glass": "0 8px 30px rgba(0, 0, 0, 0.04)",
      },
      backgroundImage: {
        "gradient-neural": "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1a1a3e 100%)",
        "gradient-lab": "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)",
        "gradient-cyan-glow": "linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0) 100%)",
        "gradient-indigo-glow": "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 100%)",
        "gradient-ai-border": "conic-gradient(from 0deg, #22D3EE, #6366F1, #22D3EE)",
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
            boxShadow: "0 0 20px rgba(34, 211, 238, 0.2), 0 0 40px rgba(34, 211, 238, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(34, 211, 238, 0.4), 0 0 60px rgba(34, 211, 238, 0.2)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-neural": "pulse-neural 2s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      filter: {
        "saturate-150": "saturate(1.5)",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config

          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
