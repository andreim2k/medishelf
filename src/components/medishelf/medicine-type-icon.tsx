"use client";

import {
  Pill,
  CircleDot,
  Package,
  Beaker,
  Droplet,
  Hand,
  Wind,
  AirVent,
  Syringe,
  Shell,
  Egg,
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
    "Pastilă": CircleDot,
    "Capsulă": Pill,
    "Plicuri": Package,
    "Lichid": Beaker,
    "Sirop": Beaker,
    "Picături": Droplet,
    "Cremă": Hand,
    "Unguent": Hand,
    "Gel": Hand,
    "Spray nazal": Wind,
    "Spray oral": Wind,
    "Inhalator": AirVent,
    "Injecție": Syringe,
    "Supozitor": Shell,
    "Ovul": Egg,
    "Plasture": Bandage,
    "Altul": HelpCircle,
  };

  const Icon = iconMap[type] || HelpCircle;

  return <Icon className={className} />;
}
