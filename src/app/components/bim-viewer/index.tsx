"use client";

import { useGeometryFromParquetCtx } from "../geometry-from-parquet-context";
import { useEscapeKey } from "./hooks/use-escape-key";
import { useHighlightManagement } from "./hooks/use-highlight-management";
import { useZoomControls } from "./hooks/use-zoom-controls";
import { ViewerCanvas } from "./viewer-canvas";
import { ViewerOverlay } from "./viewer-overlay";
import { useGeometryFilter } from "@/app/hooks/use-geometry-filter";
import { useRef } from "react";

function LoadingState() {
	return (
		<div className="flex h-16 w-full items-center justify-center bg-gray-100">
			<div className="text-gray-500">Loading geometry...</div>
		</div>
	);
}

function ErrorState({ message }: { message: string }) {
	return (
		<div className="flex h-64 w-full items-center justify-center bg-red-100">
			<div className="text-red-500">Error: {message}</div>
		</div>
	);
}

function NoGeometryState() {
	return (
		<div className="flex h-10 w-full items-center justify-center bg-gray-50">
			<div className="text-sm text-gray-500">
				No geometry found for these entities
			</div>
		</div>
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
	const {
		zoomTrigger,
		handleZoomToExtent,
		handleZoomToSelected,
		handleZoomDone,
	} = useZoomControls();
	const { handleHighlight, clearHighlight } = useHighlightManagement({
		setHighlightedEntityIndices,
	});

	useEscapeKey(containerRef, highlightedEntityIndices, clearHighlight);

	if (loading) return <LoadingState />;
	if (error) return <ErrorState message={error.message} />;
	if (!scene || totalEntityCount === 0) return <NoGeometryState />;

	return (
		<div ref={containerRef} className="relative w-full h-100" tabIndex={0}>
			<ViewerOverlay
				totalEntityCount={totalEntityCount}
				ghostCount={ghostCount}
				ghostOthers={ghostOthers}
				highlightedCount={highlightedEntityIndices.size}
				entityIndicesLength={entityIndices.length}
				availableEntityCount={availableEntityCount}
				onZoomToExtent={handleZoomToExtent}
				onZoomToSelected={handleZoomToSelected}
				onGhostToggle={toggleGhostOthers}
				onClearSelection={clearHighlight}
			/>
			<ViewerCanvas
				scene={scene}
				highlightOverlay={highlightOverlay}
				onHighlight={handleHighlight}
				zoomTrigger={zoomTrigger}
				onZoomDone={handleZoomDone}
			/>
		</div>
	);
}
