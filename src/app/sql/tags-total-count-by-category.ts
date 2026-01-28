import { sql } from "../utils/queries";

// NOTE: there seems to be no reliable way to match family type with family....
export const tagsTotalCountByCategory = sql`
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
		family_category,
		count(DISTINCT LocalId) AS tag_count, -- it should count(*) but there are duplicate
		list (DISTINCT family_param_value)
	FROM
		family_of_instance
	GROUP BY
		--family_param_value,
		family_category,
	ORDER BY
		tag_count DESC;
`;
