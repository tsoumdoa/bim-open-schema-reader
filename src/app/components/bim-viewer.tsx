"use client";

import { useGeometryFromParquetCtx } from "./geometry-from-parquet-context";
import { useGeometryFilter } from "@/app/hooks/use-geometry-filter";
import { Button } from "@/components/ui/button";
import type { EntityFaceRangesSoA } from "@/lib/geometry-utils";
import {
	GizmoHelper,
	GizmoViewcube,
	OrbitControls,
	PerspectiveCamera,
	Environment,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Box, Ghost } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function FrameInvalidator({ deps }: { deps: unknown }) {
	const invalidate = useThree((state) => state.invalidate);
	useEffect(() => {
		invalidate();
	}, [deps, invalidate]);
	return null;
}

function findEntityByFaceIndex(
	faceIndex: number,
	faceRanges: EntityFaceRangesSoA
): number | null {
	const { entityIndices, startFaces, faceCounts } = faceRanges;
	let lo = 0;
	let hi = startFaces.length - 1;
	while (lo <= hi) {
		const mid = (lo + hi) >>> 1;
		const start = startFaces[mid];
		if (faceIndex < start) {
			hi = mid - 1;
		} else if (faceIndex >= start + faceCounts[mid]) {
			lo = mid + 1;
		} else {
			return entityIndices[mid];
		}
	}
	return null;
}

function RaycastPicker({
	scene,
	onHighlight,
}: {
	scene: THREE.Group;
	onHighlight: (entityIndex: number, shiftKey: boolean) => void;
}) {
	const { camera, gl, raycaster } = useThree();
	const meshRefs = useRef<THREE.Mesh[]>([]);

	useEffect(() => {
		const meshes: THREE.Mesh[] = [];
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh && child.userData.entityFaceRanges) {
				meshes.push(child);
			}
		});
		meshRefs.current = meshes;
	}, [scene]);

	function handlePointerDown(event: THREE.Event) {
		(event as unknown as { stopPropagation: () => void }).stopPropagation();

		const pointer = event as unknown as { clientX: number; clientY: number };
		const shiftKey =
			(event as unknown as { shiftKey: boolean }).shiftKey ?? false;
		const rect = gl.domElement.getBoundingClientRect();
		const ndc = new THREE.Vector2(
			((pointer.clientX - rect.left) / rect.width) * 2 - 1,
			-((pointer.clientY - rect.top) / rect.height) * 2 + 1
		);

		raycaster.setFromCamera(ndc, camera);
		const intersects = raycaster.intersectObjects(meshRefs.current, false);

		if (intersects.length > 0) {
			const hit = intersects[0];
			const faceRanges = (hit.object as THREE.Mesh).userData
				.entityFaceRanges as EntityFaceRangesSoA;
			if (faceRanges && hit.faceIndex != null) {
				const entityIndex = findEntityByFaceIndex(hit.faceIndex, faceRanges);
				if (entityIndex !== null) {
					onHighlight(entityIndex, shiftKey);
				}
			}
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
	onHighlight,
	invalidateKey,
}: {
	scene: THREE.Group | null;
	highlightOverlay: THREE.Group | null;
	onHighlight: (entityIndex: number, shiftKey: boolean) => void;
	invalidateKey: unknown;
}) {
	if (!scene) return null;

	return (
		<>
			<primitive object={scene} />
			{highlightOverlay && <primitive object={highlightOverlay} />}
			<RaycastPicker scene={scene} onHighlight={onHighlight} />
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
		highlightedEntityIndices,
		setHighlightedEntityIndices,
		highlightOverlay,
	} = useGeometryFilter(entityIndices);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape" && highlightedEntityIndices.size > 0) {
				e.preventDefault();
				setHighlightedEntityIndices(new Set());
			}
		}
		el.addEventListener("keydown", onKeyDown);
		return () => el.removeEventListener("keydown", onKeyDown);
	}, [highlightedEntityIndices.size, setHighlightedEntityIndices]);

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

	const handleHighlight = (entityIndex: number, shiftKey: boolean) => {
		if (shiftKey) {
			setHighlightedEntityIndices((prev) => {
				const next = new Set(prev);
				if (next.has(entityIndex)) {
					next.delete(entityIndex);
				} else {
					next.add(entityIndex);
				}
				return next;
			});
		} else {
			setHighlightedEntityIndices(new Set([entityIndex]));
		}
	};

	return (
		<div ref={containerRef} className="relative w-full h-100" tabIndex={0}>
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
				{highlightedEntityIndices.size > 0 && (
					<div className="bg-yellow-500/90 text-black px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
						<span>
							{highlightedEntityIndices.size} entity
							{highlightedEntityIndices.size > 1 ? "s" : ""} selected
						</span>
						<button
							className="ml-1 hover:text-red-700 font-bold cursor-pointer bg-transparent border-none p-0"
							onClick={() => setHighlightedEntityIndices(new Set())}
						>
							✕
						</button>
					</div>
				)}
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

				<Scene
					scene={scene}
					highlightOverlay={highlightOverlay}
					onHighlight={handleHighlight}
					invalidateKey={highlightedEntityIndices}
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
