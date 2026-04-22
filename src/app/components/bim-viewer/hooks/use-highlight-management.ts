"use client";

import { useCallback } from "react";
import { SetStateAction } from "react";

export function useHighlightManagement({
	setHighlightedEntityIndices,
}: {
	setHighlightedEntityIndices: (value: SetStateAction<Set<number>>) => void;
}) {
	const handleHighlight = useCallback(
		(entityIndex: number, shiftKey: boolean) => {
			if (shiftKey) {
				setHighlightedEntityIndices((prev) => {
					const next = new Set(prev);
					if (next.has(entityIndex)) {
						next.delete(entityIndex);
					} else {
						next.add(entityIndex);
					}
					return next;
				});
			} else {
				setHighlightedEntityIndices(new Set([entityIndex]));
			}
		},
		[setHighlightedEntityIndices]
	);

	const clearHighlight = useCallback(() => {
		setHighlightedEntityIndices(new Set());
	}, [setHighlightedEntityIndices]);

	return { handleHighlight, clearHighlight };
}
