/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],  
  theme: {
    colors: {
        white: '#fff',
        'blue': '#00bcb5',
        'transparent': 'rgba(255,255,255, 0.3)',
        'white-transparent': 'rgba(255,255,255, 0.3)',
        'white-transparent2': 'rgba(255,255,255, 0.5)',
        'disabled': 'rgba(120,120,120, 1)',
        'disabled-transparent': 'rgba(55,55,55, 0.1)',
        'status-good': '#bfff9c',
    },
    extend: {},
  },
  plugins: [],
}

