"use client";

import { useThree } from "@react-three/fiber";
import { RefObject, useEffect } from "react";

export function CanvasResizeSync({
	rootRef,
	isExpanded,
}: {
	rootRef: RefObject<HTMLElement | null>;
	isExpanded: boolean;
}) {
	const setSize = useThree((state) => state.setSize);
	const invalidate = useThree((state) => state.invalidate);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const sync = () => {
			const { width, height } = root.getBoundingClientRect();
			const w = Math.round(width);
			const h = Math.round(height);
			if (w > 0 && h > 0) {
				setSize(w, h);
				invalidate();
			}
		};

		sync();
		const rafId = requestAnimationFrame(sync);
		const timeoutId = window.setTimeout(sync, 50);

		const observer = new ResizeObserver(sync);
		observer.observe(root);

		return () => {
			cancelAnimationFrame(rafId);
			window.clearTimeout(timeoutId);
			observer.disconnect();
		};
	}, [rootRef, isExpanded, setSize, invalidate]);

	return null;
}
