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
  Loader2,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import { collection, doc, addDoc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { parseISO } from "date-fns";
import type { Medicine } from "@/lib/types";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MedicineDetailsDialog } from "@/components/medishelf/medicine-details-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
  errorEmitter,
  FirestorePermissionError,
} from "@/firebase";
import { ImportMedicinesDialog } from "@/components/medishelf/import-medicines-dialog";


type SortableColumn =
  | "name"
  | "status"
  | "medicineType"
  | "quantity"
  | "expiryDate";

export default function InventoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const medicinesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "medicines");
  }, [firestore, user]);

  const { data: medicines, loading } = useCollection<Medicine>(medicinesQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [medicineToView, setMedicineToView] = useState<Medicine | undefined>(
    undefined
  );
  const [medicineToEdit, setMedicineToEdit] = useState<Medicine | undefined>(
    undefined
  );
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "list">("list");
  const [sortColumn, setSortColumn] = useState<SortableColumn>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const handleAddClick = () => {
    setMedicineToEdit(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setMedicineToEdit(medicine);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedMedicines([]);
    setMedicineToDelete(id);
    setIsAlertOpen(true);
  };
  
  const handleDeleteSelectedClick = () => {
    setMedicineToDelete(null);
    setIsAlertOpen(true);
  };

  const handleViewDetails = (medicine: Medicine) => {
    setMedicineToView(medicine);
    setIsDetailsOpen(true);
  };

  const confirmDelete = () => {
    if (!firestore || !user) return;

    if (selectedMedicines.length > 0) {
      const batch = writeBatch(firestore);
      selectedMedicines.forEach((id) => {
        const docRef = doc(firestore, "users", user.uid, "medicines", id);
        batch.delete(docRef);
      });
      toast({
        title: "Se șterg...",
        description: `${selectedMedicines.length} medicamente sunt în curs de eliminare.`,
      });
      batch.commit().then(() => {
        toast({
            title: "Medicamente Șterse",
            description: `${selectedMedicines.length} medicamente au fost eliminate.`,
        });
        setSelectedMedicines([]);
      }).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: `users/${user.uid}/medicines`,
          operation: "delete",
        });
        errorEmitter.emit("permission-error", permissionError);
        toast({
          variant: "destructive",
          title: "Eroare",
          description: "Nu s-au putut șterge medicamentele selectate.",
        });
      });

    } else if (medicineToDelete) {
      const docRef = doc(
        firestore,
        "users",
        user.uid,
        "medicines",
        medicineToDelete
      );
      toast({
        title: "Se șterge...",
        description: "Medicamentul este în curs de eliminare.",
      });
      deleteDoc(docRef)
        .then(() => {
          toast({
            title: "Medicament Șters",
            description: "Medicamentul a fost eliminat din inventarul tău.",
          });
        })
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: "delete",
          });
          errorEmitter.emit("permission-error", permissionError);
          toast({
            variant: "destructive",
            title: "Eroare",
            description: "Nu s-a putut șterge medicamentul.",
          });
        });
      setMedicineToDelete(null);
    }
    
    setIsAlertOpen(false);
  };

  const handleSaveMedicine = async (
    medicine: Omit<Medicine, "id" | "userId"> & { id?: string }
  ) => {
    if (!firestore || !user) return;

    if (medicine.id) {
      const { id, ...medicineData } = medicine;
      const docRef = doc(firestore, "users", user.uid, "medicines", id);
      const medicineWithUser = { ...medicineData, userId: user.uid };
      toast({
        title: "Se actualizează...",
        description: `${medicine.name} este în curs de actualizare.`,
      });
      setDoc(docRef, medicineWithUser, { merge: true })
        .then(() => {
          toast({
            title: "Medicament Actualizat",
            description: `${medicine.name} a fost actualizat cu succes.`,
          });
        })
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: "update",
            requestResourceData: medicineWithUser,
          });
          errorEmitter.emit("permission-error", permissionError);
          toast({
            variant: "destructive",
            title: "Eroare",
            description: "Nu s-a putut actualiza medicamentul.",
          });
        });
    } else {
      const { id, ...medicineData } = medicine; // Ensure id is not passed for new docs
      const collectionRef = collection(
        firestore,
        "users",
        user.uid,
        "medicines"
      );
      const newMedicine = { ...medicineData, userId: user.uid };
      toast({
        title: "Se adaugă...",
        description: `Se adaugă ${medicine.name} în inventar.`,
      });
      addDoc(collectionRef, newMedicine)
        .then(() => {
          toast({
            title: "Medicament Adăugat",
            description: `${medicine.name} a fost adăugat cu succes.`,
          });
        })
        .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: "create",
            requestResourceData: newMedicine,
          });
          errorEmitter.emit("permission-error", permissionError);
          toast({
            variant: "destructive",
            title: "Eroare",
            description: "Nu s-a putut adăuga medicamentul.",
          });
        });
    }
  };
  
  const handleSelect = (id: string) => {
    setSelectedMedicines((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMedicines(filteredAndSortedMedicines.map((m) => m.id));
    } else {
      setSelectedMedicines([]);
    }
  };

  const handleExport = () => {
    const dataToExport = selectedMedicines.length > 0 
      ? medicines?.filter(m => selectedMedicines.includes(m.id))
      : filteredAndSortedMedicines;

    if (!dataToExport || dataToExport.length === 0) {
      toast({ variant: 'destructive', title: 'Export Eșuat', description: 'Nu există medicamente de exportat.'});
      return;
    }

    const jsonString = JSON.stringify(dataToExport.map(({ id, userId, ...rest }) => rest), null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "medishelf_export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Export Finalizat", description: `${dataToExport.length} medicamente au fost exportate.`});
  };
  
  const handleImportSave = async (importedMedicines: Omit<Medicine, "id" | "userId">[]) => {
    if (!firestore || !user) return;

    const batch = writeBatch(firestore);
    importedMedicines.forEach(med => {
      const newDocRef = doc(collection(firestore, "users", user.uid, "medicines"));
      batch.set(newDocRef, { ...med, userId: user.uid });
    });
    
    toast({ title: 'Se importă...', description: `Se importă ${importedMedicines.length} medicamente.`});

    try {
      await batch.commit();
      toast({ title: 'Import Finalizat', description: `${importedMedicines.length} medicamente au fost importate cu succes.`});
    } catch (e: any) {
      const permissionError = new FirestorePermissionError({
        path: `users/${user.uid}/medicines`,
        operation: 'create',
        requestResourceData: importedMedicines.slice(0, 5) // Send a sample
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({ variant: 'destructive', title: 'Eroare la Import', description: 'Nu s-au putut importa medicamentele.'});
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
    if (!medicines) return [];

    const getStatusSortValue = (expiryDate: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = parseISO(expiryDate);
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
        const expiry = parseISO(med.expiryDate);
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
          const aValue = parseISO(a.expiryDate).getTime();
          const bValue = parseISO(b.expiryDate).getTime();
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (sortColumn === "quantity") {
          const aValue = a.quantity;
          const bValue = b.quantity;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

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
    if (!medicines) return [];
    const types = new Set(medicines.map((m) => m.medicineType));
    return Array.from(types);
  }, [medicines]);

  const isAllSelected = useMemo(() => {
    return filteredAndSortedMedicines.length > 0 && selectedMedicines.length === filteredAndSortedMedicines.length;
  }, [selectedMedicines, filteredAndSortedMedicines]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Inventarul Tău
        </h1>
        <div className="flex items-center gap-2">
          {selectedMedicines.length > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">{selectedMedicines.length} selectat(e)</span>
              <Button variant="outline" size="sm" onClick={handleDeleteSelectedClick}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Șterge
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Exportă selectate
              </Button>
            </>
          ) : (
            <>
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
              <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} size="sm" className="sm:w-auto w-10 !p-0 sm:!px-3">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Importă</span>
              </Button>
              <Button onClick={handleAddClick} size="sm" className="sm:w-auto w-10 !p-0 sm:!px-3">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Adaugă Medicament</span>
              </Button>
            </>
          )}
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
                  isSelected={selectedMedicines.includes(medicine.id)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden border bg-card/60 shadow-lg backdrop-blur-xl dark:bg-card/20">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] px-4">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={(checked) => handleSelectAll(checked === true)}
                        aria-label="Selectează tot"
                      />
                    </TableHead>
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
                      isSelected={selectedMedicines.includes(medicine.id)}
                      onSelect={handleSelect}
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
              {selectedMedicines.length > 0 
                ? `Această acțiune nu poate fi anulată. Acest lucru va șterge permanent ${selectedMedicines.length} medicamente din inventarul dvs.`
                : 'Această acțiune nu poate fi anulată. Acest lucru va șterge permanent medicamentul din inventarul dvs.'
              }
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
      
      <ImportMedicinesDialog 
        isOpen={isImportDialogOpen}
        setIsOpen={setIsImportDialogOpen}
        onSave={handleImportSave}
      />
    </>
  );
}
