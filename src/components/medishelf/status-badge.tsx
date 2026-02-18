"use client";

import { useEffect, useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
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
  const [statusInfo, setStatusInfo] = useState<{
    status: ExpiryStatus;
    days: number | null;
  }>({ status: "Valabil", days: null });

  useEffect(() => {
    setStatusInfo(getExpiryStatus(expiryDate));
  }, [expiryDate]);
  
  const statusConfig = {
    "Expirat": {
      className:
        "bg-destructive/20 text-destructive-foreground border-destructive/30 hover:bg-destructive/30",
      icon: <ShieldX className="mr-1.5 h-3.5 w-3.5" />,
      text: "Expirat",
    },
    "Expiră în curând": {
      className:
        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30",
      icon: <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />,
      text: `Expiră în ${statusInfo.days} zile`,
    },
    "Valabil": {
      className:
        "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30",
      icon: <Shield className="mr-1.5 h-3.5 w-3.5" />,
      text: "Valabil",
    },
    "Dată Invalidă": {
      className: "bg-muted text-muted-foreground",
      icon: null,
      text: "Dată Invalidă",
    },
  };

  const config = statusConfig[statusInfo.status];
  
  if (!config) return null;

  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap", config.className)}
    >
      {config.icon}
      {config.text}
    </Badge>
  );
}
