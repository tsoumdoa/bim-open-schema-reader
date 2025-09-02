import type { JSX } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki/bundle/web";
import { format } from "sql-formatter";

export async function highlightAndFormatSql(code: string, editable: boolean) {
  const formatted = format(code, { language: "duckdb" });
  const out = await codeToHast(formatted, {
    lang: "sql",
    theme: editable ? "github-dark" : "github-light",
  });

  return {
    jsx: toJsxRuntime(out, {
      Fragment,
      jsx,
      jsxs,
    }) as JSX.Element,
    lineLength: formatted.split("\n").length,
  };
}
