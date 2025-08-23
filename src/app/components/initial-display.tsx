import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
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

export default function InitialDisplay() {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  return (
    <div className="mx-auto max-w-4xl">
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
        <Dropzone
          maxFiles={3}
          onDrop={handleDrop}
          onError={console.error}
          src={files}
          className=""
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>

        <FeatureWhole />
        <FeatureGrid />
      </div>
    </div>
  );
}
