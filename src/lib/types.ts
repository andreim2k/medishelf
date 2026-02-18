export type Medicine = {
  id: string;
  name: string;
  description?: string;
  medicineType:
    | "Pastilă"
    | "Capsulă"
    | "Lichid"
    | "Sirop"
    | "Picături"
    | "Cremă"
    | "Unguent"
    | "Gel"
    | "Spray nazal"
    | "Spray oral"
    | "Inhalator"
    | "Injecție"
    | "Supozitor"
    | "Ovul"
    | "Plasture"
    | "Altul";
  quantity: number;
  purchaseDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
};

export type ExpiryStatus =
  | "Expirat"
  | "Expiră în curând"
  | "Valabil"
  | "Dată Invalidă";
