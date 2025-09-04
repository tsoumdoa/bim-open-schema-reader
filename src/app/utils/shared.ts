import type { JSX } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki/bundle/web";

export async function highlightAndFormatSql(code: string, editable: boolean) {
	const out = await codeToHast(code, {
		lang: "sql",
		theme: editable ? "github-dark" : "github-light",
	});

	return {
		jsx: toJsxRuntime(out, {
			Fragment,
			jsx,
			jsxs,
		}) as JSX.Element,
		lineLength: code.split("\n").length,
	};
}
