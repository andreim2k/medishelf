export type Medicine = {
  id: string;
  name: string;
  medicineType: "Pill" | "Liquid" | "Syrup" | "Cream" | "Other";
  quantity: number;
  purchaseDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
};

export type ExpiryStatus = "Expired" | "Expiring Soon" | "Safe" | "Invalid Date";
