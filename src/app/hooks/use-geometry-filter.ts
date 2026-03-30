import { useGeometryFromParquetCtx } from "../components/geometry-from-parquet-context";
import { useMemo, useState } from "react";
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

export function useGeometryFilter(
	entityIndices: number[]
): UseGeometryFilterResult {
	const { getFilteredScene, loading, error } = useGeometryFromParquetCtx();
	const [showAll, setShowAll] = useState(false);

	const toggleShowAll = () => setShowAll((prev) => !prev);

	const result = useMemo(() => {
		if (loading || error || entityIndices.length === 0) {
			return {
				scene: null as THREE.Group | null,
				instanceCount: 0,
				totalEntityCount: 0,
				visibleEntityCount: 0,
				isTruncated: false,
			};
		}

		const indicesToShow = showAll
			? entityIndices
			: entityIndices.slice(0, 30000);
		const { scene, instanceCount } = getFilteredScene(indicesToShow);

		const totalEntityCount = new Set(entityIndices).size;
		const visibleEntityCount = new Set(indicesToShow).size;
		const isTruncated = totalEntityCount > 30000 && !showAll;

		return {
			scene,
			instanceCount,
			totalEntityCount,
			visibleEntityCount,
			isTruncated,
		};
	}, [entityIndices, showAll, getFilteredScene, loading, error]);

	return {
		...result,
		showAll,
		toggleShowAll,
	};
}
