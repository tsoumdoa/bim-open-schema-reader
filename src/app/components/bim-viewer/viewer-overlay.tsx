"use client";

import { Button } from "@/components/ui/button";
import { Box, Ghost, Maximize, Focus } from "lucide-react";

interface EntityCountBadgeProps {
	totalEntityCount: number;
	ghostCount: number;
	ghostOthers: boolean;
}

export function EntityCountBadge({
	totalEntityCount,
	ghostCount,
	ghostOthers,
}: EntityCountBadgeProps) {
	return (
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
	);
}

interface SelectionBadgeProps {
	count: number;
	onClear: () => void;
}

export function SelectionBadge({ count, onClear }: SelectionBadgeProps) {
	if (count === 0) return null;
	return (
		<div className="bg-yellow-500/90 text-black px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
			<span>
				{count} entity{count > 1 ? "s" : ""} selected
			</span>
			<button
				className="ml-1 hover:text-red-700 font-bold cursor-pointer bg-transparent border-none p-0"
				onClick={onClear}
			>
				✕
			</button>
		</div>
	);
}

interface GhostToggleProps {
	ghostOthers: boolean;
	onClick: () => void;
}

export function GhostToggle({ ghostOthers, onClick }: GhostToggleProps) {
	return (
		<Button
			variant={ghostOthers ? "default" : "secondary"}
			size="sm"
			onClick={onClick}
			className="absolute bottom-2 right-2 z-10 gap-1.5"
		>
			<Ghost className="h-4 w-4" />
			{ghostOthers ? "Hide Unselected" : "Show Unselected"}
		</Button>
	);
}

interface ZoomControlsProps {
	zoomTrigger: "extent" | "selected" | null;
	onZoomToExtent: () => void;
	onZoomToSelected: () => void;
	hasSelection: boolean;
}

export function ZoomControls({
	onZoomToExtent,
	onZoomToSelected,
	hasSelection,
}: ZoomControlsProps) {
	return (
		<div className="absolute top-2 right-2 z-10 flex gap-1.5">
			<Button
				variant="secondary"
				size="sm"
				onClick={onZoomToExtent}
				className="gap-1.5 bg-black/70 text-white hover:bg-black/90 border-none"
				title="Zoom to Extent"
			>
				<Maximize className="h-4 w-4" />
			</Button>
			<Button
				variant="secondary"
				size="sm"
				onClick={onZoomToSelected}
				disabled={!hasSelection}
				className="gap-1.5 bg-black/70 text-white hover:bg-black/90 border-none disabled:opacity-30"
				title="Zoom to Selected"
			>
				<Focus className="h-4 w-4" />
			</Button>
		</div>
	);
}

interface ViewerOverlayProps {
	totalEntityCount: number;
	ghostCount: number;
	ghostOthers: boolean;
	highlightedCount: number;
	entityIndicesLength: number;
	availableEntityCount: number;
	zoomTrigger: "extent" | "selected" | null;
	onZoomToExtent: () => void;
	onZoomToSelected: () => void;
	onGhostToggle: () => void;
	onClearSelection: () => void;
}

export function ViewerOverlay({
	totalEntityCount,
	ghostCount,
	ghostOthers,
	highlightedCount,
	entityIndicesLength,
	availableEntityCount,
	onZoomToExtent,
	onZoomToSelected,
	onGhostToggle,
	onClearSelection,
}: ViewerOverlayProps) {
	const showGhostToggle =
		entityIndicesLength > 0 && totalEntityCount < availableEntityCount;

	return (
		<>
			<div className="absolute top-2 left-2 z-10 flex gap-2">
				<EntityCountBadge
					totalEntityCount={totalEntityCount}
					ghostCount={ghostCount}
					ghostOthers={ghostOthers}
				/>
				<SelectionBadge count={highlightedCount} onClear={onClearSelection} />
			</div>
			{showGhostToggle && (
				<GhostToggle ghostOthers={ghostOthers} onClick={onGhostToggle} />
			)}
			<ZoomControls
				onZoomToExtent={onZoomToExtent}
				onZoomToSelected={onZoomToSelected}
				hasSelection={highlightedCount > 0}
			/>
		</>
	);
}
