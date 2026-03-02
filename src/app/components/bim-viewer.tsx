"use client";

import { useGeometryFromDuckDB } from "@/app/hooks/use-geometry-from-duckdb";
import { Button } from "@/components/ui/button";
import {
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EyeOff, Box } from "lucide-react";
import { useState } from "react";
import * as THREE from "three";

function Scene({ scene }: { scene: any }) {
	if (!scene) return null;

	return <primitive object={scene} />;
}

export function BimViewer({
	conn,
	category,
	showStats = false,
}: {
	conn: any;
	category?: string;
	showStats?: boolean;
	initialVisible?: boolean;
}) {
	const {
		loading: isLoading,
		error: connError,
		scene,
		instanceCount,
	} = useGeometryFromDuckDB(conn, category);

	return (
		<div className="relative w-full h-full">
			<div className="absolute top-2 right-2 z-10 flex gap-2">
				{showStats && instanceCount > 0 && (
					<div className="bg-black/70 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2">
						<Box className="h-4 w-4" />
						{instanceCount} elements
					</div>
				)}
			</div>
			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
					<div className="text-white">Loading geometry...</div>
				</div>
			)}
			{connError && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-red-900/50">
					<div className="text-white p-4">Error: {connError?.message}</div>
				</div>
			)}
			<Canvas
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
