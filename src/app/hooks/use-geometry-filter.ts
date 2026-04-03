import { useGeometryFromParquetCtx } from "../components/geometry-from-parquet-context";
import { buildFilteredScene, buildGhostedScene } from "@/lib/geometry-utils";
import { useRef, useState } from "react";
import * as THREE from "three";

interface UseGeometryFilterResult {
	scene: THREE.Group | null;
	instanceCount: number;
	totalEntityCount: number;
	ghostCount: number;
	ghostOthers: boolean;
	toggleGhostOthers: () => void;
}

interface ComputedResult {
	scene: THREE.Group | null;
	instanceCount: number;
	totalEntityCount: number;
	ghostCount: number;
}

export function useGeometryFilter(
	entityIndices: number[]
): UseGeometryFilterResult {
	const { cache, loading, error } = useGeometryFromParquetCtx();
	const [ghostOthers, setGhostOthers] = useState(false);

	const lastResultRef = useRef<ComputedResult | null>(null);
	const lastInputsRef = useRef<{
		entityIndices: number[];
		ghostOthers: boolean;
		cache: unknown;
	} | null>(null);

	const toggleGhostOthers = () => setGhostOthers((prev) => !prev);

	const inputsMatch =
		lastResultRef.current !== null &&
		lastInputsRef.current !== null &&
		lastInputsRef.current.entityIndices === entityIndices &&
		lastInputsRef.current.ghostOthers === ghostOthers &&
		lastInputsRef.current.cache === cache;

	if (loading || error || entityIndices.length === 0) {
		lastResultRef.current = {
			scene: null,
			instanceCount: 0,
			totalEntityCount: 0,
			ghostCount: 0,
		};
	} else if (!inputsMatch) {
		const totalEntityCount = new Set(entityIndices).size;

		if (ghostOthers) {
			const { scene, selectedCount, ghostCount } = buildGhostedScene(
				entityIndices,
				cache
			);

			lastResultRef.current = {
				scene,
				instanceCount: selectedCount,
				totalEntityCount,
				ghostCount,
			};
			lastInputsRef.current = { entityIndices, ghostOthers, cache };
		} else {
			const { scene, instanceCount } = buildFilteredScene(entityIndices, cache);

			lastResultRef.current = {
				scene,
				instanceCount,
				totalEntityCount,
				ghostCount: 0,
			};
			lastInputsRef.current = { entityIndices, ghostOthers, cache };
		}
	}

	return {
		...lastResultRef.current!,
		ghostOthers,
		toggleGhostOthers,
	};
}
