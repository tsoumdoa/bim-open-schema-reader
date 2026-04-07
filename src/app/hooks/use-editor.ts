import { getEditorState } from "../utils/editor-display-state";
import { highlightAndFormatSql, runFormat } from "../utils/shared";
import {
	QueryObject,
	UseQueryViewerAndEditor,
	UseRunDuckDbQuery,
} from "../utils/types";
import { JSX, useCallback, useLayoutEffect, useState } from "react";

export default function useEditor(
	runDuckDbQuery: UseRunDuckDbQuery,
	queryObject: QueryObject,
	useQueryViewerAndEditorHook: UseQueryViewerAndEditor,
	updateQueryTitle: (queryObject: QueryObject, newTitle: string) => void,
	updateQuery: (queryObject: QueryObject, newSql: string) => void
) {
	const {
		handleCancelQueryRef,
		draftSql,
		queryDisplayState,
		queryState,
		queryEditorState,
		setDraftSql,
		setQueryDisplayState,
		setQueryState,
		setQueryEditorState,
		queryTitleState,
	} = useQueryViewerAndEditorHook;

	const [copied, setCopied] = useState(false);
	const [nodes, setNodes] = useState<JSX.Element>();
	const [lineLength, setLineLength] = useState(0);
	const { run, isSuccess } = runDuckDbQuery;

	const onChange = useCallback(
		(val: string) => {
			setQueryEditorState("stale");
			setQueryState("edited");
			setDraftSql(val);

			if (draftSql === val) {
				setQueryState("original");
			} else {
				setQueryState("edited");
			}

			setLineLength(val.split("\n").length);
		},
		[setDraftSql, setQueryEditorState, setQueryState]
	);

	useLayoutEffect(() => {
		highlightAndFormatSql(draftSql, false).then(({ jsx, lineLength }) => {
			setNodes(jsx);
			setLineLength(lineLength);
		});
	}, [draftSql]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(draftSql);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleCancelDraftMode = () => {
		setQueryDisplayState("viewer");
		setQueryEditorState("initial");
	};

	const handleSave = () => {
		updateQuery(queryObject, runFormat(draftSql));
		setQueryState("edited");

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
		setDraftSql(queryObject.sqlQuery);
		setQueryDisplayState("editor");
	};

	const handleRun = async () => {
		setDraftSql(runFormat(draftSql));
		await run(draftSql);

		if (isSuccess) {
			setQueryEditorState("rerun");
		} else {
			setQueryEditorState("error");
		}
	};

	const handleCancelQuery = () => {
		handleCancelQueryRef.current?.cancelQuery();
		setDraftSql(queryObject.sqlQuery);
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
		handleRun,
		handleCancelQuery,
		copied,
		nodes,
		lineLength,
		onChange,
		draftSql,
		setDraftSql,
	};
}
