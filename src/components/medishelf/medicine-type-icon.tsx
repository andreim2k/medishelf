"use client";

import type { Medicine } from "@/lib/types";
import {
  CapsuleIcon,
  CreamTubeIcon,
  DropsIcon,
  InhalerIcon,
  InjectionIcon,
  LiquidBottleIcon,
  OtherIcon,
  OvuleIcon,
  PatchIcon,
  SachetIcon,
  SprayBottleIcon,
  SuppositoryIcon,
  TabletIcon,
} from "./icons";

type MedicineTypeIconProps = {
  type: Medicine["medicineType"];
  className?: string;
};

export function MedicineTypeIcon({ type, className }: MedicineTypeIconProps) {
  const iconMap: Record<
    Medicine["medicineType"],
    React.ElementType<React.SVGProps<SVGSVGElement>>
  > = {
    "Pastilă": TabletIcon,
    "Capsulă": CapsuleIcon,
    "Plicuri": SachetIcon,
    "Lichid": LiquidBottleIcon,
    "Sirop": LiquidBottleIcon,
    "Picături": DropsIcon,
    "Cremă": CreamTubeIcon,
    "Unguent": CreamTubeIcon,
    "Gel": CreamTubeIcon,
    "Spray nazal": SprayBottleIcon,
    "Spray oral": SprayBottleIcon,
    "Inhalator": InhalerIcon,
    "Injecție": InjectionIcon,
    "Supozitor": SuppositoryIcon,
    "Ovul": OvuleIcon,
    "Plasture": PatchIcon,
    "Altul": OtherIcon,
  };

  const Icon = iconMap[type] || OtherIcon;

  return <Icon className={className} />;
}
