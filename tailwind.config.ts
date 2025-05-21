import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Keep class strategy, but apply .dark to <html> by default via index.css
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // Updated TPAHLA colors for dark theme & new accents
        tpahla: {
          purple: '#A08FF0',      // Primary Purple (lightened for dark theme)
          darkpurple: '#7E69AB',  // Secondary Purple
          gold: '#E6C670',        // Gold (slightly brighter for accents)
          'gold-dark': '#D4AF37', // Original Gold
          'gold-gradient-start': '#FDE08D', // Lighter gold for gradient
          'gold-gradient-end': '#D4AF37',   // Darker gold for gradient
          darkgreen: '#0A3B1F',   // Dark green from logo (good for dark backgrounds)
          green: '#007A21',       // Green (adjusted for visibility)
          emerald: '#00843D',     // Emerald green highlight
          red: '#FF4D4D',         // Red (adjusted)
          orange: '#FF8C00',      // Orange (adjusted)
          neutral: '#333333',     // Neutral color for dark theme (e.g., card backgrounds)
          'neutral-light': '#4A4A4A', // Lighter neutral
          'text-primary': '#EAEAEA', // Primary text on dark
          'text-secondary': '#B0B0B0', // Secondary text on dark
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(10px)'
          }
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '0.7'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.jpg')",
        'african-pattern': "linear-gradient(rgba(10, 59, 31, 0.8), rgba(10, 59, 31, 0.8)), url('/african-pattern.jpg')", // Darkened for dark theme
        'tpahla-gold-gradient': 'linear-gradient(to right, hsl(var(--tpahla-gold-gradient-start)), hsl(var(--tpahla-gold-gradient-end)))',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
