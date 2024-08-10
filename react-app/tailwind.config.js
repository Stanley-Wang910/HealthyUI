/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  important: '#root',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
