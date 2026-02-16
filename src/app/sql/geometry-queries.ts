import { sql } from "../utils/queries";

export const renderAllGeometry = sql`
	-- Renders all geometry in the 3D viewer
	-- This query loads all geometry data for rendering
	SELECT
		i.instance_index,
		i.entity_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		m.vertex_offset,
		m.index_offset,
		t.tx,
		t.ty,
		t.tz,
		t.qx,
		t.qy,
		t.qz,
		t.qw,
		t.sx,
		t.sy,
		t.sz,
		mat.red,
		mat.green,
		mat.blue,
		mat.alpha,
		mat.roughness,
		mat.metallic,
		e.category
	FROM
		denorm_geometry_elements i
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
		LEFT OUTER JOIN denorm_entities e ON i.entity_index = e.index
	ORDER BY
		i.instance_index;
`;

export const renderWallsGeometry = sql`
	-- Renders only Wall geometry in the 3D viewer
	SELECT
		i.instance_index,
		i.entity_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		m.vertex_offset,
		m.index_offset,
		t.tx,
		t.ty,
		t.tz,
		t.qx,
		t.qy,
		t.qz,
		t.qw,
		t.sx,
		t.sy,
		t.sz,
		mat.red,
		mat.green,
		mat.blue,
		mat.alpha,
		mat.roughness,
		mat.metallic
	FROM
		denorm_geometry_elements i
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.category = 'Walls'
	ORDER BY
		i.instance_index;
`;

export const renderFloorsGeometry = sql`
	-- Renders only Floor geometry in the 3D viewer
	SELECT
		i.instance_index,
		i.entity_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		m.vertex_offset,
		m.index_offset,
		t.tx,
		t.ty,
		t.tz,
		t.qx,
		t.qy,
		t.qz,
		t.qw,
		t.sx,
		t.sy,
		t.sz,
		mat.red,
		mat.green,
		mat.blue,
		mat.alpha,
		mat.roughness,
		mat.metallic
	FROM
		denorm_geometry_elements i
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.category = 'Floors'
	ORDER BY
		i.instance_index;
`;

export const renderColumnsGeometry = sql`
	-- Renders only Structural Columns geometry in the 3D viewer
	SELECT
		i.instance_index,
		i.entity_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		m.vertex_offset,
		m.index_offset,
		t.tx,
		t.ty,
		t.tz,
		t.qx,
		t.qy,
		t.qz,
		t.qw,
		t.sx,
		t.sy,
		t.sz,
		mat.red,
		mat.green,
		mat.blue,
		mat.alpha,
		mat.roughness,
		mat.metallic
	FROM
		denorm_geometry_elements i
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.category = 'Structural Columns'
	ORDER BY
		i.instance_index;
`;

export const renderDoorsGeometry = sql`
	-- Renders only Doors geometry in the 3D viewer
	SELECT
		i.instance_index,
		i.entity_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		m.vertex_offset,
		m.index_offset,
		t.tx,
		t.ty,
		t.tz,
		t.qx,
		t.qy,
		t.qz,
		t.qw,
		t.sx,
		t.sy,
		t.sz,
		mat.red,
		mat.green,
		mat.blue,
		mat.alpha,
		mat.roughness,
		mat.metallic
	FROM
		denorm_geometry_elements i
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.category = 'Doors'
	ORDER BY
		i.instance_index;
`;

export const renderWindowsGeometry = sql`
	-- Renders only Windows geometry in the 3D viewer
	SELECT
		i.instance_index,
		i.entity_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		m.vertex_offset,
		m.index_offset,
		t.tx,
		t.ty,
		t.tz,
		t.qx,
		t.qy,
		t.qz,
		t.qw,
		t.sx,
		t.sy,
		t.sz,
		mat.red,
		mat.green,
		mat.blue,
		mat.alpha,
		mat.roughness,
		mat.metallic
	FROM
		denorm_geometry_elements i
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
		INNER JOIN denorm_entities e ON i.entity_index = e.index
	WHERE
		e.category = 'Windows'
	ORDER BY
		i.instance_index;
`;
