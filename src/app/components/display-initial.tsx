import useSampleFile from "../hooks/use-sample-file";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useQuery } from "@tanstack/react-query";
import { Shield, Zap, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function FeatureGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-3" id="features">
      <div className="bg-background ring-ring/20 rounded-md p-6 shadow-sm ring">
        <div className="flex items-center space-x-3 pb-4">
          <Zap className="h-8 w-8" />
          <h3 className="text-xl font-black tracking-tight uppercase">
            ULTRA-FAST QUERIES
          </h3>
        </div>
        <p className="leading-relaxed font-medium">
          Powered by DuckDB-Wasm, run lightning-fast SQL queries on{" "}
          <Link
            href="https://github.com/ara3d/bim-open-schema"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            BIM Open Schema
          </Link>{" "}
          data exported from Revit — all directly in your browser.
        </p>
      </div>

      <div className="bg-background ring-ring/20 rounded-md p-6 shadow-sm ring">
        <div className="flex items-center space-x-3 pb-4">
          <Shield className="h-8 w-8" />
          <h3 className="text-xl font-black tracking-tight uppercase">
            100% PRIVATE
          </h3>
        </div>
        <p className="leading-relaxed font-medium">
          No servers, no uploads, no cloud. Everything runs locally in your
          browser, keeping your BIM data fully private and secure.
        </p>
      </div>

      <div className="bg-background ring-ring/20 rounded-md p-6 shadow-sm ring">
        <div className="mb-4 flex items-center space-x-3">
          <Eye className="h-8 w-8" />
          <h3 className="text-xl font-black tracking-tight uppercase">
            FLEXIBLE ANALYSIS
          </h3>
        </div>
        <p className="leading-relaxed font-medium">
          Write and customize any SQL queries you want. Explore, filter, and
          analyze your model data with interactive tables, charts, and
          visualizations.
        </p>
      </div>
    </div>
  );
}

function FeatureWhole() {
  return (
    <div className="bg-background ring-ring/20 rounded-md p-8 shadow-sm ring">
      <div className="flex items-start space-x-4">
        <Lock className="h-8 w-8 flex-shrink-0 pt-1" />
        <div>
          <h3 className="pb-2 text-2xl font-black tracking-tight uppercase">
            100% LOCAL PROCESSING
          </h3>
          <p className="text-lg leading-relaxed font-medium">
            Your BIM data <strong>NEVER LEAVES YOUR COMPUTER.</strong> All
            querying and analysis happens entirely in your browser, ensuring
            complete data privacy and security.
          </p>
        </div>
      </div>
    </div>
  );
}

function InvalidFileAlertDialog(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invalid file selected</AlertDialogTitle>
          <AlertDialogDescription>
            Please select a valid BIM file (.parquete.zip) to continue.
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

export default function InitialDisplay(props: {
  setFiles: (files: File[] | undefined) => void;
  files: File[] | undefined;
  handleProcess: () => void;
  isProcessing: boolean;
}) {
  const [invalidFileSelected, setInvalidFileSelected] = useState(false);

  const handleDrop = async (files: File[]) => {
    props.setFiles(files);
  };
  const { refetch } = useSampleFile(props.setFiles);

  const handleStartWithSample = () => {
    // TODO: think about how to handle err better for user
    refetch();
  };

  return (
    <div className="mx-auto h-full w-full max-w-4xl pb-4">
      <InvalidFileAlertDialog
        open={invalidFileSelected}
        setOpen={setInvalidFileSelected}
      />
      <div className="space-y-4 pt-4 pb-4 text-center">
        <h2 className="tracking text-6xl leading-none font-black tracking-tighter">
          Query BIM data
        </h2>
        <p className="mx-auto max-w-2xl text-xl leading-tight font-medium">
          Upload your BIM data files and explore them with our powerful,
          privacy-first visualization tool.
        </p>
        <Button onClick={handleStartWithSample}>
          Try with a sample BIM file
        </Button>
      </div>

      <div className="flex flex-col gap-y-8 px-8">
        <div className="relative">
          <Dropzone
            maxFiles={1}
            onDrop={handleDrop}
            onError={() => setInvalidFileSelected(true)}
            src={props.files}
            className=""
            accept={{
              "application/zip": [".zip"],
            }}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>

          {props.files && props.files.length > 0 && (
            <div className="absolute right-2 bottom-2">
              <Button
                onClick={props.handleProcess}
                disabled={props.isProcessing}
                className="w-full md:w-auto"
                variant="secondary"
                size="sm"
              >
                {props.isProcessing ? "Processing..." : "Process"}
              </Button>
            </div>
          )}
        </div>

        <FeatureWhole />
        <FeatureGrid />
      </div>
    </div>
  );
}
