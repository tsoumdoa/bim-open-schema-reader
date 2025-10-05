import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { DataTable } from "./data-table";
import { useEffect, useRef } from "react";
import { useDuckDb } from "./use-db";
import { UseQueryViewerAndEditor } from "../utils/types";

export default function QueryResultDisplayTable(props: {
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	lockScroll: boolean;
	fileDownloadName: string;
	useQueryViewerAndEditorHook: UseQueryViewerAndEditor;
}) {
	const {
		handleCancelQueryRef,
		setQueryEditorState,
		newSqlQuery,
		formatedQuery,
	} = props.useQueryViewerAndEditorHook;
	const { conn } = useDuckDb();
	const runDuckDbQuery = useRunDuckDbQuery(conn, formatedQuery);
	const { cancelQuery, isLoading, isSuccess, error, run, rows } =
		runDuckDbQuery;
	handleCancelQueryRef.current = { cancelQuery };

	const rerunTrigeredRef = useRef(false);

	useEffect(() => {
		if (rerunTrigeredRef.current) {
			if (isSuccess) {
				setQueryEditorState("rerun");
			} else {
				setQueryEditorState("error");
			}
		}
	}, [isSuccess, error]);

	useEffect(() => {
		if (newSqlQuery !== formatedQuery) {
			rerunTrigeredRef.current = true;
		}
		run(newSqlQuery);
	}, [newSqlQuery]);

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
			<div
				className={`flex h-full flex-col gap-y-2 ${props.lockScroll ? "overflow-hidden" : "overflow-auto"} max-w-[120rem]`}
			>
				<DataTable
					index={props.index}
					displayExpanded={props.displayExpanded}
					setDisplayExpanded={props.setDisplayExpanded}
					fileDownloadName={props.fileDownloadName}
					runDuckDbQuery={runDuckDbQuery}
				/>
			</div>
		);
	} else {
		return <div className="text-xs text-neutral-500">No results found.</div>;
	}
}
