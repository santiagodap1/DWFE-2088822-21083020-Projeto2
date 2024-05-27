const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'blue': '#1DA1F1',
        'darkblue': '#2795D8',
        'lightblue': '#EFF8FF',
        'dark': '#657785',
        'light': '#AAB8C1',
        'lighter': '#E1E8ED',
        'lightest': '#F5F7FA',
      }
    },
  }
};
