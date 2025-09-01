/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      colors: {
        "custom-sidebar-hover-bg": "rgba(210, 238, 240, 1)", // Custom color
        "custom-gradient": "rgba(0, 146, 156, 1)", // Gradient background
      },
       typography: {
        DEFAULT: {
          css: {
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
              li: {
                marginTop: '0',
                marginBottom: '0',
                color: '#000000',
              },
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.5em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
              li: {
                marginTop: '0',
                marginBottom: '0',
                color: '#000000',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}