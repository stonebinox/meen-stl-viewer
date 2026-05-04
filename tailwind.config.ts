import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ml: {
          black:    '#0A0A0A',
          charcoal: '#141414',
          gunmetal: '#1C1C1E',
          gold:     '#C9A227',
          amber:    '#D4A84B',
          champagne:'#F7E7CE',
          silver:   '#8E8E93',
          platinum: '#C7C7CC',
          white:    '#F5F5F7',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
