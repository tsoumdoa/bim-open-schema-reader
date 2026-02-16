import { ValidFileNames, ValidFileNamesWithGeo } from "./types";

// NOTE: boilerplate
export const sql = (strings: TemplateStringsArray, ...values: string[]) =>
	strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");

export const createBosTable = (
	fileNames: ValidFileNames[] | ValidFileNamesWithGeo[]
) => {
	return fileNames
		.map((fileName) => {
			return sql`
				CREATE VIEW ${fileName.replace(".parquet", "")} AS
				SELECT
					*,
					(row_number() OVER () - 1) AS index
				FROM
					${fileName};
			`;
		})
		.join("\n");
};

export const createHelperViewsAndTables = () => sql`
	-- parameter enum table
	CREATE
	OR REPLACE TABLE Enum_Parameter (index INTEGER, ParameterType VARCHAR(20));

	INSERT INTO
		Enum_Parameter (index, ParameterType)
	VALUES
		(0, 'Int'),
		(1, 'Double'),
		(2, 'Entity'),
		(3, 'String'),
		(4, 'Point');

	CREATE TABLE IF NOT EXISTS Enum_RelationType (index INTEGER, RelationType VARCHAR(20));

	INSERT INTO
		Enum_RelationType (index, RelationType)
	VALUES
		(0, 'PartOf'),
		(1, 'ElementOf'),
		(2, 'ContainedIn'),
		(3, 'InstanceOf'),
		(4, 'HostedBy'),
		(5, 'ChildOf'),
		(6, 'HasLayer'),
		(7, 'HasMaterial'),
		(8, 'ConnectsTo'),
		(9, 'HasConnector');

	-- denormalize entities
	CREATE
	OR REPLACE VIEW denorm_entities AS
	SELECT
		Entities.LocalId,
		Entities.GlobalId,
		Entities."index" AS index,
		Entities.name AS entity_name,
		s_name.Strings AS name,
		type_name.Strings AS category,
		s_path.Strings AS path_name,
		s_title.Strings AS project_name
	FROM
		Entities
		LEFT OUTER JOIN Strings AS s_name ON Entities."name" = s_name."index"
		LEFT OUTER JOIN Entities AS instance_ent ON instance_ent."index" = Entities.Category
		LEFT OUTER JOIN Strings AS type_name ON instance_ent."name" = type_name."index"
		LEFT OUTER JOIN Documents ON Entities.Document = Documents."index"
		LEFT OUTER JOIN Strings AS s_path ON Documents.Path = s_path."index"
		LEFT OUTER JOIN Strings AS s_title ON Documents.Title = s_title."index";

	-- denormalize descriptor
	CREATE
	OR REPLACE VIEW denorm_descriptors AS
	SELECT
		dsc.index AS index,
		strName.Strings AS Name,
		strUnit.Strings AS Units,
		strGroup.Strings AS "Group",
		strType.Strings AS Type
	FROM
		Descriptors AS dsc
		LEFT OUTER JOIN Strings AS strName ON strName.index = dsc.Name
		LEFT OUTER JOIN Strings AS strUnit ON strUnit.index = dsc.Units
		LEFT OUTER JOIN Strings AS strGroup ON strGroup.index = dsc.Group
		LEFT OUTER JOIN Strings AS strType ON strType.index = dsc.Type;

	-- denormalize StringParameters
	CREATE
	OR REPLACE VIEW denorm_string_params AS
	SELECT
		*
	FROM
		StringParameters
		JOIN Strings ON Strings.index = StringParameters.Value
		JOIN denorm_descriptors ON denorm_descriptors.index = StringParameters.Descriptor;

	-- denormalize PointParameters
	CREATE
	OR REPLACE VIEW denorm_points_params AS
	SELECT
		*
	FROM
		PointParameters
		LEFT OUTER JOIN Points ON Points.index = PointParameters.Value
		LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = PointParameters.Descriptor;

	-- denormalize Single Parameters
	-- WARNING: TO BE DEPRECATED - name kept as double_parameters for now due the compatibility
	CREATE
	OR REPLACE VIEW denorm_single_params AS
	SELECT
		*
	FROM
		SingleParameters
		LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = SingleParameters.Descriptor;

	-- denormalize Integer Parameters
	CREATE
	OR REPLACE VIEW denorm_integer_params AS
	SELECT
		*
	FROM
		IntegerParameters
		LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = IntegerParameters.Descriptor;

	-- denormalize Entity Parameters
	CREATE
	OR REPLACE VIEW denorm_entity_params AS
	SELECT
		*
	FROM
		EntityParameters
		LEFT OUTER JOIN denorm_descriptors ON denorm_descriptors.index = EntityParameters.Descriptor
		LEFT OUTER JOIN denorm_entities AS de ON de.index = EntityParameters.Value;

	-- denormalize geometry: VertexBuffer
	CREATE
	OR REPLACE VIEW denorm_vertex_buffer_view AS
	SELECT
		VertexBuffer.index AS index,
		VertexBuffer.VertexX / 10000.0 AS x,
		VertexBuffer.VertexY / 10000.0 AS y,
		VertexBuffer.VertexZ / 10000.0 AS z
	FROM
		VertexBuffer;

	-- denormalize geometry: IndexBuffer
	CREATE
	OR REPLACE VIEW denorm_index_buffer_view AS
	SELECT
		IndexBuffer.index AS index,
		IndexBuffer.IndexBuffer AS index_value
	FROM
		IndexBuffer;

	-- denormalize geometry: Meshes
	CREATE
	OR REPLACE VIEW denorm_meshes_view AS
	SELECT
		Meshes.index AS index,
		Meshes.MeshVertexOffset AS vertex_offset,
		Meshes.MeshIndexOffset AS index_offset
	FROM
		Meshes;

	-- denormalize geometry: Materials
	CREATE
	OR REPLACE VIEW denorm_materials_view AS
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

	-- denormalize geometry: Transforms
	CREATE
	OR REPLACE VIEW denorm_transforms_view AS
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

	-- denormalize geometry: Instances
	CREATE
	OR REPLACE VIEW denorm_instances_view AS
	SELECT
		Instances.index AS index,
		Instances.InstanceEntityIndex AS entity_index,
		Instances.InstanceMaterialIndex AS material_index,
		Instances.InstanceMeshIndex AS mesh_index,
		Instances.InstanceTransformIndex AS transform_index,
		Instances.InstanceFlags AS flags
	FROM
		Instances;

	-- denormalize geometry: Elements (joins all geometry tables with entities)
	CREATE
	OR REPLACE VIEW denorm_geometry_elements AS
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

export const listAllTableInfo = sql`
	SELECT
		*
	FROM
		information_schema.tables;
`;

export const listAllTableInfoWithColumnInfo = sql`
	SELECT
		table_name,
		list (column_name),
		list (data_type),
		first (table_catalog)
	FROM
		information_schema.columns
		--where table_catalog LIKE 'memory'
	GROUP BY
		table_name
`;

export const listCountByCategory = sql`
	SELECT
		e.category AS paramname,
		COUNT(DISTINCT e.index) AS count
	FROM
		denorm_entities AS e
		LEFT OUTER JOIN entityparameters AS ep ON e.index = ep.entity
		LEFT OUTER JOIN denorm_entities AS e2 ON ep.value = e2.index
		LEFT OUTER JOIN descriptors AS dsp ON ep.descriptor = dsp.index
		LEFT OUTER JOIN strings AS paramname ON dsp.name = paramname.index
	GROUP BY
		e.category
	ORDER BY
		paramname ASC;
`;

export const summarizeTableInfo = (tableName: string) => sql`
	SELECT
		COUNT(*)
	FROM
		${tableName};
`;

// example with string literal
// export const listAllTableInfo = (tableName: string) => sql`
//   SELECT
//     *
//   FROM
//     information_schema.tables;
//     where table_name = ${tableName};
// `;
