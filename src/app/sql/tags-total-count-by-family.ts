import { sql } from "../utils/init-queries";

export const tagsTotalCountByFamily = sql`
	WITH
		str_data AS (
			SELECT
				e.LocalId,
				e.name,
				e.category,
				p.d_name,
				p.v_Strings
			FROM
				denorm_entities e
				JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type LIKE '% Tags'
		),
		instance_data AS (
			SELECT DISTINCT
				LocalId,
				name,
				d_name AS instance_param_name,
				v_Strings AS instance_param_value,
				category AS instance_category
			FROM
				str_data
			WHERE
				d_name = 'Family Name'
				AND v_Strings = ''
		),
		family_data AS (
			SELECT DISTINCT
				LocalId,
				name,
				d_name AS family_param_name,
				v_Strings AS family_param_value,
				category AS family_category
			FROM
				str_data
			WHERE
				d_name = 'Family Name'
				AND v_Strings <> ''
		),
		family_of_instance AS (
			SELECT
				*
			FROM
				instance_data id
				LEFT JOIN family_data fd ON id.name = fd.name
			WHERE
				id.instance_category = fd.family_category
		)
	SELECT
		family_category AS category,
		family_param_value AS family_name,
		LIST (DISTINCT name) AS type_names
	FROM
		family_of_instance
	GROUP BY
		family_param_value,
		family_category
	ORDER BY
		family_param_value;
`;
