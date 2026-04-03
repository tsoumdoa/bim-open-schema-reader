import { useGeometryFromParquetCtx } from "../components/geometry-from-parquet-context";
import { buildFilteredScene } from "@/lib/geometry-utils";
import { useRef, useState } from "react";
import * as THREE from "three";

interface UseGeometryFilterResult {
	scene: THREE.Group | null;
	instanceCount: number;
	totalEntityCount: number;
	visibleEntityCount: number;
	isTruncated: boolean;
	showAll: boolean;
	toggleShowAll: () => void;
}

interface ComputedResult {
	scene: THREE.Group | null;
	instanceCount: number;
	totalEntityCount: number;
	visibleEntityCount: number;
	isTruncated: boolean;
}

export function useGeometryFilter(
	entityIndices: number[]
): UseGeometryFilterResult {
	const { cache, loading, error } = useGeometryFromParquetCtx();
	const [showAll, setShowAll] = useState(false);

	const lastResultRef = useRef<ComputedResult | null>(null);
	const lastInputsRef = useRef<{
		entityIndices: number[];
		showAll: boolean;
		cache: unknown;
	} | null>(null);

	const toggleShowAll = () => setShowAll((prev) => !prev);

	const inputsMatch =
		lastInputsRef.current !== null &&
		lastInputsRef.current.entityIndices === entityIndices &&
		lastInputsRef.current.showAll === showAll &&
		lastInputsRef.current.cache === cache;

	if (loading || error || entityIndices.length === 0) {
		lastResultRef.current = {
			scene: null,
			instanceCount: 0,
			totalEntityCount: 0,
			visibleEntityCount: 0,
			isTruncated: false,
		};
	} else if (!inputsMatch) {
		const indicesToShow = showAll
			? entityIndices
			: entityIndices.slice(0, 30000);
		const { scene, instanceCount } = buildFilteredScene(indicesToShow, cache);

		const totalEntityCount = new Set(entityIndices).size;
		const visibleEntityCount = new Set(indicesToShow).size;
		const isTruncated = totalEntityCount > 30000 && !showAll;

		lastResultRef.current = {
			scene,
			instanceCount,
			totalEntityCount,
			visibleEntityCount,
			isTruncated,
		};
		lastInputsRef.current = { entityIndices, showAll, cache };
	}

	return {
		...lastResultRef.current!,
		showAll,
		toggleShowAll,
	};
}
