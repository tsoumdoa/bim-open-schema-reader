import { sql } from "../utils/queries";

export const sheetSchedule = sql`
	WITH
		str_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Sheets'
		),
		pivot_str_data AS (
			PIVOT str_data ON name_1 USING first (Strings),
			GROUP BY
				LocalId,
				name
		),
		views_str_data AS (
			SELECT
				*
			FROM
				denorm_entities AS e
				INNER JOIN denorm_string_params AS p ON e.index = p.entity
				INNER JOIN descriptors AS dsp ON p.descriptor = dsp.index
			WHERE
				e.category = 'Views'
		),
		views_on_sheets AS (
			SELECT DISTINCT
				LocalId,
				name,
				Name_1 AS param_name,
				Strings AS param_value,
				"GROUP" AS param_group,
				Type
			FROM
				views_str_data
			WHERE
				param_name = 'Sheet Number'
				AND param_value != '---'
				OR param_name = "Type"
				--param_name = 'File Path'
		),
		joint_views_on_sheets AS (
			SELECT DISTINCT
				psd.*,
				list (DISTINCT vos.name) AS view_names,
			FROM
				pivot_str_data AS psd
				INNER JOIN views_on_sheets AS vos ON psd."Sheet Number" = vos.param_value
			GROUP BY ALL
		)
	SELECT DISTINCT
		"Sheet Number",
		"Sheet Name",
		view_names,
		length (view_names) AS view_count,
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
		"File Path",
		-- list (DISTINCT vos_rows) AS "Views on Sheet",
	FROM
		joint_views_on_sheets AS jvos
	ORDER BY
		"File Path",
		"Sheet Number",
		"Sheet Name";
`;
