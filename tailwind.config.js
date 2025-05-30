// folioxe/tailwind.config.js
module.exports = {
  // ... other config
  theme: {
    extend: {
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInDown: 'fadeInDown 0.3s ease-out',
      },
    },
  },
  plugins: [],
}