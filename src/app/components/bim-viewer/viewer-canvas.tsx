"use client";

import { Scene } from "./scene";
import { ZoomController } from "./zoom-controller";
import {
	GizmoHelper,
	GizmoViewcube,
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { RefObject, useEffect } from "react";
import * as THREE from "three";

function CanvasResizeObserver({
	containerRef,
}: {
	containerRef: RefObject<HTMLDivElement | null>;
}) {
	const setSize = useThree((state) => state.setSize);
	const invalidate = useThree((state) => state.invalidate);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const resize = () => {
			const { width, height } = container.getBoundingClientRect();
			if (width === 0 || height === 0) return;
			setSize(width, height);
			invalidate();
		};

		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(container);
		return () => observer.disconnect();
	}, [containerRef, setSize, invalidate]);

	return null;
}

function DemandFrameInvalidator() {
	const invalidate = useThree((state) => state.invalidate);
	return (
		<OrbitControls
			makeDefault
			enableDamping
			dampingFactor={0.05}
			rotateSpeed={0.5}
			zoomSpeed={1}
			panSpeed={0.5}
			onChange={() => invalidate()}
		/>
	);
}

interface ViewerCanvasProps {
	scene: THREE.Group | null;
	highlightOverlay: THREE.Group | null;
	onHighlight: (entityIndex: number, shiftKey: boolean) => void;
	zoomTrigger: "extent" | "selected" | null;
	onZoomDone: () => void;
	isExpanded: boolean;
	containerRef: RefObject<HTMLDivElement | null>;
}

export function ViewerCanvas({
	scene,
	highlightOverlay,
	onHighlight,
	zoomTrigger,
	onZoomDone,
	isExpanded,
	containerRef,
}: ViewerCanvasProps) {
	return (
		<Canvas
			className="h-full w-full bg-white"
			frameloop="demand"
			shadows
			dpr={isExpanded ? [1, 2] : [1, 1.25]}
			gl={{
				antialias: true,
				powerPreference: "high-performance",
				toneMapping: THREE.ACESFilmicToneMapping,
				outputColorSpace: THREE.SRGBColorSpace,
			}}
		>
			<color attach="background" args={["#ffffff"]} />
			<PerspectiveCamera makeDefault position={[50, 50, 50]} fov={50} />
			<DemandFrameInvalidator />

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

			<Environment preset="city" background={false} />
			<gridHelper args={[1000, 100]} />

			<GizmoHelper alignment="top-right" margin={[50, 50]}>
				<group scale={0.8}>
					<GizmoViewcube />
				</group>
			</GizmoHelper>

			<CanvasResizeObserver containerRef={containerRef} />
		</Canvas>
	);
}
