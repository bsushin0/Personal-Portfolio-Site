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
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
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
        /* Futuristic color additions */
        cyan: {
          "50": "#e0f7ff",
          "100": "#b3edff",
          "200": "#80e1ff",
          "300": "#4dd5ff",
          "400": "#26cbff",
          "500": "#00c1ff",
          "600": "#00a8d8",
          "700": "#0088b0",
          "800": "#006688",
          "900": "#004460",
          "950": "#002838",
        },
        "neon-purple": {
          "50": "#f3e8ff",
          "100": "#e9d5ff",
          "200": "#d8b4ff",
          "300": "#c084ff",
          "400": "#a855ff",
          "500": "#9d4edd",
          "600": "#7c3aed",
          "700": "#6d28d9",
          "800": "#5b21b6",
          "900": "#4c1d95",
          "950": "#2d1b4e",
        },
        "dark-blue": {
          "50": "#f0f4ff",
          "100": "#e0e8ff",
          "200": "#c7d5ff",
          "300": "#a8b8ff",
          "400": "#8096ff",
          "500": "#6b7dff",
          "600": "#5a5bff",
          "700": "#4f46e5",
          "800": "#3730a3",
          "900": "#1f2937",
          "950": "#0a0e27",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 193, 255, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 193, 255, 0.5)",
        "glow-purple": "0 0 20px rgba(157, 78, 221, 0.3)",
        "glow-purple-lg": "0 0 40px rgba(157, 78, 221, 0.5)",
      },
      backgroundImage: {
        "gradient-futuristic": "linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f0f2e 100%)",
        "gradient-cyan-glow": "linear-gradient(135deg, rgba(0, 193, 255, 0.1) 0%, rgba(0, 193, 255, 0) 100%)",
        "gradient-purple-glow": "linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0) 100%)",
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
