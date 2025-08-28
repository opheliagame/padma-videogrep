/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'knit-pattern': 'url(images/thread-oil.png)'
      },
      fontFamily: {
        display: ['Teko', 'sans-serif'],
        sans: ['Biryani', 'sans-serif']
      }
    }
  },
  plugins: []
}
