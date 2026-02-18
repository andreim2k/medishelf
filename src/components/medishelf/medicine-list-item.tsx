import type { Medicine } from "@/lib/types";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";

type MedicineListItemProps = {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
  onViewDetails: (medicine: Medicine) => void;
};

export function MedicineListItem({
  medicine,
  onEdit,
  onDelete,
  onViewDetails,
}: MedicineListItemProps) {
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
    cleanDescription.length > 60
      ? `${cleanDescription.substring(0, 60)}...`
      : cleanDescription;

  return (
    <TableRow
      onClick={() => onViewDetails(medicine)}
      className="cursor-pointer"
    >
      <TableCell>
        <div className="font-medium">{medicine.name}</div>
        {medicine.description && (
          <div className="hidden text-sm text-muted-foreground sm:block">
            {truncatedDescription}
          </div>
        )}
        <div className="text-sm text-muted-foreground lg:hidden">
          Expiră {expiryDate}
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
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
      </TableCell>
    </TableRow>
  );
}
