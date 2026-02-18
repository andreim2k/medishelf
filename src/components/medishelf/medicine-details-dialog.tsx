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

  const renderDescription = (description?: string) => {
    if (!description) return null;

    const sections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } | null = null;

    description.split('\n').forEach(line => {
      const cleanedLine = line.trim();
      if (!cleanedLine) return;

      const match = cleanedLine.match(/^\*\*(.*?)\*\*/);
      if (match) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const title = match[1].replace(/:$/, '').trim();
        const restOfLine = cleanedLine.substring(match[0].length).replace(/^:/, '').trim();
        currentSection = { title, content: [] };
        if (restOfLine) {
          currentSection.content.push(restOfLine);
        }
      } else if (currentSection) {
        currentSection.content.push(cleanedLine.replace(/^- /, ''));
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections.map((section, index) => {
      const isSideEffects = section.title.toLowerCase().includes('efecte secundare');
      let sideEffectsComment: string | null = null;
      let listItems = section.content;

      if (isSideEffects && listItems.length > 1) {
          const lastLine = listItems[listItems.length - 1];
          if(lastLine.toLowerCase().startsWith('aceste') || lastLine.toLowerCase().startsWith('dacă')) {
              sideEffectsComment = listItems.pop() || null;
          }
      }

      return (
        <div key={index}>
          <h4 className="font-semibold text-foreground tracking-tight">{section.title}</h4>
          <div className="mt-2 space-y-1">
          {isSideEffects && listItems.length > 0 ? (
            <>
              {listItems.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start">
                  <span className="mr-2.5 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"></span>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
              {sideEffectsComment && (
                 <p className="text-sm text-muted-foreground/80 pt-2">{sideEffectsComment}</p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">{section.content.join('\n')}</p>
          )}
          </div>
        </div>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
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
          <div className="max-w-none text-sm space-y-4">
            {renderDescription(medicine.description)}
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
