import { getEditorState } from "../utils/editor-display-state";
import { highlightAndFormatSql, runFormat } from "../utils/shared";
import { QueryObject, UseQueryViewerAndEditor } from "../utils/types";
import { JSX, useCallback, useLayoutEffect, useState } from "react";

export default function useEditor(
	queryObject: QueryObject,
	useQueryViewerAndEditorHook: UseQueryViewerAndEditor,
	updateQueryTitle: (queryObject: QueryObject, newTitle: string) => void,
	updateQuery: (queryObject: QueryObject, newSql: string) => void
) {
	const {
		handleCancelQueryRef,
		sqlQuery,
		draftSql,
		queryDisplayState,
		queryState,
		queryEditorState,
		setSqlQuery,
		setDraftSql,
		setNewSqlQuery,
		setQueryDisplayState,
		setQueryState,
		setQueryEditorState,
		queryTitleState,
		newSqlQuery,
	} = useQueryViewerAndEditorHook;

	const [copied, setCopied] = useState(false);
	const [nodes, setNodes] = useState<JSX.Element>();
	const [lineLength, setLineLength] = useState(0);

	const onChange = useCallback(
		(val: string) => {
			setQueryEditorState("stale");
			setQueryState("edited");
			setDraftSql(val);

			if (sqlQuery === val) {
				setQueryState("original");
			} else {
				setQueryState("edited");
			}

			setLineLength(val.split("\n").length);
		},
		[sqlQuery, setDraftSql, setQueryEditorState, setQueryState]
	);

	useLayoutEffect(() => {
		highlightAndFormatSql(newSqlQuery, false).then(({ jsx, lineLength }) => {
			setNodes(jsx);
			setLineLength(lineLength);
		});
	}, [newSqlQuery]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(newSqlQuery);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleCancelDraftMode = () => {
		setDraftSql(sqlQuery);
		setQueryDisplayState("viewer");
		setQueryEditorState("initial");
	};

	const handleSave = () => {
		if (draftSql !== sqlQuery) {
			const formatedQuery = runFormat(draftSql);
			setQueryState("edited");
			setSqlQuery(formatedQuery);
			setNewSqlQuery(formatedQuery);
			updateQuery(queryObject, formatedQuery);
		} else {
			const formatedQuery = runFormat(sqlQuery);
			setNewSqlQuery(formatedQuery);
		}
		//NOTE: add * if the query is edited but the title is not edited
		const lastChar = queryObject.queryTitle.slice(-1);
		if (
			queryTitleState === "original" &&
			queryState === "edited" &&
			lastChar !== "*"
		) {
			updateQueryTitle(queryObject, queryObject.queryTitle + "*");
		} else {
			updateQueryTitle(queryObject, queryObject.queryTitle);
		}
		setQueryDisplayState("viewer");
		setQueryEditorState("initial");
	};

	const handleSetToDraftMode = () => {
		setDraftSql(sqlQuery);
		setQueryDisplayState("editor");
	};

	const handleRunButtonClick = () => {
		setNewSqlQuery(draftSql);
	};

	const handleCancelQuery = () => {
		handleCancelQueryRef.current?.cancelQuery();
		if (queryEditorState !== "error") {
			setQueryEditorState("stale");
		}
	};
	const editorDisplayState = getEditorState(
		queryDisplayState,
		queryEditorState
	);

	return {
		displayState: editorDisplayState,
		handleCopy,
		handleCancelDraftMode,
		handleSave,
		handleSetToDraftMode,
		handleRunButtonClick,
		handleCancelQuery,
		copied,
		nodes,
		lineLength,
		onChange,
		draftSql,
		setDraftSql,
	};
}
