"use client";

import { useRef, useEffect } from "react";
import { useGeometryFromParquetCtx } from "./geometry-from-parquet-context";
import { useGeometryFilter } from "@/app/hooks/use-geometry-filter";
import { Button } from "@/components/ui/button";
import {
	GizmoHelper,
	GizmoViewcube,
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Box, Ghost } from "lucide-react";
import * as THREE from "three";
import type { InstanceBounds } from "@/lib/geometry-utils";

function FrameInvalidator({ deps }: { deps: unknown }) {
	const invalidate = useThree((state) => state.invalidate);
	useEffect(() => {
		invalidate();
	}, [deps, invalidate]);
	return null;
}

function PickTarget({
	bounds,
	onHighlight,
}: {
	bounds: InstanceBounds[];
	onHighlight: (entityIndex: number) => void;
}) {
	const { camera, gl } = useThree();

	function handlePointerDown(event: THREE.Event) {
		(event as unknown as { stopPropagation: () => void }).stopPropagation();

		const pointer = (event as unknown as { clientX: number; clientY: number });
		const rect = gl.domElement.getBoundingClientRect();
		const ndc = new THREE.Vector2(
			((pointer.clientX - rect.left) / rect.width) * 2 - 1,
			-((pointer.clientY - rect.top) / rect.height) * 2 + 1
		);

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(ndc, camera);

		let closestEntity: number | null = null;
		let closestDist = Infinity;

		for (const b of bounds) {
			const intersection = raycaster.ray.intersectBox(b.bbox, new THREE.Vector3());
			if (intersection) {
				const dist = intersection.distanceTo(raycaster.ray.origin);
				if (dist < closestDist) {
					closestDist = dist;
					closestEntity = b.entityIndex;
				}
			}
		}

		if (closestEntity !== null) {
			onHighlight(closestEntity);
		}
	}

	return (
		<mesh
			visible={false}
			position={[0, 0, 0]}
			onPointerDown={handlePointerDown}
		>
			<planeGeometry args={[10000, 10000]} />
			<meshBasicMaterial />
		</mesh>
	);
}

function Scene({
	scene,
	highlightOverlay,
	bounds,
	onHighlight,
	invalidateKey,
}: {
	scene: THREE.Group | null;
	highlightOverlay: THREE.Group | null;
	bounds: InstanceBounds[];
	onHighlight: (entityIndex: number) => void;
	invalidateKey: unknown;
}) {
	if (!scene) return null;

	return (
		<>
			<primitive object={scene} />
			{highlightOverlay && <primitive object={highlightOverlay} />}
			<PickTarget bounds={bounds} onHighlight={onHighlight} />
			<FrameInvalidator deps={invalidateKey} />
		</>
	);
}

export function BimViewer({ entityIndices }: { entityIndices: number[] }) {
	const { loading, error } = useGeometryFromParquetCtx();
	const {
		scene,
		totalEntityCount,
		ghostCount,
		ghostOthers,
		availableEntityCount,
		toggleGhostOthers,
		bounds,
		highlightedEntityIndex,
		setHighlightedEntityIndex,
		highlightOverlay,
	} = useGeometryFilter(entityIndices);
	const highlightRef = useRef(setHighlightedEntityIndex);
	highlightRef.current = setHighlightedEntityIndex;

	if (loading) {
		return (
			<div className="flex h-16 w-full items-center justify-center bg-gray-100">
				<div className="text-gray-500">Loading geometry...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-64 w-full items-center justify-center bg-red-100">
				<div className="text-red-500">Error: {error.message}</div>
			</div>
		);
	}

	if (!scene || totalEntityCount === 0) {
		return (
			<div className="flex h-10 w-full items-center justify-center bg-gray-50">
				<div className="text-sm text-gray-500">
					No geometry found for these entities
				</div>
			</div>
		);
	}

	const handleHighlight = (entityIndex: number) => {
		highlightRef.current(entityIndex);
	};

	return (
		<div className="relative w-full h-100">
			<div className="absolute top-2 left-2 z-10 flex gap-2">
				<div className="bg-black/70 text-white px-3 py-1.5 rounded text-xs flex items-center gap-2">
					<Box className="h-4 w-4" />
					{ghostOthers ? (
						<span>
							{totalEntityCount.toLocaleString()} selected (
							{ghostCount.toLocaleString()} unselected)
						</span>
					) : (
						`${totalEntityCount.toLocaleString()} entities`
					)}
				</div>
				{highlightedEntityIndex !== null && (
					<div className="bg-yellow-500/90 text-black px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
						<span>Entity #{highlightedEntityIndex}</span>
						<button
							className="ml-1 hover:text-red-700 font-bold cursor-pointer bg-transparent border-none p-0"
							onClick={() => setHighlightedEntityIndex(null)}
						>
							✕
						</button>
					</div>
				)}
			</div>
			{entityIndices.length > 0 &&
				totalEntityCount < availableEntityCount && (
					<Button
						variant={ghostOthers ? "default" : "secondary"}
						size="sm"
						onClick={toggleGhostOthers}
						className="absolute bottom-2 right-2 z-10 gap-1.5"
					>
						<Ghost className="h-4 w-4" />
						{ghostOthers ? "Hide Unselected" : "Show Unselected"}
					</Button>
				)}
			<Canvas
				frameloop="demand"
				shadows
				gl={{
					antialias: true,
					toneMapping: THREE.ACESFilmicToneMapping,
					outputColorSpace: THREE.SRGBColorSpace,
				}}
			>
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
					bounds={bounds}
					onHighlight={handleHighlight}
					invalidateKey={highlightedEntityIndex}
				/>

				<Environment preset="city" />
				<gridHelper args={[1000, 100]} />

				<GizmoHelper alignment="top-right" margin={[50, 50]}>
					<group scale={0.8}>
						<GizmoViewcube />
					</group>
				</GizmoHelper>
			</Canvas>
		</div>
	);
}
