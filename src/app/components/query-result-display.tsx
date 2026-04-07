import { UseQueryViewerAndEditor, UseRunDuckDbQuery } from "../utils/types";
import { DataTable } from "./data-table";
import { useEffect } from "react";

export default function QueryResultDisplayTable(props: {
	runDuckDbQuery: UseRunDuckDbQuery;
	index: number;
	fileDownloadName: string;
	useQueryViewerAndEditorHook: UseQueryViewerAndEditor;
	onResultsAvailable?: (headers: string[], rows: unknown[][]) => void;
}) {
	const { handleCancelQueryRef } = props.useQueryViewerAndEditorHook;
	const { cancelQuery, isLoading, isSuccess, error, rows, headers } =
		props.runDuckDbQuery;
	handleCancelQueryRef.current = { cancelQuery };

	// this is for geometry data
	useEffect(() => {
		if (props.onResultsAvailable && isSuccess && rows.length > 0) {
			props.onResultsAvailable(headers, rows);
		}
	}, [isSuccess, rows, headers, props.onResultsAvailable]);

	if (error) {
		return (
			<div className="text-sm font-semibold text-red-500">{error.message}</div>
		);
	}
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isSuccess && rows.length > 0) {
		return (
			<div className="flex h-full flex-col gap-y-2 overflow-auto ">
				<DataTable
					index={props.index}
					fileDownloadName={props.fileDownloadName}
					runDuckDbQuery={props.runDuckDbQuery}
				/>
			</div>
		);
	} else {
		return <div className="text-xs text-neutral-500">No results found.</div>;
	}
}
