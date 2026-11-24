/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "Arial", "sans-serif"],
        sans: ["Lato", "Arial", "sans-serif"],
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        "modal-in": "modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        "backdrop-in": "backdrop-in 0.18s ease-out",
        "card-in": "card-in 0.28s ease-out both",
        "dropdown-in": "dropdown-in 0.14s ease-out",
        "like-pop": "like-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "toast-in": "toast-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "confetti-burst": "confetti-burst 700ms ease-out forwards",
        "ripple-pulse": "ripple-pulse 600ms ease-out forwards",
        "heart-float": "heart-float 900ms ease-out forwards",
        "ship-sway": "ship-sway 4.5s ease-in-out infinite",
        "blob-drift-1": "blob-drift-1 14s ease-in-out infinite",
        "blob-drift-2": "blob-drift-2 18s ease-in-out infinite",
        "bubble-rise": "bubble-rise 7s ease-in-out infinite",
        "content-drop": "content-drop 220ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "modal-in": {
          "0%": { transform: "translateY(24px) scale(0.98)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "backdrop-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "card-in": {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "dropdown-in": {
          "0%": { transform: "scale(0.95) translateY(-4px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        "like-pop": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.35)" },
          "55%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        "toast-in": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.03)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "confetti-burst": {
          "0%": { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translate(var(--confetti-tx), var(--confetti-ty)) scale(0.4) rotate(var(--confetti-rot))",
            opacity: "0",
          },
        },
        "ship-sway": {
          "0%": { transform: "rotate(-3deg) translateY(0px)" },
          "25%": { transform: "rotate(1deg) translateY(-4px)" },
          "50%": { transform: "rotate(3deg) translateY(0px)" },
          "75%": { transform: "rotate(-1deg) translateY(-3px)" },
          "100%": { transform: "rotate(-3deg) translateY(0px)" },
        },
        "blob-drift-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(24px, -28px) scale(1.08)" },
          "66%": { transform: "translate(-16px, 18px) scale(0.95)" },
        },
        "blob-drift-2": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            borderRadius: "38% 62% 63% 37% / 70% 33% 67% 30%",
          },
          "50%": {
            transform: "translate(-26px, -22px) scale(1.06)",
            borderRadius: "58% 42% 35% 65% / 40% 62% 38% 60%",
          },
        },
        "bubble-rise": {
          "0%": { transform: "translate(var(--bubble-x, 0px), 0) scale(0.6)", opacity: "0" },
          "12%": { opacity: "var(--bubble-opacity, 0.6)" },
          "88%": { opacity: "var(--bubble-opacity, 0.6)" },
          "100%": {
            transform: "translate(calc(var(--bubble-x, 0px) + 12px), -320px) scale(1)",
            opacity: "0",
          },
        },
        "content-drop": {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        "custom-sidebar-hover-bg": "rgba(210, 238, 240, 1)", // Custom color
        "custom-gradient": "rgba(0, 146, 156, 1)", // Gradient background
        // the app's brand teal, as a proper Tailwind scale instead of the
        // same half-dozen hex codes copy-pasted as arbitrary-value classes
        // everywhere (text-[#007C88], bg-[#E8F4F5], ...) - one place to
        // retune the palette instead of a repo-wide find/replace next time
        brand: {
          50: "#E8F4F5",
          100: "#D2EEF0",
          400: "#0CA3A6",
          500: "#00929C",
          550: "#007575",
          600: "#007C88",
          650: "#00949E",
          700: "#116989",
          800: "#00545C",
          900: "#004466",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            ul: {
              listStyleType: "disc",
              paddingLeft: "1.5em",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              li: {
                marginTop: "0",
                marginBottom: "0",
                color: "#000000",
              },
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: "1.5em",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              li: {
                marginTop: "0",
                marginBottom: "0",
                color: "#000000",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
