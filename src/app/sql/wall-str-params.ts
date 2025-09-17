import { sql } from "../utils/queries";

export const wallStrParams = sql`
  WITH
    str_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_string_params AS p ON e.index = p.entity
      WHERE
        e.category LIKE 'Walls'
    )
  SELECT
    *
  FROM
    str_data;
`;
