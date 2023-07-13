/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        color1: '#03045E',
        color2: '#0077B6',
        color3: '#00B4D8',
        color4: '#90E0EF',
        color5: '#CAF0F8',
      }
    },
  },
  plugins: [],
}

// --columbia-blue: #bcd4deff;
// --light-blue: #a5ccd1ff;
// --cadet-gray: #a0b9bfff;
// --cadet-gray-2: #9dacb2ff;
// --cadet-gray-3: #949ba0ff;