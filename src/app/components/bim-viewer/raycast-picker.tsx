"use client";

import type { EntityFaceRangesSoA } from "@/lib/geometry-utils";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function findEntityByFaceIndex(
	faceIndex: number,
	faceRanges: EntityFaceRangesSoA
): number | null {
	const { entityIndices, startFaces, faceCounts } = faceRanges;
	let lo = 0;
	let hi = startFaces.length - 1;
	while (lo <= hi) {
		const mid = (lo + hi) >>> 1;
		const start = startFaces[mid];
		if (faceIndex < start) {
			hi = mid - 1;
		} else if (faceIndex >= start + faceCounts[mid]) {
			lo = mid + 1;
		} else {
			return entityIndices[mid];
		}
	}
	return null;
}

export function RaycastPicker({
	scene,
	onHighlight,
}: {
	scene: THREE.Group;
	onHighlight: (entityIndex: number, shiftKey: boolean) => void;
}) {
	const { camera, gl, raycaster } = useThree();
	const meshRefs = useRef<THREE.Mesh[]>([]);

	useEffect(() => {
		const meshes: THREE.Mesh[] = [];
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh && child.userData.entityFaceRanges) {
				meshes.push(child);
			}
		});
		meshRefs.current = meshes;
	}, [scene]);

	function handlePointerDown(event: THREE.Event) {
		(event as unknown as { stopPropagation: () => void }).stopPropagation();

		const pointer = event as unknown as { clientX: number; clientY: number };
		const shiftKey =
			(event as unknown as { shiftKey: boolean }).shiftKey ?? false;
		const rect = gl.domElement.getBoundingClientRect();
		const ndc = new THREE.Vector2(
			((pointer.clientX - rect.left) / rect.width) * 2 - 1,
			-((pointer.clientY - rect.top) / rect.height) * 2 + 1
		);

		raycaster.setFromCamera(ndc, camera);
		const intersects = raycaster.intersectObjects(meshRefs.current, false);

		if (intersects.length > 0) {
			const hit = intersects[0];
			const faceRanges = (hit.object as THREE.Mesh).userData
				.entityFaceRanges as EntityFaceRangesSoA;
			if (faceRanges && hit.faceIndex != null) {
				const entityIndex = findEntityByFaceIndex(hit.faceIndex, faceRanges);
				if (entityIndex !== null) {
					onHighlight(entityIndex, shiftKey);
				}
			}
		}
	}

	return (
		<mesh
			visible={false}
			position={[0, 0, 0]}
			onPointerDown={handlePointerDown}
		>
			<planeGeometry args={[10000, 10000]} />
			<meshBasicMaterial side={THREE.DoubleSide} />
		</mesh>
	);
}
