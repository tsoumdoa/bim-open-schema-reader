import { QueryDisplayState, QueryEditorState } from "./types";

export const getEditorState = (
	queryDisplayState: QueryDisplayState,
	queryEditorState: QueryEditorState
) => {
	const isEditing = queryDisplayState === "editor";
	const isRunning = queryEditorState === "running";
	const isStale = queryEditorState === "stale";
	const hasRerunSuccess = queryEditorState === "rerun";

	const displayStale = queryEditorState === "stale";
	const displayError = queryEditorState === "error";
	const displayCanceled = queryEditorState === "canceled";
	const displayRunButton = isStale || displayError;
	const displayCancelButton = isRunning || isEditing;
	const disableEditButton =
		(queryEditorState === "error" && isEditing) || isRunning || isStale;
	return {
		isEditing,
		isRunning,
		isStale,
		hasRerunSuccess,
		displayStale,
		displayError,
		displayCanceled,
		displayRunButton,
		displayCancelButton,
		disableEditButton,
	};
};
