module.exports = {
  purge: [],
  content: [
    "./src/**/*.{html,ts}", // Ajusta esta línea a tus necesidades
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
        // ...
       justifyContent: ['hover', 'focus'],
      }
  },
  plugins: [],
}
