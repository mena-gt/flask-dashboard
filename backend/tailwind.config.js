/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './core/templates/dashboard.html',
  ],
  theme: {
    extend: {
      colors: {
        'first': '#363740',
        'second': '#9FA2B4',
        'third': '#F7F8FC',
        'fourth': '#165DFF',
        'fifth': '#50CD89',
        'sixth': '#F0F0F0',
        'seventh': '#4E5969',
        'custom-green': '#29CC97',
        'custom-yellow': '#FEC400',
        'custom-red': '#F12B2C'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
