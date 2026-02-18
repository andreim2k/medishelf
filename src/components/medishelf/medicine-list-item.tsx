import type { Medicine } from "@/lib/types";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { format, parseISO } from "date-fns";

type MedicineListItemProps = {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
};

export function MedicineListItem({
  medicine,
  onEdit,
  onDelete,
}: MedicineListItemProps) {
  const expiryDate = format(parseISO(medicine.expiryDate), "MMM d, yyyy");

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{medicine.name}</div>
        <div className="text-sm text-muted-foreground lg:hidden">
          Expires {expiryDate}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <StatusBadge expiryDate={medicine.expiryDate} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {medicine.medicineType}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {medicine.quantity}
      </TableCell>
      <TableCell className="hidden lg:table-cell">{expiryDate}</TableCell>
      <TableCell className="text-right">
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
      </TableCell>
    </TableRow>
  );
}
