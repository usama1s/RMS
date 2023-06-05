/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    gridTemplateColumns: {
      fluid: "repeat(auto-fit, minmax(20rem, 1fr))",
    },
  },
};
