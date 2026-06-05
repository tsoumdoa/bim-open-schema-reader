"use client";

import { useGeometryFromParquetCtx } from "../geometry-from-parquet-context";
import { useEscapeKey } from "./hooks/use-escape-key";
import { useHighlightManagement } from "./hooks/use-highlight-management";
import { useZoomControls } from "./hooks/use-zoom-controls";
import { ViewerCanvas } from "./viewer-canvas";
import { ViewerOverlay } from "./viewer-overlay";
import { useGeometryFilter } from "@/app/hooks/use-geometry-filter";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { useExpandedViewer } from "./hooks/use-expanded-viewer";

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
	const [isExpanded, setIsExpanded] = useState(false);
	const collapseExpanded = useCallback(() => setIsExpanded(false), []);
	const toggleExpanded = useCallback(
		() => setIsExpanded((prev) => !prev),
		[]
	);
	useExpandedViewer(isExpanded, collapseExpanded);
	const {
		zoomTrigger,
		handleZoomToExtent,
		handleZoomToSelected,
		handleZoomDone,
	} = useZoomControls();
	const { handleHighlight, clearHighlight } = useHighlightManagement({
		setHighlightedEntityIndices,
	});

	useEscapeKey(
		containerRef,
		highlightedEntityIndices,
		clearHighlight,
		isExpanded
	);

	if (loading) return <LoadingState />;
	if (error) return <ErrorState message={error.message} />;
	if (!scene || totalEntityCount === 0) return <NoGeometryState />;

	return (
		<>
			{isExpanded && (
				<div
					className="h-100 w-full shrink-0 rounded border border-dashed border-neutral-300 bg-neutral-50"
					aria-hidden
				/>
			)}
			<div
				ref={containerRef}
				className={cn(
					"relative w-full outline-none",
					isExpanded
						? "fixed inset-0 z-50 h-dvh w-dvw bg-neutral-950"
						: "h-100"
				)}
				tabIndex={0}
			>
				<ViewerOverlay
					totalEntityCount={totalEntityCount}
					ghostCount={ghostCount}
					ghostOthers={ghostOthers}
					highlightedCount={highlightedEntityIndices.size}
					entityIndicesLength={entityIndices.length}
					availableEntityCount={availableEntityCount}
					isExpanded={isExpanded}
					onToggleExpand={toggleExpanded}
					onZoomToExtent={handleZoomToExtent}
					onZoomToSelected={handleZoomToSelected}
					onGhostToggle={toggleGhostOthers}
					onClearSelection={clearHighlight}
				/>
				<div className="absolute inset-0">
					<ViewerCanvas
						rootRef={containerRef}
						isExpanded={isExpanded}
						scene={scene}
						highlightOverlay={highlightOverlay}
						onHighlight={handleHighlight}
						zoomTrigger={zoomTrigger}
						onZoomDone={handleZoomDone}
					/>
				</div>
			</div>
		</>
	);
}
