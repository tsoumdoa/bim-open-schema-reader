import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
	{
		ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2023,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-expressions": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"no-unsafe-finally": "warn",
			"no-useless-assignment": "warn",
			"no-useless-catch": "warn",
			"no-useless-escape": "warn",
			"prefer-const": "warn",
			"react-hooks/immutability": "warn",
			"react-hooks/purity": "warn",
			"react-hooks/refs": "warn",
			"react-hooks/set-state-in-effect": "warn",
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	},
	{
		files: ["*.config.{js,mjs,ts}"],
		languageOptions: {
			globals: globals.node,
		},
	}
);

export default eslintConfig;
