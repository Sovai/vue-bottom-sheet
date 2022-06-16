const spacing = () => {
  // spacing in px
  const spacing = {};
  for (let i = 0; i <= 100; i++) {
    spacing[`${i}`] = `${i}px`;
  }
  return spacing;
};

module.exports = {
  mode: "jit",
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    spacing: spacing(),
    // screens: {
    //   xs: "320px",
    //   sm: "375px",
    //   md: "450px",
    //   lg: "768px",
    // },
    extend: {
      backdropBlur: {
        sheet: "107px"
      }
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      red: "#F86C6C",
      yellow: "#FFB645",
      green: "#ABED94",
      primary: "#ec8253",
      white: "#ffffff",
      black: "#070708",
      skeleton: "#28282C",
      overlay: "rgba(7, 7, 8, 0.65)",
      // "black-7": "rgba(42, 42, 46, 0.7)",
      "black-8": "rgba(42, 42, 46, 0.8)",
      card: "#17171A",
      input: "#1D1D1E",
      "white-1": "rgba(255,255,255,0.1)",
      "white-2": "rgba(255,255,255,0.2)",
      // "white-3": "rgba(255,255,255,0.3)",
      "white-04": "rgba(255,255,255,0.04)",
      "white-5": "rgba(255,255,255,0.5)",
      "white-6": "rgba(255,255,255,0.6)"
      // "white-8": "rgba(255,255,255,0.8)",
    }
  },

  plugins: [],

  // these options allow to inspect color in dev tool instead of seeing tw-variable
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeHolderOpacity: false,
    ringOpacity: false
  }
};
