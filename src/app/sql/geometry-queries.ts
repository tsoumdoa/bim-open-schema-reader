import { sql } from "../utils/init-queries";

export const renderAllGeometry = sql`
	-- Renders all geometry in the 3D viewer
	-- This query loads all geometry data for rendering
	SELECT DISTINCT
		i.entity_index,
		e.GlobalId,
		e.name,
		e.type
	FROM
		denorm_geometry_elements i
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	ORDER BY
		i.entity_index;
`;

export const renderWallsGeometry = sql`
	-- Renders only Wall geometry in the 3D viewer
	SELECT DISTINCT
		i.entity_index,
		e.GlobalId,
		e.name,
		e.type
	FROM
		denorm_geometry_elements i
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.type = 'Walls'
	ORDER BY
		i.entity_index;
`;

export const renderFloorsGeometry = sql`
	-- Renders only Floor geometry in the 3D viewer
	SELECT DISTINCT
		i.entity_index,
		e.GlobalId,
		e.name,
		e.type
	FROM
		denorm_geometry_elements i
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.type = 'Floors'
	ORDER BY
		i.entity_index;
`;

export const renderColumnsGeometry = sql`
	-- Renders only Structural Columns geometry in the 3D viewer
	SELECT DISTINCT
		i.entity_index,
		e.GlobalId,
		e.name,
		e.type
	FROM
		denorm_geometry_elements i
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.type = 'Structural Columns'
	ORDER BY
		i.entity_index;
`;

export const renderDoorsGeometry = sql`
	-- Renders only Doors geometry in the 3D viewer
	SELECT DISTINCT
		i.entity_index,
		e.GlobalId,
		e.name,
		e.type
	FROM
		denorm_geometry_elements i
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.type = 'Doors'
	ORDER BY
		i.entity_index;
`;

export const renderWindowsGeometry = sql`
	-- Renders only Windows geometry in the 3D viewer
	SELECT DISTINCT
		i.entity_index,
		e.GlobalId,
		e.name,
		e.type
	FROM
		denorm_geometry_elements i
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.type = 'Windows'
	ORDER BY
		i.entity_index;
`;
