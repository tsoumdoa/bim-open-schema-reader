import { validFileNames } from "./types";

export function validateEntries(entries: string[]) {
  if (entries.length !== 11) return false;
  const set = new Set(entries);
  if (set.size !== 11) return false;

  for (const required of validFileNames) {
    if (!set.has(required)) return false;
  }

  return true;
}
