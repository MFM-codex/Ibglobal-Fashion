/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette — an "atelier catalogue" look, not a generic storefront.
        ink: "#101B2D", // deep navy — headers, primary text on light backgrounds
        inkLight: "#1C2C46",
        brass: "#B8863B", // stitching-gold accent, used sparingly
        brassLight: "#D9B876",
        wine: "#6E1423", // secondary accent — sale tags, alerts
        parchment: "#F4EEDF", // warm background
        parchmentDark: "#EAE1CA",
        charcoal: "#241F1C", // body text
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "2px",
        md: "3px",
      },
      letterSpacing: {
        wide2: "0.08em",
      },
    },
  },
  plugins: [],
};
