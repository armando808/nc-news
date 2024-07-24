module.exports = {
  darkMode: 'class', // or 'media' if you prefer to use the system's dark mode setting
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        customRed: 'rgb(217, 1, 1)',
        customDark: '#1a1a1a', // Almost black
        customGray: '#2e2e2e', // Dark gray for cards
        lightGray: '#f9f9f9', // Light gray for comments
      },
      boxShadow: {
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25)', // Made the shadow darker
      },
    },
  },
  plugins: [],
};
