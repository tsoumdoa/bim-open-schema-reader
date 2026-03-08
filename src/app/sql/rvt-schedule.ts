import { sql } from "../utils/init-queries";

export const rvtSchedule = sql`
	WITH
		str_data AS (
			SELECT
				e.LocalId,
				e.name,
				p.d_name,
				p.v_Strings
			FROM
				denorm_entities e
				JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'RVT Links'
		),
		pivot_str_data AS (
			PIVOT str_data ON d_name USING FIRST (v_Strings)
			GROUP BY
				LocalId,
				name
		)
	SELECT DISTINCT
		name
	FROM
		pivot_str_data psd
	WHERE
		"Family Name" = 'Linked Revit Model'
	ORDER BY
		name;
`;
