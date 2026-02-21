"use client";

import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import type { ExpiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldX } from "lucide-react";

type StatusBadgeProps = {
  expiryDate: string;
};

const getExpiryStatus = (
  dateStr: string
): { status: ExpiryStatus; days: number | null } => {
  try {
    const expiry = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = differenceInDays(expiry, today);

    if (days < 0) return { status: "Expirat", days };
    if (days <= 30) return { status: "Expiră în curând", days };
    return { status: "Valabil", days };
  } catch (error) {
    return { status: "Dată Invalidă", days: null };
  }
};

export function StatusBadge({ expiryDate }: StatusBadgeProps) {
  const statusInfo = useMemo(() => getExpiryStatus(expiryDate), [expiryDate]);

  const statusConfig = {
    "Expirat": {
      className: "badge-expired",
      icon: <ShieldX className="h-3 w-3" />,
      text: "Expirat",
    },
    "Expiră în curând": {
      className: "badge-expiring",
      icon: <ShieldAlert className="h-3 w-3" />,
      text: `${statusInfo.days}z`,
    },
    "Valabil": {
      className: "badge-valid",
      icon: <Shield className="h-3 w-3" />,
      text: "Valabil",
    },
    "Dată Invalidă": {
      className: "badge-invalid",
      icon: null,
      text: "—",
    },
  };

  const config = statusConfig[statusInfo.status];

  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap tracking-wide",
        config.className
      )}
    >
      {config.icon}
      {config.text}
    </span>
  );
}
