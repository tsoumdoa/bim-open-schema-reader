import { sql } from "../utils/queries";

export const rvtSchedule = sql`
	WITH
		str_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'RVT Links'
		),
		pivot_str_data AS (
			PIVOT str_data ON name_1 USING first (Strings)
			GROUP BY
				LocalId,
				name
		)
	SELECT DISTINCT
		name
	FROM
		pivot_str_data AS psd
	WHERE
		"Family Name" = 'Linked Revit Model'
	ORDER BY
		name;
`;
