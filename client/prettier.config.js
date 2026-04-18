

module.exports = {
  sortingMethod: "lineLength",
  plugins: ["./node_modules/prettier-plugin-sort-imports/dist/index.js"],
  importOrder: [
    "^react$",
    "^react/(.*)$",
    "^next/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
