import { sql } from "../utils/queries";

// TODO: export length and volume of each column from revit and add to this...?
export const structuralFrameMaterials = sql`
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
      FROM
        pivot_entity_data
      WHERE
        Family_param_value IS NOT NULL
    ),
    column_materials AS (
      SELECT DISTINCT
        struct_mat,
        count(DISTINCT name) AS count,
        list (DISTINCT name) AS names
      FROM
        frame_instances
      GROUP BY
        struct_mat
    )
  SELECT
    *
  FROM
    column_materials AS cm
  ORDER BY
    struct_mat;
`;
