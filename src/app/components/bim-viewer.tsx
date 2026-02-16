"use client";

import { useGeometryFromDuckDB } from "@/app/hooks/use-geometry-from-duckdb";
import {
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface BimViewerProps {
	conn: any;
	category?: string;
	showStats?: boolean;
}

function Scene({
	conn,
	category,
	onInstanceCountChange,
	onLoadingChange,
	onError,
}: {
	conn: any;
	category?: string;
	onInstanceCountChange?: (count: number) => void;
	onLoadingChange?: (loading: boolean) => void;
	onError?: (error: Error | null) => void;
}) {
	const { loading, error, scene, instanceCount } = useGeometryFromDuckDB(
		conn,
		category
	);

	useEffect(() => {
		onLoadingChange?.(loading);
	}, [loading, onLoadingChange]);

	useEffect(() => {
		onError?.(error);
	}, [error, onError]);

	useEffect(() => {
		if (onInstanceCountChange) {
			onInstanceCountChange(instanceCount);
		}
	}, [instanceCount, onInstanceCountChange]);

	if (loading) {
		return (
			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="gray" wireframe />
			</mesh>
		);
	}

	if (error) {
		console.error("Geometry error:", error);
		return (
			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="red" wireframe />
			</mesh>
		);
	}

	if (!scene) return null;

	return <primitive object={scene} />;
}

export function BimViewer({
	conn,
	category,
	showStats = false,
}: BimViewerProps) {
	const instanceCountRef = useRef(0);
	const [isLoading, setIsLoading] = useState(false);
	const [connError, setConnError] = useState<Error | null>(null);

	const handleInstanceCountChange = (count: number) => {
		instanceCountRef.current = count;
	};

	const handleLoadingChange = (loading: boolean) => {
		setIsLoading(loading);
	};

	const handleError = (error: Error | null) => {
		setConnError(error);
	};

	if (!conn) {
		console.log("BimViewer: conn is null/undefined");
		return (
			<div className="flex items-center justify-center h-full bg-gray-900">
				<div className="text-white">Waiting for database...</div>
			</div>
		);
	}

	console.log(
		"BimViewer: conn exists, conn type:",
		typeof conn,
		"has query:",
		typeof conn?.query
	);

	return (
		<div className="relative w-full h-full">
			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
					<div className="text-white">Loading geometry...</div>
				</div>
			)}
			{connError && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-red-900/50">
					<div className="text-white p-4">Error: {connError.message}</div>
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

				<Scene
					conn={conn}
					category={category}
					onInstanceCountChange={handleInstanceCountChange}
					onLoadingChange={handleLoadingChange}
					onError={handleError}
				/>

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
