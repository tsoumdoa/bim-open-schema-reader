"use client";

import { useState, useCallback } from "react";

type ZoomCommand = "extent" | "selected" | null;

export function useZoomControls() {
	const [zoomTrigger, setZoomTrigger] = useState<ZoomCommand>(null);

	const handleZoomToExtent = useCallback(() => {
		setZoomTrigger("extent");
	}, []);

	const handleZoomToSelected = useCallback(() => {
		setZoomTrigger("selected");
	}, []);

	const handleZoomDone = useCallback(() => {
		setZoomTrigger(null);
	}, []);

	return {
		zoomTrigger,
		handleZoomToExtent,
		handleZoomToSelected,
		handleZoomDone,
	};
}
