"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Activity, AlertTriangle, AlertOctagon, Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { parseISO } from "date-fns";
import type { Medicine } from "@/lib/types";
import { collection } from "firebase/firestore";
import { MedicineTypeIcon } from "@/components/medishelf/medicine-type-icon";

export default function Home() {
  const { user } = useUser();
  const firestore = useFirestore();

  const medicinesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "medicines");
  }, [firestore, user]);

  const { data: medicines, loading } = useCollection<Medicine>(medicinesQuery);

  const chartData = useMemo(() => {
    const monthNames = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!medicines) {
      return monthNames.map(name => ({ name, total: 0 }));
    }

    const currentYear = new Date().getFullYear();

    const monthlyCounts = medicines.reduce((acc, med) => {
      try {
        const purchaseDate = parseISO(med.purchaseDate);
        if (!isNaN(purchaseDate.getTime()) && purchaseDate.getFullYear() === currentYear) {
          const month = purchaseDate.getMonth();
          acc[month] = (acc[month] || 0) + 1;
        }
      } catch (e) {}
      return acc;
    }, {} as Record<number, number>);

    return monthNames.map((name, index) => ({
      name,
      total: monthlyCounts[index] || 0,
    }));
  }, [medicines]);

  const { expiringSoonCount, expiredCount, addedThisMonthCount } = useMemo(() => {
    if (!medicines) return { expiringSoonCount: 0, expiredCount: 0, addedThisMonthCount: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return medicines.reduce(
      (acc, med) => {
        try {
          const expiry = new Date(med.expiryDate);
          if (!isNaN(expiry.getTime())) {
            const diffDays = Math.ceil(
              (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (diffDays < 0) {
              acc.expiredCount++;
            } else if (diffDays <= 30) {
              acc.expiringSoonCount++;
            }
          }

          const purchaseDate = parseISO(med.purchaseDate);
          if (!isNaN(purchaseDate.getTime())) {
            if (purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear) {
              acc.addedThisMonthCount++;
            }
          }
        } catch (e) {}

        return acc;
      },
      { expiringSoonCount: 0, expiredCount: 0, addedThisMonthCount: 0 }
    );
  }, [medicines]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,214,245,0.15))",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground animate-fade-in">Se încarcă inventarul...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1
            className="gradient-text text-2xl font-bold tracking-tight md:text-3xl"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Panou de control
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bun venit! Iată rezumatul inventarului tău.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {/* Total */}
        <div
          className="stat-card stat-card-purple p-5"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Total
            </p>
            <div className="stat-icon">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {medicines?.length || 0}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">medicamente în inventar</p>
        </div>

        {/* Expiring soon */}
        <div
          className="stat-card stat-card-amber p-5"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Expiră curând
            </p>
            <div className="stat-icon">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "rgb(234, 179, 8)" }}
          >
            {expiringSoonCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">în următoarele 30 zile</p>
        </div>

        {/* Expired */}
        <div
          className="stat-card stat-card-red p-5"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Expirate
            </p>
            <div className="stat-icon">
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "rgb(239, 68, 68)" }}
          >
            {expiredCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">medicamente expirate</p>
        </div>

        {/* Activity */}
        <div
          className="stat-card stat-card-cyan p-5"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Activitate
            </p>
            <div className="stat-icon">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "rgb(6, 214, 245)" }}
          >
            +{addedThisMonthCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">adăugate luna aceasta</p>
        </div>
      </div>

      {/* Chart + Recent section */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Bar chart */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle
              className="text-lg font-semibold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Rezumat Adăugări
            </CardTitle>
            <CardDescription>
              Medicamente adăugate pe lună în {new Date().getFullYear()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(168,85,247,0.08)", radius: 6 }}
                  contentStyle={{
                    background: "rgba(15, 20, 40, 0.85)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))", fontWeight: 600 }}
                />
                <Bar
                  dataKey="total"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recently added */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle
              className="text-lg font-semibold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Adăugate Recent
            </CardTitle>
            <CardDescription>
              {medicines?.length || 0} medicamente în total.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicines?.slice(0, 5).map((med, i) => (
              <div
                key={med.id}
                className="flex items-center gap-3 rounded-xl p-2 transition-all duration-300 hover:bg-white/5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="medicine-icon-circle h-10 w-10 flex-shrink-0">
                  <MedicineTypeIcon type={med.medicineType} className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="truncate text-sm font-semibold leading-none">{med.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{med.medicineType}</p>
                </div>
                <div
                  className="flex-shrink-0 rounded-lg px-2 py-1 text-xs font-bold tabular-nums"
                  style={{
                    background: "rgba(168,85,247,0.12)",
                    color: "hsl(var(--primary))",
                    border: "1px solid rgba(168,85,247,0.2)",
                  }}
                >
                  ×{med.quantity}
                </div>
              </div>
            ))}
            {(!medicines || medicines.length === 0) && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div
                  className="medicine-icon-circle mb-3 h-12 w-12"
                  style={{ opacity: 0.5 }}
                >
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Niciun medicament adăugat.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
