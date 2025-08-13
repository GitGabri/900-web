/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        'premium': {
          'black': '#0a0a0a',
          'white': '#ffffff',
          'beige': '#f5f5dc',
          'cream': '#faf8f3',
          'warm-beige': '#e8e4d9',
          'dark-beige': '#d4cfc4',
          'charcoal': '#2c2c2c',
          'gold': '#d4af37',
        }
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #f5f5dc 0%, #faf8f3 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #2c2c2c 100%)',
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
