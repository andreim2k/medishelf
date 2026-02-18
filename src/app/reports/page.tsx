import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Rapoarte
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-24 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            În curând
          </h3>
          <p className="text-sm text-muted-foreground">
            Rapoartele și analizele vor fi disponibile aici.
          </p>
        </div>
      </div>
    </>
  );
}
