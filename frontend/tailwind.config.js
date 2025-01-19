/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        "custom-sidebar-hover-bg": "rgba(210, 238, 240, 1)", // Custom color
        "custom-gradient": "rgba(0, 146, 156, 1)", // Gradient background
      },
    
    },
  },
  plugins: [],
}
