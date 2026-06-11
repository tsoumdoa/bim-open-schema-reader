import { getTemplateQueryGroups } from "../utils/queries-selector-list";
import { BosFileType, QueryObject, QueryObjects } from "../utils/types";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";

export function useQueryObjects(bosFileType: BosFileType) {
	const templateQueryGroups = useRef(
		getTemplateQueryGroups(bosFileType)
	).current;
	const [queryObjects, setQueryObjects] = useState<QueryObjects>([]);
	const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
	const [isTemplatePickerActive, setIsTemplatePickerActive] = useState(true);

	const endTemplatePicker = () => {
		setIsTemplatePickerActive(false);
	};

	const addQuery = (queryObject: QueryObject) => {
		const id = nanoid(7);
		const newQueryObjects = { ...queryObject, id };
		endTemplatePicker();
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
		endTemplatePicker();
		setQueryObjects((prev) => {
			if (newOnes.length > 0) {
				setSelectedQueryId(newOnes[newOnes.length - 1].id);
			}
			return [...prev, ...newOnes];
		});
	};

	const selectTemplateQuery = (template: QueryObject) => {
		addQuery(template);
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
		templateQueryGroups,
		isTemplatePickerActive,
		addQuery,
		addQueries,
		selectTemplateQuery,
		removeQuery,
		updateQueryTitle,
		updateQuery,
		deleteAll,
	};
}
