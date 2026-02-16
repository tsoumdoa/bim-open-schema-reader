import { sql } from "../utils/queries";

export const denormVertexBuffer = sql`
	SELECT
		VertexBuffer.index AS index,
		VertexBuffer.VertexX / 10000.0 AS x,
		VertexBuffer.VertexY / 10000.0 AS y,
		VertexBuffer.VertexZ / 10000.0 AS z
	FROM
		VertexBuffer;
`;

export const denormIndexBuffer = sql`
	SELECT
		IndexBuffer.index AS index,
		IndexBuffer.IndexBuffer AS index_value
	FROM
		IndexBuffer;
`;

export const denormMeshes = sql`
	SELECT
		Meshes.index AS index,
		Meshes.MeshVertexOffset AS vertex_offset,
		Meshes.MeshIndexOffset AS index_offset
	FROM
		Meshes;
`;

export const denormMaterials = sql`
	SELECT
		Materials.index AS index,
		Materials.MaterialRed / 255.0 AS red,
		Materials.MaterialGreen / 255.0 AS green,
		Materials.MaterialBlue / 255.0 AS blue,
		Materials.MaterialAlpha / 255.0 AS alpha,
		Materials.MaterialRoughness / 255.0 AS roughness,
		Materials.MaterialMetallic / 255.0 AS metallic
	FROM
		Materials;
`;

export const denormTransforms = sql`
	SELECT
		Transforms.index AS index,
		Transforms.TransformTX AS tx,
		Transforms.TransformTY AS ty,
		Transforms.TransformTZ AS tz,
		Transforms.TransformQX AS qx,
		Transforms.TransformQY AS qy,
		Transforms.TransformQZ AS qz,
		Transforms.TransformQW AS qw,
		Transforms.TransformSX AS sx,
		Transforms.TransformSY AS sy,
		Transforms.TransformSZ AS sz
	FROM
		Transforms;
`;

export const denormInstances = sql`
	SELECT
		Instances.index AS index,
		Instances.InstanceEntityIndex AS entity_index,
		Instances.InstanceMaterialIndex AS material_index,
		Instances.InstanceMeshIndex AS mesh_index,
		Instances.InstanceTransformIndex AS transform_index,
		Instances.InstanceFlags AS flags
	FROM
		Instances;
`;

export const denormGeometryElements = sql`
	SELECT
		i.index AS instance_index,
		i.entity_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		i.flags,
		e.LocalId,
		e.GlobalId,
		e.entity_name,
		e.category,
		m.vertex_offset,
		m.index_offset AS mesh_index_offset,
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
		denorm_instances_view i
		LEFT OUTER JOIN denorm_entities e ON i.entity_index = e.index
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index;
`;

export const geometryMeshesByCategory = (categoryName: string) => sql`
	SELECT
		i.index AS instance_index,
		i.mesh_index,
		i.transform_index,
		i.material_index,
		m.vertex_offset,
		m.index_offset AS mesh_index_offset,
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
		denorm_instances_view i
		INNER JOIN denorm_entities e ON i.entity_index = e.index
		LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
		LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
		LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
	WHERE
		e.category = '${categoryName}';
`;

export const geometryVertexData = sql`
	SELECT
		*
	FROM
		denorm_vertex_buffer_view;
`;

export const geometryIndexData = sql`
	SELECT
		*
	FROM
		denorm_index_buffer_view;
`;
