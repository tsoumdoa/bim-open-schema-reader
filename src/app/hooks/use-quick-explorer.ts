"use client";

import { useEffect, useState } from "react";

export function useQuickExplorer(setDisplayExpanded: (b: number) => void) {
	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.code === "Space" &&
				event.shiftKey &&
				(event.metaKey || event.ctrlKey)
			) {
				event.preventDefault();
				setIsActive((prev) => !prev);
				setDisplayExpanded(-1);
			}
		};

		// Also allow Escape to close
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isActive) {
				setIsActive(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keydown", handleEscape);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isActive]);

	return { isActive, setIsActive };
}
