import { validFileNames, BosFileType, validFileNamesWithGeo } from "./types";

export function validateEntries(entries: string[]): BosFileType {
	let hasGeo = false;

	if (entries.length !== 11 && entries.length !== 17) return "INVALID";
	if (entries.length === 17) hasGeo = true;

	//NOTE: override for compatibility for now

	const set = new Set(entries);

	if (hasGeo) {
		for (const required of validFileNamesWithGeo) {
			if (!set.has(required)) return "INVALID";
		}
		return "GEO";
	} else {
		for (const required of validFileNames) {
			if (!set.has(required)) return "INVALID";
		}
		return "NON_GEO";
	}
}
