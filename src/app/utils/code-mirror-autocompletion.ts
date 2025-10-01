// INFO: this is vibe coded
import { Completion, CompletionContext } from "@codemirror/autocomplete";

type TableSchema = Record<string, readonly string[]>;

const schema: TableSchema = {
	denorm_descriptors: ["index", "Name", "Units", "GROUP", "Type"],
	denorm_double_params: [
		"Entity",
		"Descriptor",
		"Value",
		"index",
		"Name",
		"Units",
		"GROUP",
		"Type",
	],
	denorm_entities: [
		"LocalId",
		"GlobalId",
		"index",
		"entity_name",
		"name",
		"category",
		"path_name",
		"project_name",
	],
	denorm_entity_params: [
		"Entity",
		"Descriptor",
		"Value",
		"index",
		"Name",
		"Units",
		"GROUP",
		"Type",
		"LocalId",
		"GlobalId",
		"entity_name",
		"name",
		"category",
		"path_name",
		"project_name",
	],
	denorm_integer_params: [
		"Entity",
		"Descriptor",
		"Value",
		"index",
		"Name",
		"Units",
		"GROUP",
		"Type",
	],
	denorm_points_params: [
		"Entity",
		"Descriptor",
		"Value",
		"index",
		"X",
		"Y",
		"Z",
		"Name",
		"Units",
		"GROUP",
		"Type",
	],
	denorm_string_params: [
		"Entity",
		"Descriptor",
		"Value",
		"index",
		"Strings",
		"Name",
		"Units",
		"GROUP",
		"Type",
	],
	Descriptors: ["Name", "Units", "Group", "Type", "index"],
	Documents: ["Title", "Path", "index"],
	DoubleParameters: ["Entity", "Descriptor", "Value", "index"],
	Entities: ["LocalId", "GlobalId", "Document", "Name", "Category", "index"],
	EntityParameters: ["Entity", "Descriptor", "Value", "index"],
	Enum_Parameter: ["index", "ParameterType"],
	Enum_RelationType: ["index", "RelationType"],
	IntegerParameters: ["Entity", "Descriptor", "Value", "index"],
	PointParameters: ["Entity", "Descriptor", "Value", "index"],
	Points: ["X", "Y", "Z", "index"],
	Relations: ["EntityA", "EntityB", "RelationType", "index"],
	StringParameters: ["Entity", "Descriptor", "Value", "index"],
	Strings: ["Strings", "index"],
} as const;

// Build completions up-front
const tableOptions: Completion[] = Object.keys(schema).map((t) => ({
	label: t,
	type: "class",
	boost: 50,
}));

const columnOptionsByTable: Record<string, Completion[]> = Object.fromEntries(
	Object.entries(schema).map(([table, cols]) => [
		table,
		cols.map((c): Completion => ({ label: c, type: "property", boost: 40 })),
	])
);

// Deduped all columns for generic suggestions
const allCols: Completion[] = Array.from(
	new Set(Object.values(schema).flat())
).map((c) => ({ label: c, type: "property", boost: 20 }));

// DuckDB-friendly keywords (avoid duplicates like FROM twice)
const keywordLabels = [
	// DML
	"SELECT",
	"DISTINCT",
	"FROM",
	"WHERE",
	"GROUP",
	"BY",
	"HAVING",
	"ORDER",
	"LIMIT",
	"OFFSET",
	"FETCH",
	"FIRST",
	"ONLY",
	"INSERT",
	"INTO",
	"VALUES",
	"UPDATE",
	"SET",
	"DELETE",
	"RETURNING",
	"UNION",
	"ALL",
	"EXCEPT",
	"INTERSECT",
	// Joins
	"JOIN",
	"INNER",
	"LEFT",
	"RIGHT",
	"FULL",
	"CROSS",
	"NATURAL",
	"ON",
	"USING",
	// DDL
	"CREATE",
	"OR",
	"REPLACE",
	"TEMP",
	"TEMPORARY",
	"TABLE",
	"VIEW",
	"SCHEMA",
	"AS",
	"DROP",
	"ALTER",
	"ADD",
	"COLUMN",
	"CASE",
	"WHEN",
	"EXISTS",
	// Utility
	"EXPLAIN",
	"DESCRIBE",
	"ANALYZE",
	"PRAGMA",
	"ATTACH",
	"DETACH",
	"DATABASE",
	// IO
	"COPY",
	"TO",
	"CSV",
	"PARQUET",
	"JSON",
	"HEADER",
	"DELIMITER",
	"QUOTE",
	"ESCAPE",
	// Types
	"BOOLEAN",
	"TINYINT",
	"SMALLINT",
	"INTEGER",
	"BIGINT",
	"HUGEINT",
	"REAL",
	"DOUBLE",
	"DECIMAL",
	"VARCHAR",
	"BLOB",
	"DATE",
	"TIME",
	"TIMESTAMP",
	"INTERVAL",
] as const;

const genericKeywords: Completion[] = keywordLabels.map((k) => ({
	label: k,
	type: "keyword",
	boost: 10,
}));

// Allow 0-length prefix suggestions by default
function safeWord(
	ctx: CompletionContext,
	re: RegExp,
	allowEmpty = true
): { from: number; to: number } | null {
	const w = ctx.matchBefore(re);
	if (!w) return null;
	if (!allowEmpty && w.from === w.to && !ctx.explicit) return null;
	return w;
}

// Helpers for alias collection
function normalizeIdent(id: string): string {
	const s = id.trim();
	if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
	if (s.startsWith("[") && s.endsWith("]")) return s.slice(1, -1);
	return s;
}

function collectAliases(sql: string): Record<string, string> {
	const aliases: Record<string, string> = {};

	const push = (alias: string, tableRef: string) => {
		const aliasNorm = normalizeIdent(alias);
		const tableLastPart = tableRef.split(".").pop() || tableRef;
		const tableNorm = normalizeIdent(tableLastPart);
		if (Object.prototype.hasOwnProperty.call(schema, tableNorm)) {
			aliases[aliasNorm] = tableNorm;
		}
	};

	let m: RegExpExecArray | null;

	// Match FROM/JOIN <tableRef> [AS] <alias>
	const fromJoinRe =
		/\b(FROM|JOIN)\s+((?:"[^"]+"|\[[^\]]+\]|[A-Za-z_][\w]*)(?:\.(?:"[^"]+"|\[[^\]]+\]|[A-Za-z_][\w]*))?)\s+(?:AS\s+)?("?[A-Za-z_][\w]*"?)/gi;
	while ((m = fromJoinRe.exec(sql))) {
		push(m[3], m[2]);
	}

	// Also catch simple FROM <table> <alias> cases; comma-separated lists are often
	// handled by repeating FROM/JOIN patterns in real-world SQL; this helps a bit.
	const fromListRe =
		/\bFROM\s+((?:"[^"]+"|\[[^\]]+\]|[A-Za-z_][\w]*)(?:\.(?:"[^"]+"|\[[^\]]+\]|[A-Za-z_][\w]*))?)\s*(?:AS\s+)?("?[A-Za-z_][\w]*"?)/gi;
	while ((m = fromListRe.exec(sql))) {
		push(m[2], m[1]);
	}

	// Optionally recognize CTEs if you want to treat them like tables (no columns here)
	// const cteRe = /\bWITH\s+("?[A-Za-z_][\w]*"?)\s+AS\s*\(/gi;
	// while ((m = cteRe.exec(sql))) {
	//   const cteName = normalizeIdent(m[1]);
	//   aliases[cteName] = cteName;
	// }

	return aliases;
}

function getCurrentStatementText(ctx: CompletionContext): string {
	const doc = ctx.state.doc;
	const text = doc.toString();
	const pos = ctx.pos;

	// Find start at last semicolon before cursor
	let start = text.lastIndexOf(";", Math.max(0, pos - 1));
	start = start === -1 ? 0 : start + 1;

	// Find end at next semicolon after cursor
	let end = text.indexOf(";", pos);
	end = end === -1 ? text.length : end;

	return text.slice(start, end);
}

// Completion source
export function sqlSchemaCompletions(ctx: CompletionContext) {
	// 1) Allow alias discovery from the current statement (includes lines below cursor)
	const statement = getCurrentStatementText(ctx);
	const aliasesCurrentStmt = collectAliases(statement);

	// 2) Optionally, also look at the whole doc for robustness (comment out if not desired)
	// This lets you pick up aliases in very long statements split by missing semicolons.
	// Merge so that aliases earlier in the statement win if duplicates appear.
	const fullDoc = ctx.state.sliceDoc(0, ctx.state.doc.length);
	const aliasesWholeDoc = collectAliases(fullDoc);
	const aliases = { ...aliasesWholeDoc, ...aliasesCurrentStmt };

	const before = ctx.state.sliceDoc(0, ctx.pos);

	// Case A: member access "qual.col" where qual = alias or table
	const memberMatch = /([A-Za-z_][\w]*)\.\w*$/.exec(before);
	if (memberMatch) {
		const w = safeWord(ctx, /\w*/);
		if (!w) return null;

		const qual = memberMatch[1];
		const table =
			aliases[qual] ||
			(Object.prototype.hasOwnProperty.call(schema, qual) ? qual : undefined);

		const options = table ? (columnOptionsByTable[table] ?? []) : [];
		if (!options || options.length === 0) return null;
		return { from: w.from, options };
	}

	// Case B: right after FROM or JOIN -> suggest tables (allow empty prefix)
	if (/\b(FROM|JOIN)\s+[A-Za-z_0-9]*$/i.test(before)) {
		const w = safeWord(ctx, /[A-Za-z_0-9]*/, true);
		if (!w) return null;
		return { from: w.from, options: tableOptions };
	}

	// Generic fallback (allow empty prefix for immediate suggestions)
	const w = safeWord(ctx, /\w*/, true);
	if (!w) return null;

	const options: Completion[] = [
		...genericKeywords,
		...tableOptions,
		...allCols,
	];
	return { from: w.from, options };
}
