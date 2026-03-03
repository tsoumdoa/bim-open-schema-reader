export const vertexQuery = `SELECT index, x, y, z FROM denorm_vertex_buffer_view ORDER BY index`;
export const indexQuery = `SELECT index, index_value FROM denorm_index_buffer_view ORDER BY index`;
export const meshQuery = `SELECT index, vertex_offset, index_offset FROM denorm_meshes_view ORDER BY index`;
export const materialQuery = `SELECT index, red, green, blue, alpha, roughness, metallic FROM denorm_materials_view ORDER BY index`;
export const transformQuery = `SELECT index, tx, ty, tz, qx, qy, qz, qw, sx, sy, sz FROM denorm_transforms_view ORDER BY index`;
export const instanceQuery = `
					SELECT 
						i.instance_index,
						i.entity_index,
						i.material_index,
						i.mesh_index,
						i.transform_index,
						m.vertex_offset,
						m.index_offset,
						t.tx, t.ty, t.tz,
						t.qx, t.qy, t.qz, t.qw,
						t.sx, t.sy, t.sz,
						mat.red, mat.green, mat.blue,
						mat.alpha, mat.roughness, mat.metallic
					FROM denorm_geometry_elements i
					LEFT OUTER JOIN denorm_meshes_view m ON i.mesh_index = m.index
					LEFT OUTER JOIN denorm_transforms_view t ON i.transform_index = t.index
					LEFT OUTER JOIN denorm_materials_view mat ON i.material_index = mat.index
					ORDER BY i.instance_index
				`;
