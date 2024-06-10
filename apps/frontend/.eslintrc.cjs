module.exports = {
  env: { browser: true, es2020: true },
  extends: ["custom", "plugin:react-hooks/recommended"],
  root: true,
  parserOptions: { ecmaVersion: "ESNext", sourceType: "module" },
  plugins: [
      "react-refresh",
      "react-compiler"
  ],
  rules: {
    "react-refresh/only-export-components": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react-compiler/react-compiler": "error"
  },
};
