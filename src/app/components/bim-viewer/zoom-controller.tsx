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
		if (!zoomTrigger || !controls) return;

		const target = zoomTrigger === "selected" ? highlightOverlay : scene;
		if (!target) return;

		const box = new THREE.Box3().setFromObject(target);
		if (box.isEmpty() || box.getSize(new THREE.Vector3()).lengthSq() === 0)
			return;

		const center = box.getCenter(new THREE.Vector3());
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);
		const fovRad = (camera.fov * Math.PI) / 180;
		const distance = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.8;

		const dir = new THREE.Vector3()
			.subVectors(camera.position, controls.target)
			.normalize();
		const endPos = new THREE.Vector3()
			.copy(center)
			.addScaledVector(dir, distance);

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
