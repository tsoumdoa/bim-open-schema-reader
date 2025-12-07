"use client";

import AnalyticalDisplay from "./components/display-analytical";
import InitialDisplay from "./components/display-initial";
import Header from "./components/header";
import { useHandleProcess } from "./hooks/use-handle-process";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function UnzipFailedAlertDialog(props: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	return (
		<AlertDialog open={props.open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Failed to unzip file</AlertDialogTitle>
					<AlertDialogDescription>
						Zip file is corrupted or invalid. Please try again.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={() => {
							props.setOpen(false);
						}}
					>
						Close
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function Home() {
	const {
		handleProcess,
		isProcessing,
		dbReady,
		open,
		setOpen,
		parquetData,
		files,
		setFiles,
	} = useHandleProcess();
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<div className="bg-background min-h-screen">
				<Header />
				<UnzipFailedAlertDialog open={open} setOpen={setOpen} />
				<main>
					{dbReady ? (
						<AnalyticalDisplay
							parquetFileEntries={parquetData.current}
							fileName={(files && files[0].name) || ""}
						/>
					) : (
						<InitialDisplay
							setFiles={setFiles}
							files={files}
							handleProcess={handleProcess}
							isProcessing={isProcessing}
						/>
					)}
				</main>
			</div>
		</QueryClientProvider>
	);
}
