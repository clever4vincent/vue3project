/* eslint-disable */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-prettier/skip-formatting", "./.eslintrc-auto-import.json"],
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-undef": "off",
    semi: ["error", "always"],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "space-before-function-paren": 0,
    // "vue/array-bracket-spacing": "error",
    // "vue/arrow-spacing": "error",
    // "vue/block-spacing": "error",
    // "vue/brace-style": "error",
    // "vue/camelcase": "off",
    // "vue/comma-dangle": "error",
    // "vue/component-name-in-template-casing": "error",
    // "vue/eqeqeq": "error",
    // "vue/key-spacing": "error",
    // "vue/match-component-file-name": "error",
    // "vue/object-curly-spacing": "off",
    // "no-useless-escape": "off",
    "no-unused-vars": "off",
    // "vue/attribute-hyphenation": "off",
    // "vue/custom-event-name-casing": "off",
    "vue/multi-word-component-names": "off",
    // "vue/comment-directive": "off",
  },
};
