import { useRef, useState } from "react";
import { runFormat } from "../utils/shared";
import {
	QueryDisplayState,
	QueryEditorState,
	QueryState,
	QueryTitleState,
} from "../utils/types";
export default function useQueryViewerAndEditor(title: string, query: string) {
	const handleCancelQueryRef = useRef<{ cancelQuery: () => void }>(null);
	const formatedQuery = runFormat(query);
	const [sqlQuery, setSqlQuery] = useState<string>(formatedQuery); //default query
	const [draftSql, setDraftSql] = useState<string>(formatedQuery); //for edit
	const [newSqlQuery, setNewSqlQuery] = useState<string>(formatedQuery); //to rerun query

	const [queryDisplayState, setQueryDisplayState] = useState<QueryDisplayState>(
		title === "New Custom Query" ? "editor" : "hidden"
	);
	const [queryState, setQueryState] = useState<QueryState>("original");
	const [queryEditorState, setQueryEditorState] =
		useState<QueryEditorState>("initial");
	const [queryTitleState, setQueryTitleState] =
		useState<QueryTitleState>("original");
	{
		return {
			handleCancelQueryRef,
			formatedQuery,
			sqlQuery,
			draftSql,
			newSqlQuery,
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
			setQueryTitleState,
		};
	}
}
