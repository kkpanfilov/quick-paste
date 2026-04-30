export default {
  trailingComma: "all",
  tabWidth: 2,

  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrderParserPlugins: ["typescript", "decorators-legacy"],

  importOrder: [
    // Node.js built-in modules
    "^(node:.*)$",
    "^(fs|path|crypto|http|https|url|util|stream|buffer|events|os)(/.*)?$",

    // Nest.js packages
    "^@nestjs/(.*)$",

    // Third-party packages
    "<THIRD_PARTY_MODULES>",

    // Project aliases
    "^@/(.*)$",
    "^src/(.*)$",

    // Relative imports
    "^[./]",
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
