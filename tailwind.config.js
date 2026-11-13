/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8F5EF', olive: '#50583B', 'olive-dark': '#343B28', terracotta: '#BC4F32', sand: '#E5D1B7', ink: '#292A25', muted: '#77766F', line: '#E6DED1', surface: '#FFFEFB', sage: '#E8EBDD'
      },
      fontFamily: { display: ['Playfair Display', 'Georgia', 'serif'], sans: ['DM Sans', 'sans-serif'] },
      boxShadow: { card: '0 8px 28px rgba(41, 42, 37, .055)', lift: '0 14px 36px rgba(41, 42, 37, .11)' },
      borderRadius: { '4xl': '2rem' }
    }
  },
  plugins: []
}
