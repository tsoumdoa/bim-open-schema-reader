"use client";

import { useGeometryFromParquetCtx } from "./geometry-from-parquet-context";
import { useGeometryFilter } from "@/app/hooks/use-geometry-filter";
import { Button } from "@/components/ui/button";
import {
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Box, Layers } from "lucide-react";
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
		visibleEntityCount,
		isTruncated,
		toggleShowAll,
	} = useGeometryFilter(entityIndices);

	if (loading) {
		return (
			<div className="flex h-64 w-full items-center justify-center bg-gray-100">
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

	if (!scene || visibleEntityCount === 0) {
		return (
			<div className="flex h-16 w-full items-center justify-center border-b border-gray-200 bg-gray-50">
				<div className="text-sm text-gray-500">
					No geometry found for these entities
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-full">
			<div className="absolute top-2 left-2 z-10 flex gap-2">
				<div className="bg-black/70 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2">
					<Box className="h-4 w-4" />
					{isTruncated
						? `Showing ${visibleEntityCount} of ${totalEntityCount} entities`
						: `${totalEntityCount} entities`}
				</div>
				{isTruncated && (
					<Button
						variant="secondary"
						size="sm"
						onClick={toggleShowAll}
						className="gap-1.5"
					>
						<Layers className="h-4 w-4" />
						Show All ({totalEntityCount})
					</Button>
				)}
				{!isTruncated && totalEntityCount > 100 && (
					<Button
						variant="secondary"
						size="sm"
						onClick={toggleShowAll}
						className="gap-1.5"
					>
						<Layers className="h-4 w-4" />
						Show Top 100
					</Button>
				)}
			</div>
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
			</Canvas>
		</div>
	);
}
