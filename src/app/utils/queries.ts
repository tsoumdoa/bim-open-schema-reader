import { sql } from "./duckdb-wasm-helpers";

export const listAllTableInfo = sql`
  SELECT
    *
  FROM
    information_schema.tables;
`;

export const listAllTableInfoWithColumnInfo = sql`
  SELECT
    table_name,
    list (column_name),
    list (data_type),
    first (table_catalog)
  FROM
    information_schema.columns
    --where table_catalog LIKE 'memory'
  GROUP BY
    table_name
`;

// exmaple with string literal
// export const listAllTableInfo = (tableName: string) => sql`
//   SELECT
//     *
//   FROM
//     information_schema.tables;
//     where table_name = ${tableName};
// `;
