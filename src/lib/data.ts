import type { Medicine } from "./types";

export const initialMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Used to treat pain and reduce high temperature. It's typically used to relieve mild to moderate pain, such as headaches, toothache or sprains, and reduce fevers caused by illnesses such as colds and flu.",
    medicineType: "Pill",
    quantity: 50,
    purchaseDate: "2023-10-01",
    expiryDate: "2025-09-30",
  },
  {
    id: "2",
    name: "Ibuprofen 200mg",
    description: "A nonsteroidal anti-inflammatory drug (NSAID) used for relieving pain, helping with fever and reducing inflammation.",
    medicineType: "Pill",
    quantity: 24,
    purchaseDate: "2024-01-15",
    expiryDate: "2024-08-15", // Expiring soon
  },
  {
    id: "3",
    name: "Cough Syrup",
    description: "A liquid medication used to relieve coughs caused by the common cold, bronchitis, and other breathing illnesses.",
    medicineType: "Syrup",
    quantity: 1,
    purchaseDate: "2023-11-20",
    expiryDate: "2024-05-30", // Expired
  },
  {
    id: "4",
    name: "Vitamin C 1000mg",
    description: "A vitamin and antioxidant that plays an important role in supporting a healthy immune system and maintaining healthy skin, cartilage, and bones.",
    medicineType: "Pill",
    quantity: 100,
    purchaseDate: "2024-03-01",
    expiryDate: "2026-03-01",
  },
  {
    id: "5",
    name: "Antiseptic Cream",
    description: "A topical cream used to prevent infection in minor cuts, scrapes, and burns by killing or stopping the growth of microorganisms.",
    medicineType: "Cream",
    quantity: 1,
    purchaseDate: "2023-05-10",
    expiryDate: "2025-05-10",
  },
  {
    id: "6",
    name: "Allergy Relief",
    description: "Medication used to treat symptoms of allergies, such as sneezing, runny nose, itchy or watery eyes, and hives.",
    medicineType: "Pill",
    quantity: 30,
    purchaseDate: "2024-04-12",
    expiryDate: "2025-10-12",
  },
];
