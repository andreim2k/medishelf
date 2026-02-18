import type { Medicine } from "./types";

export const initialMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    medicineType: "Pill",
    quantity: 50,
    purchaseDate: "2023-10-01",
    expiryDate: "2025-09-30",
  },
  {
    id: "2",
    name: "Ibuprofen 200mg",
    medicineType: "Pill",
    quantity: 24,
    purchaseDate: "2024-01-15",
    expiryDate: "2024-08-15", // Expiring soon
  },
  {
    id: "3",
    name: "Cough Syrup",
    medicineType: "Syrup",
    quantity: 1,
    purchaseDate: "2023-11-20",
    expiryDate: "2024-05-30", // Expired
  },
  {
    id: "4",
    name: "Vitamin C 1000mg",
    medicineType: "Pill",
    quantity: 100,
    purchaseDate: "2024-03-01",
    expiryDate: "2026-03-01",
  },
  {
    id: "5",
    name: "Antiseptic Cream",
    medicineType: "Cream",
    quantity: 1,
    purchaseDate: "2023-05-10",
    expiryDate: "2025-05-10",
  },
  {
    id: "6",
    name: "Allergy Relief",
    medicineType: "Pill",
    quantity: 30,
    purchaseDate: "2024-04-12",
    expiryDate: "2025-10-12",
  },
];
