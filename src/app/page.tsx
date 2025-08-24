"use client";

import Header from "./components/header";
import InitialDisplay from "./components/initial-display";
import { useRef, useState } from "react";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { validateEntries } from "./utils/validateFiles";
import AnalyticalDisplay from "./components/analytical-display";
import { ParquetBlob } from "./utils/types";

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
  const [files, setFiles] = useState<File[] | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [open, setOpen] = useState(false);
  const parquetData = useRef<ParquetBlob[]>([]);

  const handleProcess = async () => {
    setIsProcessing(true);
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const reader = new ZipReader(new BlobReader(file));
      const entries = await reader.getEntries();
      const fileNames = entries.map((entry) => entry.filename);
      const isValid = validateEntries(fileNames);
      if (!isValid) setOpen(true);

      for (const entry of entries) {
        if (!entry.directory) {
          const blob = await entry.getData(new BlobWriter());
          parquetData.current.push({ filename: entry.filename, parquet: blob });
        }
      }
      await reader.close();
    } catch (err) {
      setOpen(true);
      console.error(err);
    }

    setIsProcessing(false);
    setDbReady(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <UnzipFailedAlertDialog open={open} setOpen={setOpen} />
      <main className="container mx-auto px-4 py-8">
        {dbReady ? (
          <AnalyticalDisplay parquetFileEntries={parquetData.current} />
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
