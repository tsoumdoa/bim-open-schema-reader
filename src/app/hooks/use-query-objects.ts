import { QueryObject, QueryObjects } from "../utils/types";
import { useState } from "react";
import { nanoid } from "nanoid";

export function useQueryObjects() {
	const [queryObjects, setQueryObjects] = useState<QueryObjects>([]);
	const addQuery = (queryObject: QueryObject) => {
		const id = nanoid(7);
		const newQueryObjects = { ...queryObject, id };
		setQueryObjects([...queryObjects, newQueryObjects]);
	};
	const removeQuery = (queryObject: QueryObject) => {
		setQueryObjects(queryObjects.filter((q) => q.id !== queryObject.id));
	};

	return {
		queryObjects,
		addQuery,
		removeQuery,
	};
}
