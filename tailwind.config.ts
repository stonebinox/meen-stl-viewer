import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mm: {
          green: {
            darker:  '#1a2419',
            dark:    '#2f3e31',
            DEFAULT: '#3d5040',
            light:   '#4d6451',
            muted:   '#72907a',
          },
          brown:  '#6e483e',
          gold:   '#c9a16f',
          cream:  '#f4f1eb',
          'cream-dim': '#d5e8d7',
        },
      },
      fontFamily: {
        serif:    ['"DM Serif Display"', 'serif'],
        literata: ['Literata', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
