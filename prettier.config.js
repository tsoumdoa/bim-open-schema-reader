// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	trailingComma: "es5",
	useTabs: true,
	tabWidth: 2,
	semi: true,
	singleQuote: false,
	plugins: [
		"prettier-plugin-sql",
		"prettier-plugin-embed",
		"prettier-plugin-tailwindcss",
		"@trivago/prettier-plugin-sort-imports",
	],
	embeddedSqlTags: ["sql"],
	language: "sql",
	keywordCase: "upper",
};

export default config;
