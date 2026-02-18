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
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const medicineSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere."),
  description: z.string().optional(),
  medicineType: z.enum(["Pastilă", "Lichid", "Sirop", "Cremă", "Altul"]),
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
  });

  useEffect(() => {
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
  }, [medicineToEdit, isOpen, form]);

  const handleGenerateDescription = async () => {
    const name = form.getValues("name");
    if (!name) {
      form.setError("name", { message: "Vă rugăm introduceți mai întâi un nume." });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateMedicineDescription({ medicineName: name });
      form.setValue("description", result.description, {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Failed to generate description", error);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Descriere</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !form.watch("name")}
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      {isGenerating ? "Se generează..." : "Generează"}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="ex: RO: Utilizat pentru a trata durerea și a reduce febra. EN: Used to treat pain and reduce fever."
                      {...field}
                      value={field.value ?? ""}
                      rows={4}
                    />
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează tip" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Pastilă", "Lichid", "Sirop", "Cremă", "Altul"].map(
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
                      <PopoverContent className="w-auto p-0" align="start">
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
                      <PopoverContent className="w-auto p-0" align="start">
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
            <DialogFooter>
              <Button type="submit">Salvează</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
