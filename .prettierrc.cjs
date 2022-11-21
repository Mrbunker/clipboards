module.exports = {
  printWidth: 100,
  trailingComma: "all",
  quoteProps: "preserve",
  singleAttributePerLine: false,
  vueIndentScriptAndStyle: true,

  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
  importOrder: [
    "^vite",
    "^vue",
    "<THIRD_PARTY_MODULES>",
    "components/",
    "hooks/",
    "api/",
    "utils/",
    "typings/",
    "^[./]",
  ],
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
};
