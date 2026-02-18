"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import type { Medicine } from "@/lib/types";
import { generateMedicineDescription } from "@/ai/flows/generate-medicine-description";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  id: z.string(),
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere."),
  description: z.string().optional(),
  medicineType: z.enum(medicineTypes),
  quantity: z.coerce
    .number()
    .int()
    .positive("Cantitatea trebuie să fie un număr pozitiv."),
  purchaseDate: z.date({ required_error: "Data cumpărării este obligatorie." }),
  expiryDate: z.date({ required_error: "Data expirării este obligatorie." }),
});

type AddEditMedicineDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (medicine: Medicine) => void;
  medicineToEdit?: Medicine;
};

export function AddEditMedicineDialog({
  isOpen,
  setIsOpen,
  onSave,
  medicineToEdit,
}: AddEditMedicineDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<z.infer<typeof medicineSchema>>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      medicineType: "Pastilă",
      quantity: 1,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (medicineToEdit) {
        form.reset({
          ...medicineToEdit,
          description: medicineToEdit.description || "",
          purchaseDate: new Date(medicineToEdit.purchaseDate),
          expiryDate: new Date(medicineToEdit.expiryDate),
        });
      } else {
        form.reset({
          id: crypto.randomUUID(),
          name: "",
          description: "",
          medicineType: "Pastilă",
          quantity: 1,
          purchaseDate: new Date(),
          expiryDate: undefined,
        });
      }
    }
  }, [medicineToEdit, isOpen, form]);

  const handleGenerate = async () => {
    const name = form.getValues("name");
    if (!name) {
      form.setError("name", {
        message: "Vă rugăm introduceți mai întâi un nume.",
      });
      return;
    }
    setIsGenerating(true);
    form.setValue("description", "");
    try {
      const descResult = await generateMedicineDescription({ medicineName: name });

      if (descResult) {
        form.setValue("description", descResult.description, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.error("Failed to generate details", error);
      // TODO: Show a toast notification to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (values: z.infer<typeof medicineSchema>) => {
    onSave({
      ...values,
      purchaseDate: format(values.purchaseDate, "yyyy-MM-dd"),
      expiryDate: format(values.expiryDate, "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };
  
  const renderDescription = (description?: string) => {
    if (!description) {
      return (
        <p className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
          Descrierea va apărea aici după generare.
        </p>
      );
    }

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

    if (sections.length === 0) {
      return <p className="text-sm text-muted-foreground">{description}</p>;
    }

    return sections.map((section, index) => {
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
          <h4 className="font-semibold tracking-tight text-foreground">
            {section.title}
          </h4>
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
                  <p className="pt-2 text-sm text-muted-foreground/80">
                    {sideEffectsComment}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                {section.content.join("\n")}
              </p>
            )}
          </div>
        </div>
      );
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
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
            className="max-h-[80vh] space-y-4 overflow-y-auto px-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Paracetamol 500mg" {...field} />
                  </FormControl>
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
                        {medicineTypes.map(
                          (type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          )
                        )}
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ro })
                            ) : (
                              <span>Alege o dată</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[100]" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          locale={ro}
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ro })
                            ) : (
                              <span>Alege o dată</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[100]" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ro}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Descriere</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating || !form.watch("name")}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isGenerating ? "Se caută..." : "Caută"}
                </Button>
              </div>

              {isGenerating ? (
                <div className="min-h-[192px] space-y-2 pt-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                 <div className="min-h-[192px] max-h-72 overflow-y-auto rounded-lg border bg-muted/30 p-4 space-y-4 text-sm">
                  {renderDescription(form.watch("description"))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Renunță
              </Button>
              <Button type="submit">Salvează</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
