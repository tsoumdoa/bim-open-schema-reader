import { sql } from "../utils/init-queries";

export const basicMaterialsInfo = sql`
	WITH
		material_int AS (
			SELECT
				e.LocalId,
				p.d_name,
				p.p_Value
			FROM
				denorm_entities e
				JOIN denorm_integer_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Materials'
		),
		material_name AS (
			SELECT
				e.LocalId,
				p.v_Strings AS material_name
			FROM
				denorm_entities e
				JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Materials'
				AND p.d_name = 'Name'
		)
	SELECT
		mi.LocalId,
		mn.material_name,
		MAX(
			CASE
				WHEN mi.d_name = 'Shininess' THEN mi.p_Value
			END
		) AS shininess,
		MAX(
			CASE
				WHEN mi.d_name = 'Color' THEN mi.p_Value
			END
		) AS hex_color_code,
		MAX(
			CASE
				WHEN mi.d_name = 'Smoothness' THEN mi.p_Value
			END
		) AS smoothness,
		MAX(
			CASE
				WHEN mi.d_name = 'Transparency' THEN mi.p_Value
			END
		) AS transparency,
		MAX(
			CASE
				WHEN mi.d_name = 'Glow' THEN mi.p_Value
			END
		) AS glow
	FROM
		material_int mi
		LEFT JOIN material_name mn ON mi.LocalId = mn.LocalId
	GROUP BY
		mi.LocalId,
		mn.material_name
	ORDER BY
		mi.LocalId;
`;
// TODO:
//sth like this to get Material property of all elements
//then need to join with double param to get volume... and then join with integer param to get number of elements
// WITH
//   entity_data AS (
//     SELECT
//       *
//     FROM
//       denorm_entities AS e
//       INNER JOIN denorm_entity_params AS p ON e.index = p.entity
//       INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
//       INNER JOIN denorm_entities AS e2 ON p.Value = e2.index
//   )
// SELECT distinct
//   LocalId,
//   name,
//   Name_1 AS param_name,
//   name_3 AS param_value,
//   category_1 AS param_category,
//   --GlobalId,
//   --category,
//   --path_name,
// FROM
//   entity_data
// WHERE
// --  entity_data.category_1 != '__DOCUMENT__',
//   param_name = 'Material'
// ORDER BY
//   index
