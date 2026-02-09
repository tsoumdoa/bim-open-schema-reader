import { UseExpandDisplay } from "../utils/types";
import { DisplayTableInfo } from "./display-table-info";
import ListDataByCategories from "./list-data-by-categories";
import ListQueriesInSidebar from "./list-queries-in-sidebar";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Sidebar } from "@/components/ui/sidebar";

function AccordionDisplay(props: {
	children: React.ReactNode;
	accordionTitle: string;
}) {
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger className="py-0">
					{props.accordionTitle}
				</AccordionTrigger>
				<AccordionContent className="pb-1">{props.children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
function SideBarContent(props: { useExpandDisplay: UseExpandDisplay }) {
	return (
		<div className="space-y-1">
			<div className="text-sm font-bold text-gray-900">
				Open BIM Schema Reader
			</div>
			<AccordionDisplay accordionTitle="Schema Tables">
				<DisplayTableInfo />
			</AccordionDisplay>
			<AccordionDisplay accordionTitle="Add Query by Category">
				<ListDataByCategories useExpandDisplay={props.useExpandDisplay} />
			</AccordionDisplay>
			<AccordionDisplay accordionTitle="Query">
				<ListQueriesInSidebar useExpandDisplay={props.useExpandDisplay} />
			</AccordionDisplay>
		</div>
	);
}

export default function SideBar(props: { useExpandDisplay: UseExpandDisplay }) {
	return (
		<Sidebar className="h-full">
			<div className="overflow-auto p-2">
				<SideBarContent useExpandDisplay={props.useExpandDisplay} />
			</div>
		</Sidebar>
	);
}
