import { sql } from "../utils/init-queries";

export const sheetSchedule = sql`
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
				e.type = 'Sheets'
		),
		pivot_str_data AS (
			PIVOT str_data ON d_name USING FIRST (v_Strings)
			GROUP BY
				LocalId,
				name
		),
		views_str_data AS (
			SELECT
				e.LocalId,
				e.name,
				p.d_name,
				p.v_Strings,
				e.Type
			FROM
				denorm_entities e
				JOIN denorm_string_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Views'
		),
		views_on_sheets AS (
			SELECT DISTINCT
				LocalId,
				name,
				d_name AS param_name,
				v_Strings AS param_value,
				Type
			FROM
				views_str_data
			WHERE
				(
					d_name = 'Sheet Number'
					AND v_Strings <> '---'
				)
				OR d_name = 'Type'
		),
		joint_views_on_sheets AS (
			SELECT
				psd.*,
				LIST (DISTINCT vos.name) AS view_names
			FROM
				pivot_str_data psd
				JOIN views_on_sheets vos ON psd."Sheet Number" = vos.param_value
			GROUP BY ALL
		)
	SELECT
		"Sheet Number",
		"Sheet Name",
		view_names,
		LENGTH (view_names) AS view_count,
		"Scale",
		"Current Revision",
		"Sheet Issue Date",
		"Revisions on Sheet",
		"Current Revision Issued By",
		"Current Revision Issued To",
		"Current Revision Date",
		"Current Revision Description",
		"Approved By",
		"Designed By",
		"Checked By",
		"Drawn By",
		"File Path"
	FROM
		joint_views_on_sheets
	ORDER BY
		"File Path",
		"Sheet Number",
		"Sheet Name";
`;
