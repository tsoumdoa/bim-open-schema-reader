import React from "react";
import { Separator } from "@/components/ui/separator";
import { listAllTableInfoWithColumnInfo } from "../utils/queries";
import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { useDuckDb } from "./use-db";

function mergeNameAndType(names: string | number, types: string | number) {
	//bad bad bad but i know what i'm doing
	//@ts-ignore
	const nameArray = names.toArray() as string[];
	//@ts-ignore
	const typeArray = types.toArray() as string[];

	const merged = new Map<string | number, string | number>();
	nameArray.forEach((name, i) => {
		if (!merged.has(name)) {
			merged.set(name, typeArray[i]);
		}
	});

	return (
		<ul>
			{Array.from(merged.entries()).map(([name, type], i) => (
				<li key={`${name}-${i}`}>
					{name}{" "}
					<span className="text-xs font-light text-neutral-600">
						{`<${String(type).toLowerCase()}>`}
					</span>
				</li>
			))}
		</ul>
	);
}

export function DisplayTableInfo() {
	const { conn } = useDuckDb();
	const { rows, isSuccess } = useRunDuckDbQuery(
		conn,
		listAllTableInfoWithColumnInfo
	);
	if (!isSuccess) {
		return <div>Loading...</div>;
	}
	return (
		<div>
			{rows.map((row, i) => (
				<React.Fragment key={`table-row-${i}`}>
					<div className="text-xs leading-tight font-bold">{row[0]}</div>
					<div className="text-xs">{mergeNameAndType(row[1], row[2])}</div>
					<Separator className="my-2" />
				</React.Fragment>
			))}
		</div>
	);
}
