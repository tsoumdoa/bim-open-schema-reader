"use client";

import { useEffect } from "react";

export function useExpandedViewer(isExpanded: boolean, onCollapse: () => void) {
	useEffect(() => {
		if (!isExpanded) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isExpanded]);

	useEffect(() => {
		if (!isExpanded) return;

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				e.preventDefault();
				onCollapse();
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isExpanded, onCollapse]);
}
