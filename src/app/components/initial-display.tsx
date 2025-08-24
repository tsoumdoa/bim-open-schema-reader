import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Shield, Zap, Eye, Lock } from "lucide-react";

function FeatureGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-3" id="features">
      <div className="bg-background ring-ring/20 rounded-md p-6 shadow-sm ring">
        <div className="flex items-center space-x-3 pb-4">
          <Zap className="h-8 w-8" />
          <h3 className="text-xl font-black tracking-tight uppercase">
            FAST PROCESSING
          </h3>
        </div>
        <p className="leading-relaxed font-medium">
          Optimized algorithms for quick parsing and visualization of large BIM
          datasets directly in your browser.
        </p>
      </div>

      <div className="bg-background ring-ring/20 rounded-md p-6 shadow-sm ring">
        <div className="flex items-center space-x-3 pb-4">
          <Shield className="h-8 w-8" />
          <h3 className="text-xl font-black tracking-tight uppercase">
            PRIVACY FIRST
          </h3>
        </div>
        <p className="leading-relaxed font-medium">
          No data uploads, no cloud processing. Your sensitive BIM data stays
          completely private and secure.
        </p>
      </div>

      <div className="bg-background ring-ring/20 rounded-md p-6 shadow-sm ring">
        <div className="mb-4 flex items-center space-x-3">
          <Eye className="h-8 w-8" />
          <h3 className="text-xl font-black tracking-tight uppercase">
            RICH VISUALIZATION
          </h3>
        </div>
        <p className="leading-relaxed font-medium">
          Interactive charts, graphs, and data tables to help you understand and
          analyze your BIM data effectively.
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
            visualization and analysis happens entirely in your browser,
            ensuring complete data privacy and security.
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

  return (
    <div className="mx-auto max-w-4xl">
      <InvalidFileAlertDialog
        open={invalidFileSelected}
        setOpen={setInvalidFileSelected}
      />
      <div className="space-y-8 pb-8 text-center">
        <h2 className="tracking text-6xl leading-none font-black tracking-tighter">
          Visualize BIM data
        </h2>
        <div className="mx-auto h-1 w-24 bg-black"></div>
        <p className="mx-auto max-w-2xl text-xl leading-tight font-medium">
          Upload your BIM data files and explore them with our powerful,
          privacy-first visualization tool.
        </p>
      </div>

      <div className="flex flex-col gap-y-12">
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
