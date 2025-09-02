"use client";

import Header from "./components/header";
import InitialDisplay from "./components/display-initial";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AnalyticalDisplay from "./components/display-analytical";
import { useHandleProcess } from "./hooks/use-handle-process";

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

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <UnzipFailedAlertDialog open={open} setOpen={setOpen} />
      <main className="px-4 py-2">
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
  );
}
