import type { Medicine } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MedicineTypeIcon } from "./medicine-type-icon";

type MedicineCardProps = {
  medicine: Medicine;
  isSelected: boolean;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
  onViewDetails: (medicine: Medicine) => void;
  onSelect: (id: string) => void;
};

export function MedicineCard({
  medicine,
  isSelected,
  onEdit,
  onDelete,
  onViewDetails,
  onSelect,
}: MedicineCardProps) {
  const purchaseDate = format(parseISO(medicine.purchaseDate), "d MMM yyyy", {
    locale: ro,
  });
  const expiryDate = format(parseISO(medicine.expiryDate), "d MMM yyyy", {
    locale: ro,
  });

  const cleanDescription = medicine.description
    ? medicine.description
        .replace(/\*\*/g, "")
        .replace(/^-\s*/gm, "")
        .replace(/\n/g, " ")
        .trim()
    : "";

  const truncatedDescription =
    cleanDescription.length > 100
      ? `${cleanDescription.substring(0, 100)}...`
      : cleanDescription;

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden transition-all duration-400",
        isSelected
          ? "shadow-[0_0_0_2px_rgba(168,85,247,0.7),0_20px_60px_-8px_rgba(168,85,247,0.3),0_8px_24px_rgba(0,0,0,0.15)] translate-y-[-2px]"
          : ""
      )}
      style={
        isSelected
          ? {
              background: "rgba(168, 85, 247, 0.08)",
              borderColor: "rgba(168, 85, 247, 0.5)",
            }
          : {}
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(medicine.id)}
                aria-label="Selectează medicament"
                className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
            {/* Medicine icon */}
            <div
              className="medicine-icon-circle h-9 w-9 flex-shrink-0"
              style={{ width: "36px", height: "36px" }}
            >
              <MedicineTypeIcon
                type={medicine.medicineType}
                className="h-4 w-4"
              />
            </div>
            <CardTitle
              className="cursor-pointer text-base font-semibold leading-snug truncate"
              onClick={() => onViewDetails(medicine)}
            >
              {medicine.name}
            </CardTitle>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge expiryDate={medicine.expiryDate} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 pl-[60px] text-xs text-muted-foreground">
          <span>{medicine.medicineType}</span>
        </div>
      </CardHeader>

      <CardContent
        className="flex-grow cursor-pointer space-y-3 pt-0"
        onClick={() => onViewDetails(medicine)}
      >
        {medicine.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncatedDescription}
          </p>
        )}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-md flex-shrink-0"
              style={{ background: "rgba(168,85,247,0.12)" }}
            >
              <Package className="h-3 w-3 text-primary" />
            </div>
            <span>Cantitate: <span className="font-medium text-foreground">{medicine.quantity}</span></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-md flex-shrink-0"
              style={{ background: "rgba(6,214,245,0.1)" }}
            >
              <Calendar className="h-3 w-3 text-accent" />
            </div>
            <span>Cumpărat: <span className="font-medium text-foreground">{purchaseDate}</span></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-md flex-shrink-0"
              style={{ background: "rgba(239,68,68,0.1)" }}
            >
              <Calendar className="h-3 w-3 text-destructive" />
            </div>
            <span>Expiră: <span className="font-medium text-foreground">{expiryDate}</span></span>
          </div>
        </div>
      </CardContent>

      <CardFooter
        className="justify-end gap-1 p-3 pt-2"
        style={{
          background: "rgba(0,0,0,0.08)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
          onClick={() => onEdit(medicine)}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Editează</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(medicine.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Șterge</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
