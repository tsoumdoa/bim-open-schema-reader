"use client";

import { useGeometryFromDuckDB } from "@/app/hooks/use-geometry-from-duckdb";
import {
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
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
}) {
	const instanceCountRef = useRef(0);
	const {
		loading: isLoading,
		error: connError,
		scene,
	} = useGeometryFromDuckDB(conn, category);

	return (
		<div className="relative w-full h-full">
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

			{showStats && (
				<div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded text-sm">
					Instances: {instanceCountRef.current}
				</div>
			)}
		</div>
	);
}
