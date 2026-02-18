"use client";

import type { Medicine } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, Package, Pill } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";
import { StatusBadge } from "./status-badge";

type MedicineDetailsDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  medicine?: Medicine;
};

export function MedicineDetailsDialog({
  isOpen,
  setIsOpen,
  medicine,
}: MedicineDetailsDialogProps) {
  if (!medicine) return null;

  const purchaseDate = format(parseISO(medicine.purchaseDate), "d MMMM yyyy", {
    locale: ro,
  });
  const expiryDate = format(parseISO(medicine.expiryDate), "d MMMM yyyy", {
    locale: ro,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <DialogTitle className="text-2xl">{medicine.name}</DialogTitle>
            <StatusBadge expiryDate={medicine.expiryDate} />
          </div>
          <DialogDescription className="flex items-center gap-1.5 pt-1">
            <Pill className="h-4 w-4" />
            {medicine.medicineType}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {medicine.description &&
              medicine.description.split("\n").map((line, index) => {
                if (!line.trim()) return null;
                // Use a simple regex to find **bolded** text
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={index}>
                    {parts.map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              })}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>
                Cantitate:{" "}
                <span className="font-medium text-foreground">
                  {medicine.quantity}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Cumpărat:{" "}
                <span className="font-medium text-foreground">
                  {purchaseDate}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4 text-destructive/80" />
              <span>
                Expiră:{" "}
                <span className="font-medium text-foreground">{expiryDate}</span>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
