"use client";

import { useState, useRef } from "react";
import * as z from "zod";
import { Loader2, UploadCloud, FileJson, AlertCircle } from "lucide-react";
import type { Medicine } from "@/lib/types";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ImportMedicinesDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (medicines: Omit<Medicine, "id" | "userId">[]) => Promise<void>;
};

const importMedicineSchema = z.object({
  name: z.string().min(2, { message: "Numele este obligatoriu." }),
  medicineType: z.string({ required_error: "Tipul este obligatoriu." }),
  quantity: z.coerce.number().int().positive({ message: "Cantitatea trebuie să fie pozitivă." }),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format dată invalid. Folosiți YYYY-MM-DD." }),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format dată invalid. Folosiți YYYY-MM-DD." }),
  description: z.string().optional().nullable(),
});

const importSchema = z.array(importMedicineSchema);

export function ImportMedicinesDialog({ isOpen, setIsOpen, onSave }: ImportMedicinesDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedMedicines, setParsedMedicines] = useState<Omit<Medicine, "id" | "userId">[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setParsedMedicines([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') {
          throw new Error('Conținutul fișierului nu poate fi citit.');
        }
        const jsonData = JSON.parse(content);
        const validationResult = importSchema.safeParse(jsonData);

        if (!validationResult.success) {
          const firstError = validationResult.error.errors[0];
          console.error(validationResult.error.flatten());
          throw new Error(`Validare eșuată: ${firstError.path.join('.')} - ${firstError.message}`);
        }
        setParsedMedicines(validationResult.data as Omit<Medicine, "id"| "userId">[]);
      } catch (err: any) {
        setError(err.message || "Nu s-a putut procesa fișierul JSON.");
        setFileName(null);
      }
    };
    reader.readAsText(file);
  };
  
  const resetState = () => {
    setIsSaving(false);
    setFileName(null);
    setParsedMedicines([]);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleOpenChange = (open: boolean) => {
    if(!open) {
        resetState();
    }
    setIsOpen(open);
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(parsedMedicines);
      handleOpenChange(false);
    } catch(err) {
      toast({ variant: 'destructive', title: 'Eroare', description: 'Nu s-a putut salva medicamentele importate.'})
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importă Medicamente</DialogTitle>
          <DialogDescription>
            Selectează un fișier JSON pentru a importa medicamente în vrac. Fișierul trebuie să conțină un array de obiecte.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
            id="import-file"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Selectează fișier
          </Button>

          {fileName && (
            <div className="flex items-center rounded-md border p-3">
              <FileJson className="h-5 w-5 mr-3 text-muted-foreground" />
              <div className="flex-grow">
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground">{parsedMedicines.length} medicamente găsite.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center rounded-md border border-destructive/50 bg-destructive/10 p-3">
              <AlertCircle className="h-5 w-5 mr-3 text-destructive" />
              <div className="flex-grow">
                <p className="text-sm font-semibold text-destructive">Eroare la import</p>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSave} disabled={isSaving || parsedMedicines.length === 0}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Importă {parsedMedicines.length > 0 ? parsedMedicines.length : ''} Medicamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
