"use client";

import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
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

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState<Medicine | undefined>(
    undefined
  );
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

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

  const confirmDelete = () => {
    if (medicineToDelete) {
      setMedicines(medicines.filter((m) => m.id !== medicineToDelete));
      setMedicineToDelete(null);
    }
    setIsAlertOpen(false);
  };

  const handleSaveMedicine = (medicine: Medicine) => {
    if (medicineToEdit) {
      setMedicines(
        medicines.map((m) => (m.id === medicine.id ? medicine : m))
      );
    } else {
      setMedicines([...medicines, { ...medicine, id: crypto.randomUUID() }]);
    }
  };

  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((med) =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
      });
  }, [medicines, searchQuery, statusFilter, typeFilter]);

  const medicineTypes = useMemo(() => {
    const types = new Set(medicines.map((m) => m.medicineType));
    return Array.from(types);
  }, [medicines]);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Your Inventory
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
            Add Medicine
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border bg-card/60 p-4 shadow-lg backdrop-blur-xl dark:bg-card/20 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {medicineTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredMedicines.length > 0 ? (
        <div>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden border bg-card/60 shadow-lg backdrop-blur-xl dark:bg-card/20">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Type
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Quantity
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Expiry
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine) => (
                    <MedicineListItem
                      key={medicine.id}
                      medicine={medicine}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
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
          <h2 className="text-xl font-semibold">No Medicines Found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters, or add a new medicine.
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              medicine from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
