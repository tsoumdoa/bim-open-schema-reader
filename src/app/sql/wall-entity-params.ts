import { sql } from "../utils/queries";

export const wallEntityParams = sql`
  WITH
    entity_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_entity_params AS p ON e.index = p.entity
      WHERE
        e.category = 'Walls'
    )
  SELECT
    *
  FROM
    entity_data
  ORDER BY
    index
`;
