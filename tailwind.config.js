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
        // All colors now reference CSS variables (defined in globals.css
        // for :root/light and .dark/dark) instead of fixed hex values, so
        // every existing bg-cardBg / text-mutedText / etc class across the
        // whole app automatically adapts to the active theme -- no
        // per-component changes needed for these tokens.
        background: 'rgb(var(--background) / <alpha-value>)',
        cardBg: 'rgb(var(--card-bg) / <alpha-value>)',
        sidebarBg: 'rgb(var(--sidebar-bg) / <alpha-value>)',
        sidebarActive: 'rgb(var(--sidebar-active) / <alpha-value>)',
        surfaceMuted: 'rgb(var(--surface-muted) / <alpha-value>)',
        secondarySurface: 'rgb(var(--secondary-surface) / <alpha-value>)',
        accentPrimary: 'rgb(var(--accent-primary) / <alpha-value>)',
        accentSuccess: 'rgb(var(--accent-success) / <alpha-value>)',
        accentInfo: 'rgb(var(--accent-info) / <alpha-value>)',
        accentWarning: 'rgb(var(--accent-warning) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        mutedText: 'rgb(var(--muted-text) / <alpha-value>)',
        secondaryText: 'rgb(var(--secondary-text) / <alpha-value>)',
        customBorder: 'rgb(var(--custom-border) / var(--custom-border-alpha))',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
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