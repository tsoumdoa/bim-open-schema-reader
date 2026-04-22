"use client";

import { RaycastPicker } from "./raycast-picker";
import * as THREE from "three";

interface SceneProps {
	scene: THREE.Group | null;
	highlightOverlay: THREE.Group | null;
	onHighlight: (entityIndex: number, shiftKey: boolean) => void;
}

export function Scene({ scene, highlightOverlay, onHighlight }: SceneProps) {
	if (!scene) return null;

	return (
		<>
			<primitive object={scene} />
			{highlightOverlay && <primitive object={highlightOverlay} />}
			<RaycastPicker scene={scene} onHighlight={onHighlight} />
		</>
	);
}
