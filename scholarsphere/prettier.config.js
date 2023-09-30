/** @type {import("prettier").Config} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  arrowParens: "always",
  htmlWhitespaceSensitivity: "css",
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "consistent",
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  importOrderCaseInsensitive: false,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    "^@/(styles)?/(.*)$",
    "^@?react(/.*)?$",
    "^@?next(/.*)?$",
    "^@?next-auth(/.*)?$",
    "^@?prisma(/.*)?$",
    "^@?vercel(/.*)?$",
    "<THIRD_PARTY_MODULES>",
    "^@/(types|lib|data|hooks|config)?/(.*)$",
    "^@/(server)?/(.*)$",
    "^@/(components)?/(.*)$",
    "^@/(app)?/(.*)$",
    "^[./]",
  ],
};

module.exports = config;
