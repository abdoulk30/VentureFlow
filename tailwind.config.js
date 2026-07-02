/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#08080d',     // Figma near-black base
        cardBg: '#0f0f17',         // Card container background
        sidebarBg: '#0c0c14',      // Left sidebar canvas
        surfaceMuted: '#1a1a28',   // Secondary buttons / hover states
        accentPrimary: '#7c5cfc',  // Electric Violet
        accentSuccess: '#00e5a0',  // Electric Green
        accentInfo: '#38bdf8',     // Sky Blue
        accentWarning: '#fb923c',  // Orange
        destructive: '#f43f5e',    // Red
        mutedText: '#6b6b84',      // Neutral gray text
        customBorder: 'rgba(255, 255, 255, 0.07)', // Ultra-thin figma line
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '6px',
      }
    },
  },
  plugins: [],
}