"use client";

import {
  Pill,
  Package,
  Beaker,
  Droplet,
  Pipette,
  Wind,
  AirVent,
  Syringe,
  Component,
  Bandage,
  HelpCircle,
  type LucideProps,
} from "lucide-react";
import type { Medicine } from "@/lib/types";

type MedicineTypeIconProps = {
  type: Medicine["medicineType"];
  className?: string;
};

export function MedicineTypeIcon({ type, className }: MedicineTypeIconProps) {
  const iconMap: Record<Medicine["medicineType"], React.ElementType<LucideProps>> = {
    "Pastilă": Pill,
    "Capsulă": Pill,
    "Plicuri": Package,
    "Lichid": Beaker,
    "Sirop": Beaker,
    "Picături": Droplet,
    "Cremă": Pipette,
    "Unguent": Pipette,
    "Gel": Pipette,
    "Spray nazal": Wind,
    "Spray oral": Wind,
    "Inhalator": AirVent,
    "Injecție": Syringe,
    "Supozitor": Component,
    "Ovul": Component,
    "Plasture": Bandage,
    "Altul": HelpCircle,
  };

  const Icon = iconMap[type] || HelpCircle;

  return <Icon className={className} />;
}
