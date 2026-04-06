import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import {
	QueryDisplayState,
	QueryObject,
	UseQueryViewerAndEditor,
} from "../utils/types";
import QueryResultDisplayTable from "./query-result-display";
import SqlQueryCodeBlock from "./sql-code-block";
import { useDuckDb } from "./use-db";
import { Activity } from "react";

export default function CodeBlockAndResultDisplay(props: {
	index: number;
	queryObject: QueryObject;
	fileDownloadName: string;
	queryDisplayState: QueryDisplayState;
	handleQueryResults: (headers: string[], rows: unknown[][]) => void;
	useQueryViewerAndEditorHook: UseQueryViewerAndEditor;
}) {
	const { formatedQuery } = props.useQueryViewerAndEditorHook;
	const { conn } = useDuckDb();
	const runDuckDbQuery = useRunDuckDbQuery(conn, formatedQuery);
	return (
		<div className="py-1">
			<Activity
				mode={props.queryDisplayState === "hidden" ? "hidden" : "visible"}
			>
				<SqlQueryCodeBlock
					runDuckDbQuery={runDuckDbQuery}
					queryObject={props.queryObject}
					useQueryViewerAndEditorHook={props.useQueryViewerAndEditorHook}
				/>
			</Activity>
			<QueryResultDisplayTable
				runDuckDbQuery={runDuckDbQuery}
				index={props.index}
				fileDownloadName={props.fileDownloadName}
				useQueryViewerAndEditorHook={props.useQueryViewerAndEditorHook}
				onResultsAvailable={props.handleQueryResults}
			/>
		</div>
	);
}
