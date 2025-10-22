import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Box, ChartBar, DiamondMinus, Hash, Logs } from "lucide-react";

export default function DataReadinessHelpDialog(props: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger className="text-xs font-medium hover:cursor-help">
        {props.children}
      </DialogTrigger>
      <DialogContent className="max-w-[500px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Data Readiness</DialogTitle>
          <DialogDescription className="">
            Data quality varies due to Revit API limits and our current
            exporter. Use these guidelines to evaluate data readiness for your
            specific use case.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[30rem]">
          <section className="text-gray-900">
            <header className="flex items-center gap-1 text-base font-semibold">
              <Box className="h-3 w-3" />
              <h3>Geometric reconstruction ready - GEO</h3>
            </header>
            <div className="space-y-1 pl-0 text-sm">
              <p>
                Contains sufficient numeric attributes to approximate element
                geometry and derive basic shapes and dimensions, with minimal
                qualitative context to interpret those shapes.
              </p>
              <p className="text-gray-500">
                Examples: Grids, Levels, Columns, Beams, etc.
              </p>
            </div>
          </section>
          <Separator className="my-2" />

          <section className="text-gray-900">
            <header className="flex items-center gap-1 text-base font-semibold">
              <ChartBar className="h-3 w-3" />
              Analytics rich - ANA
            </header>
            <div className="space-y-1 pl-0 text-sm">
              <p>
                Contains enough quantitative attributes and meaningful
                categorical/contextual properties to support
                descriptive/diagnostic analytics modeling, even if geometric
                fidelity is lower than GEO.
              </p>
              <p className="text-gray-500">
                e.g. Hardscape, Parking, Planting, Doors, Materials etc
              </p>
            </div>
          </section>
          <Separator className="my-2" />

          <section className="text-gray-900">
            <header className="flex items-center gap-1 text-base font-semibold">
              <Logs className="h-3 w-3" />
              Metric light - MLT
            </header>
            <div className="space-y-1 pl-0 text-sm">
              <p>
                Contains more information than QTY (beyond simple counts) but
                clearly less than ANA. Has minimal numeric metrics for basic
                insight, and typically lacks the contextual/relational data
                needed for deeper analysis.
              </p>
              <p className="text-gray-500">
                e.g. Revisions include a revision number and basic info, but
                lack links to elements or phases, so you can’t query which
                elements were created or modified in each revision.
              </p>
            </div>
          </section>
          <Separator className="my-2" />

          <section className="text-gray-900">
            <header className="flex items-center gap-1 text-base font-semibold">
              <Hash className="h-3 w-3" />
              Quantities only - QTY
            </header>
            <div className="space-y-1 pl-0 text-sm">
              <p>
                Limited to counts or totals with minimal or no supporting
                metrics; useful only for checking quantities in Revit model
                without other useful data.
              </p>
              <p className="text-gray-500">
                e.g. Number of tags, counts of annotations, instance counts
                without dimensions or properties.
              </p>
            </div>
          </section>
          <Separator className="my-2" />

          <section className="text-gray-900">
            <header className="flex items-center gap-1 text-base font-semibold">
              <DiamondMinus className="h-3 w-3" />
              Low analytical value - LOW
            </header>
            <div className="space-y-1 pl-0 text-sm">
              <p>
                Data rarely used in general analytics workflows, typically
                context-specific or requiring specialized models/assumptions to
                be actionable.
              </p>
              <p className="text-gray-500">
                e.g. Structural load cases (without results), sun path settings,
                view-specific graphics overrides, which often do not contain
                useful data.
              </p>
            </div>
          </section>
        </ScrollArea>
        <footer className="text-xs text-gray-500">
          Note: Category assignments may shift as coverage improves. Please open
          an issue or pull request on GitHub if you spot gaps or
          misclassifications.
        </footer>
      </DialogContent>
    </Dialog>
  );
}
