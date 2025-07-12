/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/product/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "rgb(var(--main_color) / <alpha-value>)",
        paragraph: "rgb(var(--p_color) / <alpha-value>)",
        heading: "rgb(var(--heading_color) / <alpha-value>)",
        background: "rgb(var(--bg_color) / <alpha-value>)",
        border: "rgb(var(--border_color) / <alpha-value>)",
        sale: "rgb(var(--sale_color) / <alpha-value>)",
        yellow: {
          DEFAULT: "rgb(var(--yellow) / <alpha-value>)",
          hover: "rgb(var(--yellow-hover) / <alpha-value>)",
        },
        white: "rgb(var(--white_color) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(var(--shadow-color), 0.1)',
        deep: '0 6px 15px rgba(var(--shadow-color), 0.15)',
      },
      borderRadius: {
        soft: '8px',
      },
      spacing: {
        layout: 'var(--layout-gap)',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ':root': {
          '--shadow-color': '0, 0, 0',
          '--layout-gap': '2rem',
        },
      });
    },
  ],
}
