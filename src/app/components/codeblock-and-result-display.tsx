import { Activity } from "react";
import { QueryDisplayState, QueryObject, UseQueryViewerAndEditor } from "../utils/types";
import SqlQueryCodeBlock from "./sql-code-block";
import QueryResultDisplayTable from "./query-result-display";

export default function CodeBlockAndResultDisplay(props: {
	index: number;
	queryObject: QueryObject;
	fileDownloadName: string;
	queryDisplayState: QueryDisplayState;
	handleQueryResults: (headers: string[], rows: unknown[][]) => void;
	useQueryViewerAndEditorHook: UseQueryViewerAndEditor;
}) {
	return (
		<div className="py-1">
			<Activity
				mode={props.queryDisplayState === "hidden" ? "hidden" : "visible"}
			>
				<SqlQueryCodeBlock
					queryObject={props.queryObject}
					useQueryViewerAndEditorHook={props.useQueryViewerAndEditorHook}
				/>
			</Activity>
			<QueryResultDisplayTable
				index={props.index}
				fileDownloadName={props.fileDownloadName}
				useQueryViewerAndEditorHook={props.useQueryViewerAndEditorHook}
				onResultsAvailable={props.handleQueryResults}
			/>
		</div>
	);
}
