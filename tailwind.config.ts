import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        sand: "#f7f4ee",
        coral: "#b86f52",
        pine: "#36564d",
        mist: "#dde7e2"
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(31, 41, 51, 0.1)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(184,111,82,0.16), transparent 32%), radial-gradient(circle at bottom right, rgba(54,86,77,0.18), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
