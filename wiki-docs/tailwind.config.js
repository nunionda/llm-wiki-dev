/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nordic: {
          white: "#F9F9F9",
          charcoal: "#344955",
          blue: "#4A6572",
          sage: "#829079",
          mint: "#D1E8E2",
          gray: "#E0E0E0",
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans KR"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
