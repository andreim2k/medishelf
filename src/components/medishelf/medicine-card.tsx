import type { Medicine } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { format, parseISO } from "date-fns";

type MedicineCardProps = {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
};

export function MedicineCard({
  medicine,
  onEdit,
  onDelete,
}: MedicineCardProps) {
  const purchaseDate = format(parseISO(medicine.purchaseDate), "MMM d, yyyy");
  const expiryDate = format(parseISO(medicine.expiryDate), "MMM d, yyyy");

  return (
    <Card className="flex h-full flex-col overflow-hidden border bg-card/60 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-primary/20 dark:bg-card/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold">{medicine.name}</CardTitle>
          <StatusBadge expiryDate={medicine.expiryDate} />
        </div>
        <CardDescription>{medicine.medicineType}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {medicine.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {medicine.description}
          </p>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Package className="mr-2 h-4 w-4" />
          <span>Quantity: {medicine.quantity}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Purchased: {purchaseDate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4 text-destructive/80" />
          <span>Expires: {expiryDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-muted/30 p-3 dark:bg-black/20">
        <Button variant="ghost" size="icon" onClick={() => onEdit(medicine)}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(medicine.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
