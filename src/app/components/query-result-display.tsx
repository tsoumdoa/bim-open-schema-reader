import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import * as duckdb from "@duckdb/duckdb-wasm";
import { DataTable } from "./data-table";
import { formatData } from "../utils/format";
import { useEffect, useRef } from "react";

export default function QueryResultDisplayTable(props: {
	c: duckdb.AsyncDuckDBConnection;
	query: string;
	newQuery: string;
	index: number;
	displayExpanded: number;
	setDisplayExpanded: (b: number) => void;
	lockScroll: boolean;
	setHandleCancelQuery: (b: boolean) => void;
	handleCancelQuery: boolean;
	fileDownloadName: string;
	setIsRerunning: (b: boolean) => void;
	setIsRerunSuccess: (b: boolean) => void;
	setIsStale: (b: boolean) => void;
	setRerunError: (b: boolean) => void;
}) {
	const {
		headers,
		rows,
		isLoading,
		isSuccess,
		queryTime,
		error,
		getTableDataAsCsv,
		getTableDataAsTsv,
		getTableDataAsJson,
		run,
		cancelQuery,
	} = useRunDuckDbQuery(props.c, props.query);

	useEffect(() => {
		if (props.handleCancelQuery) {
			props.setIsRerunning(false);
			props.setIsRerunSuccess(false);
			props.setRerunError(false);
			props.setHandleCancelQuery(false);
			cancelQuery();
		}
	}, [props.handleCancelQuery]);

	const rerunTrigeredRef = useRef(false);

	useEffect(() => {
		if (!isLoading && isSuccess) {
			props.setRerunError(false);
			props.setIsRerunning(false);
			props.setIsStale(false);
			if (rerunTrigeredRef.current) {
				props.setIsRerunSuccess(true);
				rerunTrigeredRef.current = false;
			} else {
				props.setIsRerunSuccess(false);
			}
		}
		if (error) {
			props.setIsRerunSuccess(false);
			props.setIsRerunning(false);
			props.setRerunError(true);
		}
	}, [isLoading, error, isSuccess]);

	useEffect(() => {
		props.setIsRerunSuccess(false);
		if (props.newQuery !== props.query) {
			rerunTrigeredRef.current = true;
		}
		props.setIsRerunning(true);
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
		const columnDef = headers.map((header, i) => {
			return {
				accessorFn: (row: (string | number)[]) => row[i],
				header: header,
				cell: (info: any) => {
					return formatData(info.getValue());
				},
			};
		});

		return (
			<div
				className={`flex h-full max-w-[90rem] flex-col gap-y-2 ${props.lockScroll ? "overflow-hidden" : "overflow-auto"}`}
			>
				<DataTable
					columns={columnDef}
					data={rows}
					queryTime={queryTime}
					rowLength={rows.length}
					index={props.index}
					displayExpanded={props.displayExpanded}
					setDisplayExpanded={props.setDisplayExpanded}
					getTableDataAsCsv={getTableDataAsCsv}
					getTableDataAsTsv={getTableDataAsTsv}
					getTableDataAsJson={getTableDataAsJson}
					fileDownloadName={props.fileDownloadName}
				/>
			</div>
		);
	} else {
		return <div className="text-xs text-neutral-500">No results found.</div>;
	}
}
