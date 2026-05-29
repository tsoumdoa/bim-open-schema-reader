"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function FrameInvalidator({ deps }: { deps: unknown }) {
	const invalidate = useThree((state) => state.invalidate);
	useEffect(() => {
		invalidate();
	}, [deps, invalidate]);
	return null;
}

function computeSceneBounds(root: THREE.Object3D): THREE.Box3 | null {
	root.updateWorldMatrix(true, true);

	const boxes: THREE.Box3[] = [];

	root.traverse((obj) => {
		if (!(obj instanceof THREE.Mesh)) return;
		if (!obj.geometry) return;
		if (!obj.visible) return;

		if (!obj.geometry.boundingBox) {
			obj.geometry.computeBoundingBox();
		}
		if (!obj.geometry.boundingBox) return;

		const worldBox = obj.geometry.boundingBox
			.clone()
			.applyMatrix4(obj.matrixWorld);
		boxes.push(worldBox);
	});

	if (boxes.length === 0) return null;

	const centers = boxes.map((b) => b.getCenter(new THREE.Vector3()));

	const medianCenter = new THREE.Vector3();
	for (const axis of ["x", "y", "z"] as const) {
		const sorted = centers.map((c) => c[axis]).sort((a, b) => a - b);
		medianCenter[axis] = sorted[Math.floor(sorted.length / 2)];
	}

	const distances = centers
		.map((c) => c.distanceTo(medianCenter))
		.sort((a, b) => a - b);

	const q1Idx = Math.floor(distances.length * 0.25);
	const q3Idx = Math.floor(distances.length * 0.75);
	const iqr = distances[q3Idx] - distances[q1Idx];
	const threshold = distances[q3Idx] + 3 * iqr;

	const filtered = boxes.filter(
		(_, i) => centers[i].distanceTo(medianCenter) <= threshold
	);

	if (filtered.length === 0) return null;

	const bounds = new THREE.Box3();
	bounds.copy(filtered[0]);
	for (let i = 1; i < filtered.length; i++) {
		bounds.union(filtered[i]);
	}

	return bounds.isEmpty() ? null : bounds;
}

function getBoxCorners(bounds: THREE.Box3): THREE.Vector3[] {
	const { min, max } = bounds;
	return [
		new THREE.Vector3(min.x, min.y, min.z),
		new THREE.Vector3(min.x, min.y, max.z),
		new THREE.Vector3(min.x, max.y, min.z),
		new THREE.Vector3(min.x, max.y, max.z),
		new THREE.Vector3(max.x, min.y, min.z),
		new THREE.Vector3(max.x, min.y, max.z),
		new THREE.Vector3(max.x, max.y, min.z),
		new THREE.Vector3(max.x, max.y, max.z),
	];
}

function getFitDistanceToBox(
	camera: THREE.PerspectiveCamera,
	bounds: THREE.Box3,
	viewDirection: THREE.Vector3,
	padding = 1.02
) {
	const center = bounds.getCenter(new THREE.Vector3());
	const viewDir = viewDirection.clone().normalize();

	let up = camera.up.clone();
	if (Math.abs(up.dot(viewDir)) > 0.99) {
		up =
			Math.abs(viewDir.y) < 0.99
				? new THREE.Vector3(0, 1, 0)
				: new THREE.Vector3(1, 0, 0);
	}
	const right = new THREE.Vector3().crossVectors(up, viewDir).normalize();
	const camUp = new THREE.Vector3().crossVectors(viewDir, right).normalize();

	const vTan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
	const hTan = Math.tan(Math.atan(vTan * camera.aspect));

	let maxDist = 0;
	for (const corner of getBoxCorners(bounds)) {
		const rel = corner.clone().sub(center);
		const x = Math.abs(rel.dot(right));
		const y = Math.abs(rel.dot(camUp));
		const z = rel.dot(viewDir);
		maxDist = Math.max(maxDist, z + x / hTan, z + y / vTan);
	}

	return Math.max(maxDist, 1e-6) * padding;
}

type ZoomCommand = "extent" | "selected" | null;

export function ZoomController({
	zoomTrigger,
	scene,
	highlightOverlay,
	onDone,
}: {
	zoomTrigger: ZoomCommand;
	scene: THREE.Group | null;
	highlightOverlay: THREE.Group | null;
	onDone: () => void;
}) {
	const controls = useThree((s) => s.controls) as unknown as {
		target: THREE.Vector3;
		update: () => void;
	} | null;
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	const invalidate = useThree((s) => s.invalidate);
	const animRef = useRef<{
		startPos: THREE.Vector3;
		startTarget: THREE.Vector3;
		endPos: THREE.Vector3;
		endTarget: THREE.Vector3;
		startTime: number;
	} | null>(null);

	useEffect(() => {
		if (!zoomTrigger || !controls || !camera) return;

		let targetBounds: THREE.Box3 | null = null;

		if (zoomTrigger === "selected") {
			if (!highlightOverlay) {
				onDone();
				return;
			}
			targetBounds = computeSceneBounds(highlightOverlay);
		} else if (zoomTrigger === "extent") {
			if (!scene) {
				onDone();
				return;
			}
			targetBounds = computeSceneBounds(scene);
		}

		if (!targetBounds || targetBounds.isEmpty()) {
			onDone();
			return;
		}

		const center = targetBounds.getCenter(new THREE.Vector3());

		const toCameraDir = new THREE.Vector3()
			.subVectors(camera.position, controls.target)
			.normalize();
		const distance = getFitDistanceToBox(camera, targetBounds, toCameraDir);
		const endPos = new THREE.Vector3()
			.copy(center)
			.addScaledVector(toCameraDir, distance);

		animRef.current = {
			startPos: camera.position.clone(),
			startTarget: controls.target.clone(),
			endPos,
			endTarget: center.clone(),
			startTime: performance.now(),
		};
	}, [zoomTrigger, camera, controls, scene, highlightOverlay]);

	useFrame(() => {
		const anim = animRef.current;
		if (!anim || !controls) return;

		const elapsed = performance.now() - anim.startTime;
		const duration = 600;
		const t = Math.min(elapsed / duration, 1);
		const eased = 1 - Math.pow(1 - t, 3);

		camera.position.lerpVectors(anim.startPos, anim.endPos, eased);
		controls.target.lerpVectors(anim.startTarget, anim.endTarget, eased);
		controls.update();
		invalidate();

		if (t >= 1) {
			animRef.current = null;
			onDone();
		}
	});

	return <FrameInvalidator deps={zoomTrigger} />;
}
