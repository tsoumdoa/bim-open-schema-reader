import { sql } from "../utils/queries";

export const structuralColumnSchedule = sql`
  WITH
    entity_data AS (
      SELECT
        *
      FROM
        denorm_entities AS e
        INNER JOIN denorm_entity_params AS p ON e.index = p.entity
        INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
        INNER JOIN denorm_entities AS e2 ON p.Value = e2.index
      WHERE
        e.category = 'Structural Columns'
    ),
    pivot_entity_data AS (
      PIVOT entity_data ON name_1 --IN (<name_of_param_to_filter>)
      USING first (name_3) AS param_value,
      first (category_1) AS param_category
      GROUP BY
        LocalId,
        name
    )
  SELECT
    *
    --<param_name_in_returned_column>
  FROM
    pivot_entity_data AS ped
    --where <param_name_in_returned_column> is not null and <param_name_in_returned_column> != ''
  ORDER BY
    LocalId;
`;
