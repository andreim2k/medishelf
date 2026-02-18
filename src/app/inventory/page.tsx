"use client";

import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import type { Medicine } from "@/lib/types";
import { initialMedicines } from "@/lib/data";
import { AddEditMedicineDialog } from "@/components/medishelf/add-edit-medicine-dialog";
import { MedicineCard } from "@/components/medishelf/medicine-card";
import { MedicineListItem } from "@/components/medishelf/medicine-list-item";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MedicineDetailsDialog } from "@/components/medishelf/medicine-details-dialog";
import { generateMedicineDescription } from "@/ai/flows/generate-medicine-description";

type SortableColumn =
  | "name"
  | "status"
  | "medicineType"
  | "quantity"
  | "expiryDate";

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [medicineToView, setMedicineToView] = useState<Medicine | undefined>(
    undefined
  );
  const [medicineToEdit, setMedicineToEdit] = useState<Medicine | undefined>(
    undefined
  );
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [sortColumn, setSortColumn] = useState<SortableColumn>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleAddClick = () => {
    setMedicineToEdit(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setMedicineToEdit(medicine);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setMedicineToDelete(id);
    setIsAlertOpen(true);
  };
  
  const handleViewDetails = (medicine: Medicine) => {
    setMedicineToView(medicine);
    setIsDetailsOpen(true);
  };

  const confirmDelete = () => {
    if (medicineToDelete) {
      setMedicines(medicines.filter((m) => m.id !== medicineToDelete));
      setMedicineToDelete(null);
    }
    setIsAlertOpen(false);
  };

  const handleSaveMedicine = async (medicine: Medicine) => {
    if (medicineToEdit) {
      setMedicines(
        medicines.map((m) => (m.id === medicine.id ? medicine : m))
      );
    } else {
      try {
        const descResult = await generateMedicineDescription({
          medicineName: medicine.name,
        });
        const newMedicine = {
          ...medicine,
          id: crypto.randomUUID(),
          description: descResult.description,
        };
        setMedicines([...medicines, newMedicine]);
      } catch (error) {
        console.error("Failed to generate description", error);
        const newMedicine = {
          ...medicine,
          id: crypto.randomUUID(),
          description: "Nu s-a putut genera descrierea.",
        };
        setMedicines([...medicines, newMedicine]);
      }
    }
  };

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedMedicines = useMemo(() => {
    const getStatusSortValue = (expiryDate: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(expiryDate);
      const diffDays = Math.ceil(
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays < 0) return 0; // Expirat
      if (diffDays <= 30) return 1; // Expiră în curând
      return 2; // Valabil
    };

    return medicines
      .filter((med) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          med.name.toLowerCase().includes(lowerCaseQuery) ||
          (med.description &&
            med.description.toLowerCase().includes(lowerCaseQuery))
        );
      })
      .filter((med) => {
        if (typeFilter === "all") return true;
        return med.medicineType === typeFilter;
      })
      .filter((med) => {
        if (statusFilter === "all") return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(med.expiryDate);
        const diffDays = Math.ceil(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (statusFilter === "expired") return diffDays < 0;
        if (statusFilter === "expiring_soon")
          return diffDays >= 0 && diffDays <= 30;
        if (statusFilter === "safe") return diffDays > 30;
        return true;
      })
      .sort((a, b) => {
        if (sortColumn === "status") {
          const aValue = getStatusSortValue(a.expiryDate);
          const bValue = getStatusSortValue(b.expiryDate);
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (sortColumn === "expiryDate") {
          const aValue = new Date(a.expiryDate).getTime();
          const bValue = new Date(b.expiryDate).getTime();
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (sortColumn === "quantity") {
          const aValue = a.quantity;
          const bValue = b.quantity;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        // name or medicineType
        const aValue = a[sortColumn] as string;
        const bValue = b[sortColumn] as string;

        if (sortDirection === "asc") {
          return aValue.localeCompare(bValue, "ro");
        }
        return bValue.localeCompare(aValue, "ro");
      });
  }, [
    medicines,
    searchQuery,
    statusFilter,
    typeFilter,
    sortColumn,
    sortDirection,
  ]);

  const medicineTypes = useMemo(() => {
    const types = new Set(medicines.map((m) => m.medicineType));
    return Array.from(types);
  }, [medicines]);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Inventarul Tău
        </h1>
        <div className="flex items-center gap-2">
          <div className="mr-2 flex items-center rounded-lg border bg-card p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("card")}
              className={cn(
                "h-8 w-8",
                viewMode === "card" &&
                  "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-8 w-8",
                viewMode === "list" &&
                  "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Adaugă Medicament
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-card/60 p-4 shadow-lg backdrop-blur-xl dark:bg-card/20 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută după nume sau descriere..."
            className="pl-10"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrează după tip" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate Tipurile</SelectItem>
            {medicineTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrează după status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate Statusurile</SelectItem>
            <SelectItem value="safe">Valabil</SelectItem>
            <SelectItem value="expiring_soon">Expiră în curând</SelectItem>
            <SelectItem value="expired">Expirat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedMedicines.length > 0 ? (
        <div>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden border bg-card/60 shadow-lg backdrop-blur-xl dark:bg-card/20">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer group hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          sortColumn === "name"
                            ? "font-semibold text-foreground"
                            : ""
                        )}
                      >
                        Nume
                        {sortColumn === "name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("status")}
                      className="hidden sm:table-cell cursor-pointer group hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          sortColumn === "status"
                            ? "font-semibold text-foreground"
                            : ""
                        )}
                      >
                        Status
                        {sortColumn === "status" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("medicineType")}
                      className="hidden md:table-cell cursor-pointer group hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          sortColumn === "medicineType"
                            ? "font-semibold text-foreground"
                            : ""
                        )}
                      >
                        Tip
                        {sortColumn === "medicineType" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("quantity")}
                      className="hidden sm:table-cell cursor-pointer group hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          sortColumn === "quantity"
                            ? "font-semibold text-foreground"
                            : ""
                        )}
                      >
                        Cantitate
                        {sortColumn === "quantity" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("expiryDate")}
                      className="hidden lg:table-cell cursor-pointer group hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          sortColumn === "expiryDate"
                            ? "font-semibold text-foreground"
                            : ""
                        )}
                      >
                        Expirare
                        {sortColumn === "expiryDate" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedMedicines.map((medicine) => (
                    <MedicineListItem
                      key={medicine.id}
                      medicine={medicine}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-24 text-center">
          <div className="rounded-full border border-dashed p-4">
            <Filter className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">Nu s-au găsit medicamente</h2>
          <p className="text-muted-foreground">
            Încercați să ajustați căutarea sau filtrele, sau adăugați un
            medicament nou.
          </p>
        </div>
      )}

      <AddEditMedicineDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSaveMedicine}
        medicineToEdit={medicineToEdit}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sunteți sigur?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Acest lucru va șterge
              permanent medicamentul din inventarul dvs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MedicineDetailsDialog
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        medicine={medicineToView}
      />
    </>
  );
}
