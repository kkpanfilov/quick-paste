export default {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react$",
    "^react-dom$",
    "^react/(.*)$",
    "^react-dom/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/(?!.*\\.scss$).*$",
    "^[./](?!.*\\.scss$).*$",
    "^.+\\.scss$"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};
