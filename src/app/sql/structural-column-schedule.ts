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
    column_instances AS (
      SELECT
        LocalId,
        name,
        "Base Level_param_value",
        "Top Level_param_value",
        Level_param_value,
        "rvt:FamilyInstance:StructuralMaterialId_param_value"
      FROM
        pivot_entity_data
      WHERE
        Family_param_value IS NOT NULL
    ),
    column_instance_schedule AS (
      SELECT
        ci.name,
        COUNT(*) AS count,
        list (DISTINCT Level_param_value) AS levels,
        first (
          ci."rvt:FamilyInstance:StructuralMaterialId_param_value"
        ) AS material, --it should all be same, so just take the first one
        list (DISTINCT ci."Base Level_param_value") AS base_levels,
        list (DISTINCT ci."Top Level_param_value") AS top_levels,
      FROM
        column_instances AS ci
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
