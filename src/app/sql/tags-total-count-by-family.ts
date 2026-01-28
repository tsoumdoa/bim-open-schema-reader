import { sql } from "../utils/queries";

export const tagsTotalCountByFamily = sql`
	WITH
		str_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category LIKE '% Tags'
		),
		instance_data AS (
			SELECT DISTINCT
				LocalId,
				name,
				Name_1 AS instance_param_name,
				Strings AS instance_param_value,
				category AS instance_category
			FROM
				str_data
			WHERE
				instance_param_name = 'Family Name'
				AND instance_param_value = ''
		),
		family_data AS (
			SELECT DISTINCT
				LocalId,
				name,
				Name_1 AS family_param_name,
				Strings AS family_param_value,
				category AS family_category
			FROM
				str_data
			WHERE
				family_param_name = 'Family Name'
				AND family_param_value != ''
		),
		family_of_instance AS (
			SELECT
				*
			FROM
				instance_data AS id
				LEFT JOIN family_data AS fd ON id.name = fd.name -- this is checking family type name only..
			WHERE
				instance_category = family_category
		)
	SELECT DISTINCT
		family_category AS category,
		family_param_value AS family_name,
		-- count(*) AS tag_count, -- not reliable for now
		list (DISTINCT name) AS type_names
	FROM
		family_of_instance
	GROUP BY
		family_param_value,
		family_category
	ORDER BY
		family_param_value;

	-- ORDER BY
	--   tag_count DESC;
`;
