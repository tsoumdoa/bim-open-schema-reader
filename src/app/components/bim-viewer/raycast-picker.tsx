"use client";

import type { EntityFaceRangesSoA } from "@/lib/geometry-utils";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const CLICK_DRAG_THRESHOLD_PX = 5;

function findEntityByFaceIndex(
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

function pickEntityAt(
	clientX: number,
	clientY: number,
	camera: THREE.Camera,
	raycaster: THREE.Raycaster,
	gl: THREE.WebGLRenderer,
	meshes: THREE.Mesh[]
): number | null {
	const rect = gl.domElement.getBoundingClientRect();
	const ndc = new THREE.Vector2(
		((clientX - rect.left) / rect.width) * 2 - 1,
		-((clientY - rect.top) / rect.height) * 2 + 1
	);

	raycaster.setFromCamera(ndc, camera);
	const intersects = raycaster.intersectObjects(meshes, false);

	if (intersects.length === 0) return null;

	const hit = intersects[0];
	const faceRanges = (hit.object as THREE.Mesh).userData
		.entityFaceRanges as EntityFaceRangesSoA;
	if (!faceRanges || hit.faceIndex == null) return null;

	return findEntityByFaceIndex(hit.faceIndex, faceRanges);
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
	const onHighlightRef = useRef(onHighlight);
	onHighlightRef.current = onHighlight;

	const pointerDownRef = useRef<{
		x: number;
		y: number;
		pointerId: number;
	} | null>(null);

	useEffect(() => {
		const meshes: THREE.Mesh[] = [];
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh && child.userData.entityFaceRanges) {
				meshes.push(child);
			}
		});
		meshRefs.current = meshes;
	}, [scene]);

	useEffect(() => {
		const el = gl.domElement;

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return;
			pointerDownRef.current = {
				x: event.clientX,
				y: event.clientY,
				pointerId: event.pointerId,
			};
		};

		const onPointerUp = (event: PointerEvent) => {
			const down = pointerDownRef.current;
			if (!down || event.pointerId !== down.pointerId) return;
			pointerDownRef.current = null;

			if (event.button !== 0) return;

			const dx = event.clientX - down.x;
			const dy = event.clientY - down.y;
			if (dx * dx + dy * dy > CLICK_DRAG_THRESHOLD_PX ** 2) return;

			const entityIndex = pickEntityAt(
				event.clientX,
				event.clientY,
				camera,
				raycaster,
				gl,
				meshRefs.current
			);
			if (entityIndex !== null) {
				onHighlightRef.current(entityIndex, event.shiftKey);
			}
		};

		const onPointerCancel = (event: PointerEvent) => {
			if (pointerDownRef.current?.pointerId === event.pointerId) {
				pointerDownRef.current = null;
			}
		};

		el.addEventListener("pointerdown", onPointerDown);
		el.addEventListener("pointerup", onPointerUp);
		el.addEventListener("pointercancel", onPointerCancel);

		return () => {
			el.removeEventListener("pointerdown", onPointerDown);
			el.removeEventListener("pointerup", onPointerUp);
			el.removeEventListener("pointercancel", onPointerCancel);
		};
	}, [camera, gl, raycaster, scene]);

	return null;
}
