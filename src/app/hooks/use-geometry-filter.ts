import { useGeometryFromParquetCtx } from "../components/geometry-from-parquet-context";
import {
	GeometricalDataCache,
	UseGeoComputedResult,
	UseGeoLastInputs,
	UseGeometryFilterResult,
} from "../utils/types";
import {
	buildFilteredScene,
	buildGhostedScene,
	buildHighlightOverlay,
} from "@/lib/geometry-utils";
import { useRef, useState } from "react";

function getEntityIndicesKey(entityIndices: number[]) {
	return JSON.stringify([...entityIndices].sort());
}

function shouldReuseLastResult(
	lastResult: unknown,
	lastInputs: UseGeoLastInputs | null,
	entityIndices: number[],
	ghostOthers: boolean,
	cache: unknown
) {
	if (lastResult == null || lastInputs == null) {
		return false;
	}

	return (
		getEntityIndicesKey(lastInputs.entityIndices) ===
			getEntityIndicesKey(entityIndices) &&
		lastInputs.ghostOthers === ghostOthers &&
		lastInputs.cache === cache
	);
}

function buildGeomComputedResult(
	loading: boolean,
	error: Error | null,
	entityIndices: number[],
	ghostOthers: boolean,
	cache: GeometricalDataCache | null
): UseGeoComputedResult {
	if (loading || error || entityIndices.length === 0) {
		return {
			scene: null,
			instanceCount: 0,
			totalEntityCount: 0,
			ghostCount: 0,
			availableEntityCount: cache ? new Set(cache.instanceEntityIndex).size : 0,
		};
	}

	const totalEntityCount = new Set(entityIndices).size;
	const availableEntityCount = cache
		? new Set(cache.instanceEntityIndex).size
		: 0;

	if (ghostOthers) {
		const { scene, selectedCount, ghostCount } = buildGhostedScene(
			entityIndices,
			cache
		);

		return {
			scene,
			instanceCount: selectedCount,
			totalEntityCount,
			ghostCount,
			availableEntityCount,
		};
	} else {
		const { scene, instanceCount } = buildFilteredScene(
			entityIndices,
			cache
		);
		return {
			scene,
			instanceCount,
			totalEntityCount,
			ghostCount: 0,
			availableEntityCount,
		};
	}
}

export function useGeometryFilter(
	entityIndices: number[]
): UseGeometryFilterResult {
	const { cache, loading, error } = useGeometryFromParquetCtx();
	const [ghostOthers, setGhostOthers] = useState(false);
	const [highlightedEntityIndices, setHighlightedEntityIndices] = useState<
		Set<number>
	>(new Set());

	const lastResultRef = useRef<UseGeoComputedResult | null>(null);
	const lastInputsRef = useRef<UseGeoLastInputs | null>(null);

	const toggleGhostOthers = () => setGhostOthers((prev) => !prev);

	const reuseLastRes = shouldReuseLastResult(
		lastResultRef.current,
		lastInputsRef.current,
		entityIndices,
		ghostOthers,
		cache
	);

	if (!reuseLastRes) {
		lastResultRef.current = buildGeomComputedResult(
			loading,
			error,
			entityIndices,
			ghostOthers,
			cache
		);
	}
	lastInputsRef.current = { entityIndices, ghostOthers, highlightedEntityIndices, cache };

	const highlightOverlay =
		cache && highlightedEntityIndices.size > 0 && !loading && !error
			? buildHighlightOverlay(highlightedEntityIndices, entityIndices, cache)
			: null;

	return {
		...lastResultRef.current!,
		ghostOthers,
		toggleGhostOthers,
		highlightedEntityIndices,
		setHighlightedEntityIndices,
		highlightOverlay,
	};
}
