import { sql } from "../utils/queries";

export const wallDoubleAndPointParameters = sql`
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
    )
  SELECT
    index,
    name,
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
        point_name = 'rvt:Element:Location.StartPoint'
    ) AS loc_start_pt_x,
    MAX(y) FILTER (
      WHERE
        point_name = 'rvt:Element:Location.StartPoint'
    ) AS loc_start_pt_y,
    MAX(z) FILTER (
      WHERE
        point_name = 'rvt:Element:Location.StartPoint'
    ) AS loc_start_pt_z,
    MAX(x) FILTER (
      WHERE
        point_name = 'rvt:Element:Location.EndPoint'
    ) AS loc_end_pt_x,
    MAX(y) FILTER (
      WHERE
        point_name = 'rvt:Element:Location.EndPoint'
    ) AS loc_end_pt_y,
    MAX(z) FILTER (
      WHERE
        point_name = 'rvt:Element:Location.EndPoint'
    ) AS loc_end_pt_z,
    MAX(x) FILTER (
      WHERE
        point_name = 'rvt:Element:Bounds.Min'
    ) AS bounds_min_x,
    MAX(y) FILTER (
      WHERE
        point_name = 'rvt:Element:Bounds.Min'
    ) AS bounds_min_y,
    MAX(z) FILTER (
      WHERE
        point_name = 'rvt:Element:Bounds.Min'
    ) AS bounds_min_z,
    MAX(x) FILTER (
      WHERE
        point_name = 'rvt:Element:Bounds.Max'
    ) AS bounds_max_x,
    MAX(y) FILTER (
      WHERE
        point_name = 'rvt:Element:Bounds.Max'
    ) AS bounds_max_y,
    MAX(z) FILTER (
      WHERE
        point_name = 'rvt:Element:Bounds.Max'
    ) AS bounds_max_z
  FROM
    wall_data
  GROUP BY
    index,
    name
  ORDER BY
    index
    --ORDER BY unconnected_height DESC;
`;
