"use client";

import { CanvasResizeSync } from "./canvas-resize-sync";
import { Scene } from "./scene";
import { ZoomController } from "./zoom-controller";
import type { RefObject } from "react";
import {
	GizmoHelper,
	GizmoViewcube,
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

interface ViewerCanvasProps {
	rootRef: RefObject<HTMLElement | null>;
	isExpanded: boolean;
	scene: THREE.Group | null;
	highlightOverlay: THREE.Group | null;
	onHighlight: (entityIndex: number, shiftKey: boolean) => void;
	zoomTrigger: "extent" | "selected" | null;
	onZoomDone: () => void;
}

export function ViewerCanvas({
	rootRef,
	isExpanded,
	scene,
	highlightOverlay,
	onHighlight,
	zoomTrigger,
	onZoomDone,
}: ViewerCanvasProps) {
	return (
		<Canvas
			className="h-full w-full"
			resize={{ offsetSize: true }}
			frameloop="demand"
			shadows
			gl={{
				antialias: true,
				toneMapping: THREE.ACESFilmicToneMapping,
				outputColorSpace: THREE.SRGBColorSpace,
			}}
		>
			<CanvasResizeSync rootRef={rootRef} isExpanded={isExpanded} />
			<PerspectiveCamera makeDefault position={[50, 50, 50]} fov={50} />
			<OrbitControls
				makeDefault
				enableDamping
				dampingFactor={0.05}
				rotateSpeed={0.5}
				zoomSpeed={1}
				panSpeed={0.5}
			/>

			<ambientLight intensity={0.5} />
			<directionalLight
				position={[100, 100, 50]}
				intensity={1}
				castShadow
				shadow-mapSize={[2048, 2048]}
			/>
			<directionalLight position={[-50, 50, -50]} intensity={0.3} />

			<Scene
				scene={scene}
				highlightOverlay={highlightOverlay}
				onHighlight={onHighlight}
			/>

			<ZoomController
				zoomTrigger={zoomTrigger}
				scene={scene}
				highlightOverlay={highlightOverlay}
				onDone={onZoomDone}
			/>

			<Environment preset="city" />
			<gridHelper args={[1000, 100]} />

			<GizmoHelper alignment="top-right" margin={[50, 50]}>
				<group scale={0.8}>
					<GizmoViewcube />
				</group>
			</GizmoHelper>
		</Canvas>
	);
}
