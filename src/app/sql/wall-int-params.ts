import { sql } from "../utils/queries";

export const wallIntParams = sql`
  WITH
    int_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_integer_params AS p ON e.index = p.entity
      WHERE
        e.category LIKE 'Walls'
    )
  SELECT
    *
  FROM
    int_data;
`;
