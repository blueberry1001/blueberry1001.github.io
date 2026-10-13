module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    {
      postcssPlugin: "optional-self-hosted-fonts",
      Declaration: {
        "font-display": (declaration) => {
          // Fontsource defaults to swap. Keep slow fonts from hiding or shifting text.
          declaration.value = "optional";
        },
      },
    },
  ],
};
