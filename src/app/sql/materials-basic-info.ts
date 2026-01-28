import { sql } from "../utils/queries";

export const basicMaterialsInfo = sql`
	WITH
		int_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_integer_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Materials'
		),
		str_data AS (
			SELECT
				e.LocalId,
				p.Name,
				p.Strings
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Materials'
				AND p.Name = 'Name'
		)
	SELECT
		id.LocalId,
		sd.Strings AS material_name,
		MAX(
			CASE
				WHEN Name_1 = 'Shininess' THEN VALUE
			END
		) AS shininess,
		MAX(
			CASE
				WHEN Name_1 = 'Color' THEN VALUE
			END
		) AS hex_color_code,
		MAX(
			CASE
				WHEN Name_1 = 'Smoothness' THEN VALUE
			END
		) AS smoothness,
		MAX(
			CASE
				WHEN Name_1 = 'Transparency' THEN VALUE
			END
		) AS transparency,
		MAX(
			CASE
				WHEN Name_1 = 'Glow' THEN VALUE
			END
		) AS glow
	FROM
		int_data AS id
		LEFT JOIN str_data AS sd ON sd.LocalId = id.LocalId
	GROUP BY
		id.LocalId,
		sd.Strings
	ORDER BY
		id.LocalId;
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
