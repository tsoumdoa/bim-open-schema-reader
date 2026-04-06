import { QueryObject, QueryObjects } from "../utils/types";
import { nanoid } from "nanoid";
import { useState } from "react";

export function useQueryObjects() {
	const [queryObjects, setQueryObjects] = useState<QueryObjects>([]);
	const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);

	const addQuery = (queryObject: QueryObject) => {
		const id = nanoid(7);
		const newQueryObjects = { ...queryObject, id };
		setQueryObjects((prev) => {
			setSelectedQueryId(id);
			return [...prev, newQueryObjects];
		});
	};

	const addQueries = (queryObjectsToAdd: QueryObject[]) => {
		const newOnes = queryObjectsToAdd.map((obj) => ({
			...obj,
			id: nanoid(7),
		}));
		setQueryObjects((prev) => {
			if (newOnes.length > 0) {
				setSelectedQueryId(newOnes[newOnes.length - 1].id);
			}
			return [...prev, ...newOnes];
		});
	};

	const removeQuery = (queryObject: QueryObject) => {
		setQueryObjects((prev) => {
			const updated = prev.filter((q) => q.id !== queryObject.id);
			if (selectedQueryId === queryObject.id) {
				setSelectedQueryId(updated.length > 0 ? (updated[0].id ?? null) : null);
			}
			return updated;
		});
	};

	const updateQueryTitle = (queryObject: QueryObject, newTitle: string) => {
		setQueryObjects((prev) =>
			prev.map((q) => {
				if (q.id === queryObject.id) {
					return { ...q, queryTitle: newTitle, isCustom: true };
				}
				return q;
			})
		);
	};

	const updateQuery = (queryObject: QueryObject, newQuery: string) => {
		setQueryObjects((prev) =>
			prev.map((q) => {
				if (q.id === queryObject.id) {
					return { ...q, sqlQuery: newQuery };
				}
				return q;
			})
		);
	};

	const deleteAll = () => {
		setQueryObjects([]);
		setSelectedQueryId(null);
	};

	return {
		queryObjects,
		selectedQueryId,
		setSelectedQueryId,
		addQuery,
		addQueries,
		removeQuery,
		updateQueryTitle,
		updateQuery,
		deleteAll,
	};
}
