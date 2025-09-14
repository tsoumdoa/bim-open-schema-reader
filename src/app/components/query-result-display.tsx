import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { DataTable } from "./data-table";
import { RefObject, useEffect, useRef } from "react";
import { useDuckDb } from "./use-db";
import { QueryEditorState, QueryState } from "../utils/types";

export default function QueryResultDisplayTable(props: {
	query: string;
	newQuery: string;
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	lockScroll: boolean;
	fileDownloadName: string;
	handleCancelQueryRef: RefObject<{ cancelQuery: () => void } | null>;
	queryEditorState: QueryEditorState;
	setQueryEditorState: (b: QueryEditorState) => void;
	queryState: QueryState;
	setQueryState: (b: QueryState) => void;
}) {
	const { conn } = useDuckDb();
	const runDuckDbQuery = useRunDuckDbQuery(conn, props.query);
	const { cancelQuery, isLoading, isSuccess, error, run, rows } =
		runDuckDbQuery;
	props.handleCancelQueryRef.current = { cancelQuery };

	const rerunTrigeredRef = useRef(false);

	useEffect(() => {
		if (rerunTrigeredRef.current) {
			if (isSuccess) {
				props.setQueryEditorState("rerun");
			} else {
				props.setQueryEditorState("error");
			}
		}
	}, [isSuccess, error]);

	useEffect(() => {
		if (props.newQuery !== props.query) {
			rerunTrigeredRef.current = true;
		}
		run(props.newQuery);
	}, [props.newQuery]);

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
				className={`flex h-full max-w-[90rem] flex-col gap-y-2 ${props.lockScroll ? "overflow-hidden" : "overflow-auto"}`}
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
