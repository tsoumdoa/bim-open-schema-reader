import { useRunDuckDbQuery } from "../hooks/use-run-duckdb-query";
import { formatData } from "../utils/format";
import {
	listAllTableInfoWithColumnInfo,
	summarizeTableInfor,
} from "../utils/queries";
import {
	// denormGeoTableNames,
	denormTableNames,
	GeoTableNames,
	NonGeoTableNames,
} from "../utils/types";
import { useDuckDb } from "./use-db";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import React from "react";

function TableSummary(props: { name: string }) {
	const { conn } = useDuckDb();
	const { rows, isSuccess, isLoading } = useRunDuckDbQuery(
		conn,
		summarizeTableInfor(props.name)
	);
	if (!isSuccess) {
		return <div>Loading...</div>;
	}
	const numberOfRows = formatData(Number(rows[0][0]));
	return (
		<div className="text-xs leading-tight font-bold pt-0.5">
			{props.name}{" "}
			<span className="text-neutral-600 font-light">
				{isLoading ? "loading..." : `(${numberOfRows})`}
			</span>
		</div>
	);
}

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

function AccordionDisplay(props: {
	children: React.ReactNode;
	accordionTitle: string;
}) {
	return (
		<Accordion type="multiple">
			<AccordionItem value="item-1 ">
				<AccordionTrigger className=" [&>svg]:stroke-1 py-0 text-xs   pl-1 font-semibold text-neutral-800 ">
					{props.accordionTitle}
				</AccordionTrigger>
				<AccordionContent className="pl-2 pb-0">
					{props.children}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

function RowDisplay(props: { rows: (string | number)[][] }) {
	return props.rows.map((row, i) => (
		<React.Fragment key={`table-row-${i} `}>
			<TableSummary name={row[0] as string} />
			<div className="text-xs pl-2">{mergeNameAndType(row[1], row[2])}</div>
			<Separator className="mt-2 mb-1.5" />
		</React.Fragment>
	));
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

	const names = rows.map((row) => row[0]) as string[];

	const enumRows = rows.filter((_, index) => names[index].includes("Enum_"));

	const denormalizedNonGeoRows = rows.filter((_, index) =>
		denormTableNames.includes(names[index])
	);
	// const denormalizedGeoRows = rows.filter((_, index) =>
	// 	denormGeoTableNames.includes(names[index])
	// );
	const geoTableRows = rows.filter((_, index) =>
		GeoTableNames.includes(names[index])
	);
	const nonGeoRows = rows.filter((_, index) =>
		NonGeoTableNames.includes(names[index])
	);

	return (
		<div className="pt-1">
			<AccordionDisplay accordionTitle="Geometrical">
				<RowDisplay rows={geoTableRows} />
			</AccordionDisplay>
			<Separator className="my-2 bg-neutral-500" />
			<AccordionDisplay accordionTitle="Non-Geometrical">
				<RowDisplay rows={nonGeoRows} />
			</AccordionDisplay>
			<Separator className="my-2 bg-neutral-500" />
			<AccordionDisplay accordionTitle="Non-Geometrical - denormalized">
				<RowDisplay rows={denormalizedNonGeoRows} />
			</AccordionDisplay>
			<Separator className="my-2 bg-neutral-500" />
			{/*			
			<AccordionDisplay accordionTitle="Geometrical - denormalized">
				<RowDisplay rows={denormalizedGeoRows} />
			</AccordionDisplay> 
			<Separator className="my-2 bg-neutral-500" />
		  */}
			<AccordionDisplay accordionTitle="Enum">
				<RowDisplay rows={enumRows} />
			</AccordionDisplay>
			<Separator className="mt-2 mb-1.0 bg-neutral-500" />
		</div>
	);
}
