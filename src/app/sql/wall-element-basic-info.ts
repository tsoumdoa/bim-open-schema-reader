import { sql } from "../utils/init-queries";

export const wallElementBasicInfo = sql`
	WITH
		wall_data AS (
			SELECT
				e.index,
				e.name,
				sp.d_name AS prop_name,
				pp.d_name AS point_name,
				ROUND(sp.v_value * 304.8, 1) AS prop_value,
				ROUND(pp.v_X * 304.8, 3) AS x,
				ROUND(pp.v_Y * 304.8, 3) AS y,
				ROUND(pp.v_Z * 304.8, 3) AS z
			FROM
				denorm_entities e
				LEFT JOIN denorm_points_params pp ON e.index = pp.p_Entity
				LEFT JOIN denorm_single_params sp ON e.index = sp.p_Entity
			WHERE
				e.type = 'Walls'
				AND sp.d_name IN (
					'Unconnected Height',
					'Base Offset',
					'Top Offset',
					'Length',
					'Area',
					'Volume',
					'Top Extension Distance',
					'Base Extension Distance'
				)
				AND pp.d_name IN (
					'Rvt:Element:Location.StartPoint',
					'Rvt:Element:Location.EndPoint',
					'Rvt:Element:Bounds.Min',
					'Rvt:Element:Bounds.Max'
				)
		),
		entity_data AS (
			SELECT
				e.index,
				e.name,
				p.p_index AS entity_index
			FROM
				denorm_entities e
				JOIN denorm_entity_params p ON e.index = p.p_Entity
			WHERE
				e.type = 'Walls'
				AND p.d_name = 'Family and Type'
		),
		wall_agg AS (
			SELECT
				wd.index,
				wd.name,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Length'
				) AS length,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Unconnected Height'
				) AS unconnected_height,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Area'
				) AS area,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Volume'
				) AS volume,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Base Offset'
				) AS base_offset,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Top Offset'
				) AS top_offset,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Top Extension Distance'
				) AS top_extension_distance,
				MAX(prop_value) FILTER (
					WHERE
						prop_name = 'Base Extension Distance'
				) AS base_extension_distance,
				MAX(x) FILTER (
					WHERE
						point_name = 'Rvt:Element:Location.StartPoint'
				) AS loc_start_pt_x,
				MAX(y) FILTER (
					WHERE
						point_name = 'Rvt:Element:Location.StartPoint'
				) AS loc_start_pt_y,
				MAX(z) FILTER (
					WHERE
						point_name = 'Rvt:Element:Location.StartPoint'
				) AS loc_start_pt_z,
				MAX(x) FILTER (
					WHERE
						point_name = 'Rvt:Element:Location.EndPoint'
				) AS loc_end_pt_x,
				MAX(y) FILTER (
					WHERE
						point_name = 'Rvt:Element:Location.EndPoint'
				) AS loc_end_pt_y,
				MAX(z) FILTER (
					WHERE
						point_name = 'Rvt:Element:Location.EndPoint'
				) AS loc_end_pt_z,
				MAX(x) FILTER (
					WHERE
						point_name = 'Rvt:Element:Bounds.Min'
				) AS bounds_min_x,
				MAX(y) FILTER (
					WHERE
						point_name = 'Rvt:Element:Bounds.Min'
				) AS bounds_min_y,
				MAX(z) FILTER (
					WHERE
						point_name = 'Rvt:Element:Bounds.Min'
				) AS bounds_min_z,
				MAX(x) FILTER (
					WHERE
						point_name = 'Rvt:Element:Bounds.Max'
				) AS bounds_max_x,
				MAX(y) FILTER (
					WHERE
						point_name = 'Rvt:Element:Bounds.Max'
				) AS bounds_max_y,
				MAX(z) FILTER (
					WHERE
						point_name = 'Rvt:Element:Bounds.Max'
				) AS bounds_max_z
			FROM
				wall_data wd
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
				LIST (ROUND(dp.v_value * 304.8, 1)) AS thicknesses,
				LIST (e2.category) AS categories,
				ROUND(SUM(dp.v_value * 304.8), 1) AS total_thickness
			FROM
				denorm_entities e1
				LEFT JOIN relations r1 ON e1.index = r1.entityA
				LEFT JOIN denorm_entities e2 ON r1.entityB = e2.index
				LEFT JOIN denorm_single_params dp ON r1.entityB = dp.p_Entity
				LEFT JOIN relations r2 ON r1.entityB = r2.entityA
				LEFT JOIN denorm_entities e3 ON r2.entityB = e3.index
			WHERE
				e1.type = 'Walls'
				AND r1.relationType = 6
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
		wall_agg wa
		LEFT JOIN entity_data ed ON wa.index = ed.index
		LEFT JOIN wall_build_up wbu ON ed.entity_index = wbu.entity_index
	ORDER BY
		wa.index;
`;
