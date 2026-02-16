import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Slide content colors (커스터마이징 가능)
        slide: {
          primary: "hsl(var(--slide-primary))",
          secondary: "hsl(var(--slide-secondary))",
          accent: "hsl(var(--slide-accent))",
        },
        // Apple System Colors
        apple: {
          blue: {
            light: "#007AFF",
            dark: "#0A84FF",
          },
          green: {
            light: "#34C759",
            dark: "#30D158",
          },
          indigo: {
            light: "#5856D6",
            dark: "#5E5CE6",
          },
          orange: {
            light: "#FF9500",
            dark: "#FF9F0A",
          },
          pink: {
            light: "#FF2D55",
            dark: "#FF375F",
          },
          purple: {
            light: "#AF52DE",
            dark: "#BF5AF2",
          },
          red: {
            light: "#FF3B30",
            dark: "#FF453A",
          },
          teal: {
            light: "#5AC8FA",
            dark: "#64D2FF",
          },
          yellow: {
            light: "#FFCC00",
            dark: "#FFD60A",
          },
          gray: {
            1: "#F2F2F7",
            2: "#E5E5EA",
            3: "#D1D1D6",
            4: "#C7C7CC",
            5: "#AEAEB2",
            6: "#8E8E93",
          },
        },
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-mono)',
          'ui-monospace',
          'SF Mono',
          'Consolas',
          'monospace',
        ],
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
