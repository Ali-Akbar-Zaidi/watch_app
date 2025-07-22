/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        parisienne: ['"Parisienne"', 'cursive'],
        pacifico: ['"Pacifico"', 'cursive'],
      },
    },
  },
  plugins: [],
}