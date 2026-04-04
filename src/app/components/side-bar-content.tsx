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
function SideBarContent(props: { deleteAll: () => void; objLength: number }) {
	return (
		<div className="space-y-1">
			<div className="text-sm font-bold text-gray-900">
				BIM Open Schema Reader
			</div>
			<AccordionDisplay accordionTitle="Schema Tables">
				<DisplayTableInfo />
			</AccordionDisplay>
			<AccordionDisplay accordionTitle="Add Query by Category">
				<ListDataByCategories />
			</AccordionDisplay>
			<AccordionDisplay accordionTitle="Query">
				<ListQueriesInSidebar
					deleteAll={props.deleteAll}
					objLength={props.objLength}
				/>
			</AccordionDisplay>
		</div>
	);
}

export default function SideBar(props: {
	deleteAll: () => void;
	objLength: number;
}) {
	return (
		<Sidebar className="h-full">
			<div className="overflow-auto p-2">
				<SideBarContent
					deleteAll={props.deleteAll}
					objLength={props.objLength}
				/>
			</div>
		</Sidebar>
	);
}
