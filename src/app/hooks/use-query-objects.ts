import { QueryObject, QueryObjects } from "../utils/types";
import { useState } from "react";
import { nanoid } from "nanoid";

export function useQueryObjects() {
	const [queryObjects, setQueryObjects] = useState<QueryObjects>([]);
	const addQuery = (queryObject: QueryObject) => {
		const id = nanoid(7);
		const newQueryObjects = { ...queryObject, id };
		setQueryObjects((prev) => [...prev, newQueryObjects]);
	};

	const addQueries = (queryObjectsToAdd: QueryObject[]) => {
		const newOnes = queryObjectsToAdd.map((obj) => ({
			...obj,
			id: nanoid(7),
		}));
		setQueryObjects((prev) => [...prev, ...newOnes]);
	};

	const removeQuery = (queryObject: QueryObject) => {
		setQueryObjects(queryObjects.filter((q) => q.id !== queryObject.id));
	};

	const updateQueryTitle = (queryObject: QueryObject, newTitle: string) => {
		const newQueryObjects = queryObjects.map((q) => {
			if (q.id === queryObject.id) {
				return { ...q, queryTitle: newTitle, isCustom: true };
			}
			return q;
		});
		setQueryObjects(newQueryObjects);
	};
	const updateQuery = (queryObject: QueryObject, newQuery: string) => {
		const newQueryObjects = queryObjects.map((q) => {
			if (q.id === queryObject.id) {
				return { ...q, query: newQuery };
			}
			return q;
		});
		setQueryObjects(newQueryObjects);
	};

	return {
		queryObjects,
		addQuery,
		addQueries,
		removeQuery,
		updateQueryTitle,
		updateQuery,
	};
}
