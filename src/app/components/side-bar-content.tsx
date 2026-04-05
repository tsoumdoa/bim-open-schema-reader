import { DisplayTableInfo } from "./display-table-info";
import ListDataByCategories from "./list-data-by-categories";
import ListQueriesInSidebar from "./list-queries-in-sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SideBarContent(props: { deleteAll: () => void; objLength: number }) {
	return (
		<div>
			<div className="text-sm font-bold text-gray-900">
				BIM Open Schema Reader
			</div>
			<Tabs defaultValue="queries" className="w-full">
				<TabsList variant="line" className="w-full justify-center ">
					<TabsTrigger value="queries" className="">
						Queries
					</TabsTrigger>
					<TabsTrigger value="file-info" className="tracking-tight">
						Model Info
					</TabsTrigger>
					<TabsTrigger value="schema" className="tracking-tight">
						Table Stats
					</TabsTrigger>
				</TabsList>
				<TabsContent value="schema">
					<DisplayTableInfo />
				</TabsContent>
				<TabsContent value="file-info">
					<ListDataByCategories />
				</TabsContent>
				<TabsContent value="queries">
					<ListQueriesInSidebar
						deleteAll={props.deleteAll}
						objLength={props.objLength}
					/>
				</TabsContent>
			</Tabs>
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
