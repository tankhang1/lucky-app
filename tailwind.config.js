module.exports = {
  darkMode: ["selector", '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  },
  theme: {
    extend: {
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
      colors: {
        brand: {
          900: "#0F3E1E",
          600: "#316742",
          500: "#85A356",
          200: "#C9D8BB",
        },
        accent: {
          600: "#D2794E",
          400: "#E3AF93",
          100: "#F0E5D8",
        },
        neutral: {
          50: "#F3F5F7",
          100: "#E5E7E9",
          300: "#D9DEE3",
          600: "#4A4F55",
          900: "#1B1D1F",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg,#316742 0%,#85A356 60%)",
        "cta-gradient": "linear-gradient(135deg,#D2794E 0%,#E3AF93 100%)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    // 👇 Optional: define extra clamps if you want beyond defaults
    function ({ addUtilities }) {
      const newUtilities = {};
      for (let i = 1; i <= 20; i++) {
        newUtilities[`.line-clamp-${i}`] = {
          display: "-webkit-box",
          WebkitLineClamp: `${i}`,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        };
      }
      addUtilities(newUtilities, ["responsive"]);
    },
  ],
};
