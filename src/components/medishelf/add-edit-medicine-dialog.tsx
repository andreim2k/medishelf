"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";
import type { Medicine } from "@/lib/types";
import { Calendar as CalendarIcon, Loader2, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateMedicineDescription } from "@/ai/flows/generate-medicine-description";
import { Label } from "../ui/label";

// ---------------------------------------------------------------------------
// Inline date picker — renders inside dialog DOM tree, no portal conflicts
// ---------------------------------------------------------------------------
function DatePickerField({
  value,
  onChange,
  disabled,
  placeholder = "Alege o dată",
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full pl-3 text-left font-normal",
          !value && "text-muted-foreground"
        )}
        onClick={() => setOpen((v) => !v)}
      >
        {value ? (
          format(value, "PPP", { locale: ro })
        ) : (
          <span>{placeholder}</span>
        )}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-[200] rounded-md border bg-popover shadow-md">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={disabled}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

const medicineTypes = [
  "Pastilă",
  "Capsulă",
  "Plicuri",
  "Lichid",
  "Sirop",
  "Picături",
  "Cremă",
  "Unguent",
  "Gel",
  "Spray nazal",
  "Spray oral",
  "Inhalator",
  "Injecție",
  "Supozitor",
  "Ovul",
  "Plasture",
  "Altul",
] as const;

const medicineSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere."),
  medicineType: z.enum(medicineTypes),
  quantity: z.coerce
    .number()
    .int()
    .positive("Cantitatea trebuie să fie un număr pozitiv."),
  purchaseDate: z.date({ required_error: "Data cumpărării este obligatorie." }),
  expiryDate: z.date({ required_error: "Data expirării este obligatorie." }),
  description: z.string().optional(),
});

type AddEditMedicineDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (
    medicine: Omit<Medicine, "userId" | "id"> & { id?: string }
  ) => Promise<void>;
  medicineToEdit?: Medicine;
};

export function AddEditMedicineDialog({
  isOpen,
  setIsOpen,
  onSave,
  medicineToEdit,
}: AddEditMedicineDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof medicineSchema>>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: "",
      medicineType: "Pastilă",
      quantity: 1,
      description: "",
    },
  });

  const {
    formState: { isDirty },
    watch,
  } = form;
  const watchedDescription = watch("description");

  useEffect(() => {
    if (isOpen) {
      if (medicineToEdit) {
        form.reset({
          ...medicineToEdit,
          purchaseDate: parseISO(medicineToEdit.purchaseDate),
          expiryDate: new Date(medicineToEdit.expiryDate),
          description: medicineToEdit.description || "",
        });
      } else {
        form.reset({
          id: undefined,
          name: "",
          medicineType: "Pastilă",
          quantity: 1,
          purchaseDate: new Date(),
          expiryDate: undefined,
          description: "",
        });
      }
    }
  }, [medicineToEdit, isOpen, form]);

  const handleGenerateDescription = async () => {
    const medicineName = form.getValues("name");
    if (!medicineName) {
      form.setError("name", {
        type: "manual",
        message: "Introduceți un nume pentru a căuta descrierea.",
      });
      return;
    }
    setIsGenerating(true);
    const { id: toastId, update } = toast({
      title: `Cautare prospect pentru ${medicineName} ...`,
    });
    try {
      const result = await generateMedicineDescription({ medicineName });
      form.setValue("description", result.description, { shouldDirty: true });
      update({
        id: toastId,
        title: "Descriere Generată",
        description: `Descrierea pentru ${medicineName} a fost creată de AI.`,
      });
    } catch (error) {
      console.error("Failed to generate description", error);
      update({
        id: toastId,
        variant: "destructive",
        title: "Eroare AI",
        description: "Descrierea nu a putut fi generată.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderDescription = (description?: string) => {
    if (!description) return null;
    
    const renderWithItalics = (text: string) => {
      const parts = text.split(/(\*.*?\*)/g);
      return (
        <React.Fragment>
          {parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              return <i key={i}>{part.slice(1, -1)}</i>;
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
          })}
        </React.Fragment>
      );
    };

    const sections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } | null = null;

    description.split("\n").forEach((line) => {
      const cleanedLine = line.trim();
      if (!cleanedLine) return;

      const match = cleanedLine.match(/^\*\*(.*?)\*\*/);
      if (match) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const title = match[1].replace(/:$/, "").trim();
        const restOfLine = cleanedLine
          .substring(match[0].length)
          .replace(/^:/, "")
          .trim();
        currentSection = { title, content: [] };
        if (restOfLine) {
          currentSection.content.push(restOfLine);
        }
      } else if (currentSection) {
        currentSection.content.push(cleanedLine.replace(/^- /, ""));
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return (
      <>
        {sections.map((section, index) => {
          const isSideEffects = section.title
            .toLowerCase()
            .includes("efecte secundare");
          let sideEffectsComment: string | null = null;
          let listItems = section.content;

          if (isSideEffects && listItems.length > 1) {
            const lastLine = listItems[listItems.length - 1];
            if (
              lastLine.toLowerCase().startsWith("aceste") ||
              lastLine.toLowerCase().startsWith("dacă")
            ) {
              sideEffectsComment = listItems.pop() || null;
            }
          }

          return (
            <div key={index}>
              <h4 className="font-semibold text-foreground tracking-tight">
                {section.title}
              </h4>
              <div className="mt-2 space-y-1">
                {isSideEffects && listItems.length > 0 ? (
                  <>
                    {listItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start">
                        <span className="mr-2.5 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"></span>
                        <span className="text-muted-foreground">{renderWithItalics(item)}</span>
                      </div>
                    ))}
                    {sideEffectsComment && (
                      <p className="text-sm text-muted-foreground/80 pt-2">
                        {renderWithItalics(sideEffectsComment)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    {renderWithItalics(section.content.join("\n"))}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const onSubmit = async (values: z.infer<typeof medicineSchema>) => {
    setIsSaving(true);
    const { id, ...rest } = values;
    const valuesToSave = {
      ...rest,
      purchaseDate: format(values.purchaseDate, "yyyy-MM-dd"),
      expiryDate: format(values.expiryDate, "yyyy-MM-dd"),
      ...(id ? { id } : {}),
    };

    try {
      await onSave(valuesToSave);
    } catch (error) {
      console.error("Failed to save medicine:", error);
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {medicineToEdit ? "Editează Medicament" : "Adaugă Medicament"}
          </DialogTitle>
          <DialogDescription>
            {medicineToEdit
              ? "Actualizați detaliile medicamentului."
              : "Adăugați un medicament nou în inventarul dvs."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="ex: Paracetamol 500mg" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !field.value}
                    >
                      {isGenerating ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Sparkles />
                      )}
                      <span className="ml-2 hidden sm:inline">
                        Căutare AI
                      </span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantitate</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tip</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează tip" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medicineTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Cumpărării</FormLabel>
                    <FormControl>
                      <DatePickerField
                        value={field.value}
                        onChange={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Expirării</FormLabel>
                    <FormControl>
                      <DatePickerField
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prospect medicament</FormLabel>
                  <div className="max-h-48 overflow-y-auto rounded-md border bg-muted/50 p-3 text-sm space-y-4">
                  {field.value ? (
                    renderDescription(field.value)
                  ) : (
                    <p className="text-muted-foreground">
                      Apasă "Căutare AI" pentru a genera o descriere.
                    </p>
                  )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Renunță
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !isDirty || !watchedDescription}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvează
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
