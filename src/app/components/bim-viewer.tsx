"use client";

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
import { Canvas } from "@react-three/fiber";
import { Box, Ghost } from "lucide-react";
import * as THREE from "three";

function Scene({ scene }: { scene: THREE.Group | null }) {
	if (!scene) return null;

	return <primitive object={scene} />;
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
	} = useGeometryFilter(entityIndices);

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
			</div>
			{entityIndices.length > 0 && totalEntityCount < availableEntityCount && (
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

				<Scene scene={scene} />

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
