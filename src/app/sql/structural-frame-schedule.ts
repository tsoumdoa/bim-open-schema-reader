import { sql } from "../utils/queries";

// TODO: add double data
export const structuralFrameSchedule = sql`
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
        e.category = 'Structural Framing'
    ),
    pivot_entity_data AS (
      PIVOT entity_data ON name_1 USING first (name_3) AS param_value,
      first (category_1) AS param_category
      GROUP BY
        LocalId,
        name
    ),
    family_types AS (
      SELECT
        LocalId,
        name
      FROM
        pivot_entity_data
      WHERE
        Family_param_value IS NULL
    ),
    frame_instances AS (
      SELECT
        LocalId,
        name,
        "Structural Material_param_value" AS struct_mat,
        "Reference Level_param_value" AS ref_level
      FROM
        pivot_entity_data
      WHERE
        Family_param_value IS NOT NULL
    ),
    column_instance_schedule AS (
      SELECT
        ci.name,
        COUNT(*) AS count,
        list (DISTINCT ci.ref_level) AS ref_levels,
        first (DISTINCT ci.struct_mat) AS material,
      FROM
        frame_instances AS ci
        JOIN family_types f ON f.name = ci.name
      GROUP BY
        ci.name
    )
  SELECT
    *
  FROM
    column_instance_schedule
  ORDER BY
    name;
`;
