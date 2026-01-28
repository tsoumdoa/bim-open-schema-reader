import { sql } from "../utils/queries";

export const wallElementBasicInfo = sql`
	WITH
		wall_data AS (
			SELECT
				e.index,
				e.name,
				p3.strings AS prop_name,
				p4.name AS point_name,
				ROUND(p1.value * 304.8, 1) AS prop_value,
				ROUND(p0.x * 304.8, 3) AS x,
				ROUND(p0.y * 304.8, 3) AS y,
				ROUND(p0.z * 304.8, 3) AS z
			FROM
				denorm_entities AS e
				INNER JOIN denorm_points_params AS p0 ON e.index = p0.entity
				INNER JOIN doubleparameters AS p1 ON e.index = p1.entity
				INNER JOIN descriptors AS p2 ON p1.descriptor = p2.index
				INNER JOIN strings AS p3 ON p2.name = p3.index
				INNER JOIN denorm_descriptors AS p4 ON p0.descriptor = p4.index
			WHERE
				e.category LIKE 'Walls'
				AND p3.strings IN (
					'Unconnected Height',
					'Base Offset',
					'Top Offset',
					'Length',
					'Area',
					'Volume',
					'Top Extension Distance',
					'Base Extension Distance'
				)
				AND p4.name IN (
					'rvt:Element:Location.StartPoint',
					'rvt:Element:Location.EndPoint',
					'rvt:Element:Bounds.Min',
					'rvt:Element:Bounds.Max'
				)
		),
		entity_data AS (
			SELECT
				e.index,
				e.name,
				p1.name AS des_name,
				p1.group AS des_group,
				p1.type AS des_type,
				p1.name_1 AS entity_name,
				p1.category AS entity_category,
				p1.index_1 AS entity_index
			FROM
				denorm_entities AS e
				INNER JOIN denorm_entity_params AS p1 ON e.index = p1.entity
			WHERE
				e.category = 'Walls'
				AND p1.name = 'Family and Type'
		),
		wall_agg AS (
			SELECT
				wd.index,
				wd.name,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Length'
				) AS length,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Unconnected Height'
				) AS unconnected_height,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Area'
				) AS area,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Volume'
				) AS volume,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Base Offset'
				) AS base_offset,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Top Offset'
				) AS top_offset,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Top Extension Distance'
				) AS top_extension_distance,
				MAX(wd.prop_value) FILTER (
					WHERE
						wd.prop_name = 'Base Extension Distance'
				) AS base_extension_distance,
				MAX(wd.x) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Location.StartPoint'
				) AS loc_start_pt_x,
				MAX(wd.y) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Location.StartPoint'
				) AS loc_start_pt_y,
				MAX(wd.z) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Location.StartPoint'
				) AS loc_start_pt_z,
				MAX(wd.x) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Location.EndPoint'
				) AS loc_end_pt_x,
				MAX(wd.y) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Location.EndPoint'
				) AS loc_end_pt_y,
				MAX(wd.z) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Location.EndPoint'
				) AS loc_end_pt_z,
				MAX(wd.x) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Bounds.Min'
				) AS bounds_min_x,
				MAX(wd.y) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Bounds.Min'
				) AS bounds_min_y,
				MAX(wd.z) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Bounds.Min'
				) AS bounds_min_z,
				MAX(wd.x) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Bounds.Max'
				) AS bounds_max_x,
				MAX(wd.y) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Bounds.Max'
				) AS bounds_max_y,
				MAX(wd.z) FILTER (
					WHERE
						wd.point_name = 'rvt:Element:Bounds.Max'
				) AS bounds_max_z
			FROM
				wall_data AS wd
			GROUP BY
				wd.index,
				wd.name
		),
		wall_build_up AS (
			SELECT
				e1.index AS entity_index,
				FIRST (e1.name) AS family_name,
				LIST (e2.name) AS names,
				LIST (e3.name) AS materials,
				LIST (ROUND(dp.value * 304.8, 1)) AS thicknesses,
				LIST (e2.category) AS categories,
				ROUND(SUM(dp.value * 304.8), 1) AS total_thickness
			FROM
				denorm_entities AS e1
				LEFT JOIN relations AS rls1 ON e1.index = rls1.entitya
				LEFT JOIN denorm_entities AS e2 ON rls1.entityb = e2.index
				LEFT JOIN doubleparameters AS dp ON rls1.entityb = dp.entity
				LEFT JOIN descriptors AS dsp ON dp.descriptor = dsp.index
				LEFT JOIN strings AS str1 ON dsp.name = str1.index
				LEFT JOIN relations AS rls2 ON rls1.entityb = rls2.entitya
				LEFT JOIN denorm_entities AS e3 ON rls2.entityb = e3.index
			WHERE
				e1.category LIKE 'Walls'
				AND rls1.relationtype = 6
			GROUP BY
				e1.index
		)
	SELECT
		wa.index,
		wa.name AS family_and_type,
		ed.entity_index AS family_and_type_index,
		wa.length,
		wa.unconnected_height,
		wa.area,
		wa.volume,
		wa.base_offset,
		wa.top_offset,
		wa.top_extension_distance,
		wa.base_extension_distance,
		wa.loc_start_pt_x,
		wa.loc_start_pt_y,
		wa.loc_start_pt_z,
		wa.loc_end_pt_x,
		wa.loc_end_pt_y,
		wa.loc_end_pt_z,
		wa.bounds_min_x,
		wa.bounds_min_y,
		wa.bounds_min_z,
		wa.bounds_max_x,
		wa.bounds_max_y,
		wa.bounds_max_z,
		wbu.names AS layer_names,
		wbu.materials AS layer_materials,
		wbu.thicknesses AS layer_thicknesses,
		wbu.categories AS layer_categories,
		wbu.total_thickness
	FROM
		wall_agg AS wa
		LEFT JOIN entity_data AS ed ON wa.index = ed.index
		LEFT JOIN wall_build_up AS wbu ON ed.entity_index = wbu.entity_index
	ORDER BY
		wa.index;
`;
