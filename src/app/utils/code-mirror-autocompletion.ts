// INFO: this is vibe coded
import { Completion, CompletionContext } from "@codemirror/autocomplete";

type TableSchema = Record<string, readonly string[]>;

const schema: TableSchema = {
	denorm_descriptors: ["index", "name", "units", "group", "type"],
	denorm_documents: ["index", "path", "title"],
	denorm_entities: [
		"LocalId",
		"GlobalId",
		"index",
		"name",
		"type",
		"Category",
		"instance_entity_index",
		"doc_index",
		"path",
		"title",
	],
	denorm_entity_params: [
		"p_Entity",
		"p_Descriptor",
		"p_Value",
		"p_index",
		"v_LocalId",
		"v_GlobalId",
		"v_name",
		"v_type",
		"v_Category",
		"v_instance_entity_index",
		"v_doc_index",
		"v_path",
		"v_title",
		"d_name",
		"d_units",
		"d_group",
		"d_type",
	],
	denorm_integer_params: [
		"p_Entity",
		"p_Value",
		"d_name",
		"d_units",
		"d_group",
		"d_type",
	],
	denorm_points_params: [
		"p_Entity",
		"v_X",
		"v_Y",
		"v_Z",
		"d_name",
		"d_group",
		"d_type",
	],
	denorm_number_params: [
		"p_Entity",
		"v_value",
		"d_name",
		"d_units",
		"d_group",
		"d_type",
	],
	denorm_string_params: [
		"p_Entity",
		"p_index",
		"v_Strings",
		"d_name",
		"d_group",
		"d_type",
	],
	denorm_geometry_elements: [
		"instance_index",
		"entity_index",
		"mesh_index",
		"transform_index",
		"material_index",
		"flags",
		"LocalId",
		"GlobalId",
		"Category",
		"vertex_offset",
		"mesh_index_offset",
		"tx",
		"ty",
		"tz",
		"qx",
		"qy",
		"qz",
		"qw",
		"sx",
		"sy",
		"sz",
		"red",
		"green",
		"blue",
		"alpha",
		"roughness",
		"metallic",
	],
	denorm_index_buffer_view: ["index", "index_value"],
	denorm_instances_view: [
		"index",
		"entity_index",
		"material_index",
		"mesh_index",
		"transform_index",
		"flags",
	],
	denorm_materials_view: [
		"index",
		"red",
		"green",
		"blue",
		"alpha",
		"roughness",
		"metallic",
	],
	denorm_meshes_view: ["index", "vertex_offset", "index_offset"],
	denorm_transforms_view: [
		"index",
		"tx",
		"ty",
		"tz",
		"qx",
		"qy",
		"qz",
		"qw",
		"sx",
		"sy",
		"sz",
	],
	denorm_vertex_buffer_view: ["index", "x", "y", "z"],
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
	"EXCLUDE",
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
	"PIVOT",
	// Utility
	"EXPLAIN",
	"IFNULL",
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

	// Optionally recognize CTEs if you want to treat them like tables(no columns here)
	const cteRe = /\bWITH\s+("?[A-Za-z_][\w]*"?)\s+AS\s*\(/gi;
	while ((m = cteRe.exec(sql))) {
		const cteName = normalizeIdent(m[1]);
		aliases[cteName] = cteName;
	}

	return aliases;
}

function isInLineComment(text: string, pos: number): boolean {
	if (
		(pos >= 2 && text[pos - 2] === "-" && text[pos - 1] === "-") ||
		text[pos - 1] === "-"
	) {
		return true;
	}
	const lineStart = text.lastIndexOf("\n", Math.max(0, pos - 1)) + 1;
	const line = text.slice(lineStart, pos);
	const checkSingleDash = line.indexOf("-");
	if (checkSingleDash === -1) return false;
	const idx = line.indexOf("--");
	if (idx === -1) return false;
	return true;
}

// Completion source
export function sqlSchemaCompletions(ctx: CompletionContext) {
	const fullDoc = ctx.state.sliceDoc(0, ctx.state.doc.length);
	const aliases = collectAliases(fullDoc);
	const before = ctx.state.sliceDoc(0, ctx.pos);

	const docText = ctx.state.doc.toString();
	const pos = ctx.pos;
	if (isInLineComment(docText, pos)) {
		return null;
	}

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
