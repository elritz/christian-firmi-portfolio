/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        table: {
          width: '100%',
          borderCollapse: 'collapse',
        },
        'th, td': {
          border: '1px solid #ddd',
          padding: '8px',
        },
        th: {
          backgroundColor: '#f4f4f4',
          fontWeight: 'bold',
        },
      });
    },
    require('@tailwindcss/typography'),
  ],
};
