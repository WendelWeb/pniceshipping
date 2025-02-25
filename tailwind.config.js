const { plugin } = require("postcss");

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
      extend: {
        border: "var(--border)",
        animation: {
          'slide-in': 'slideIn 0.5s ease-in-out forwards',
        },
        keyframes: {
          slideIn: {
            '0%': { opacity: 0, transform: 'translateY(-20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        },
      },
    },
  };