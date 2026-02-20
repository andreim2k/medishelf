import type { Medicine } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
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
        "flex h-full flex-col overflow-hidden border shadow-lg backdrop-blur-xl transition-all duration-300 dark:bg-card/20",
        isSelected
          ? "border-primary shadow-primary/20"
          : "bg-card/60 hover:shadow-primary/20"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
             <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(medicine.id)}
                aria-label="Selectează medicament"
              />
            </div>
            <CardTitle
              className="cursor-pointer text-lg font-semibold"
              onClick={() => onViewDetails(medicine)}
            >
              {medicine.name}
            </CardTitle>
          </div>
          <StatusBadge expiryDate={medicine.expiryDate} />
        </div>
        <CardDescription>{medicine.medicineType}</CardDescription>
      </CardHeader>
      <CardContent
        className="flex-grow cursor-pointer space-y-4"
        onClick={() => onViewDetails(medicine)}
      >
        {medicine.description && (
          <p className="text-sm text-muted-foreground">
            {truncatedDescription}
          </p>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Package className="mr-2 h-4 w-4" />
          <span>Cantitate: {medicine.quantity}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Cumpărat: {purchaseDate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4 text-destructive/80" />
          <span>Expiră: {expiryDate}</span>
        </div>
      </CardContent>
      <CardFooter
        className="flex justify-end gap-2 bg-muted/30 p-3 dark:bg-black/20"
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" onClick={() => onEdit(medicine)}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editează</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(medicine.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Șterge</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
