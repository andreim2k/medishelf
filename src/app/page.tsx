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
        } catch (e) {
        }
        return acc;
    }, {} as Record<number, number>);

    return monthNames.map((name, index) => ({
        name,
        total: monthlyCounts[index] || 0
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
        } catch(e) {
            // Ignore records with invalid dates
        }
        
        return acc;
      },
      { expiringSoonCount: 0, expiredCount: 0, addedThisMonthCount: 0 }
    );
  }, [medicines]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Panou de control
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Medicamente
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicines?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              în inventarul dvs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expiră în curând
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">
              în următoarele 30 de zile
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirate</CardTitle>
            <AlertOctagon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {expiredCount}
            </div>
            <p className="text-xs text-muted-foreground">
              medicamente sunt expirate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activitate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{addedThisMonthCount}</div>
            <p className="text-xs text-muted-foreground">
              adăugări în această lună
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Rezumat Adăugări</CardTitle>
            <CardDescription>
              Numărul de medicamente adăugate pe lună.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))", opacity: 0.5 }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adăugate Recent</CardTitle>
            <CardDescription>
              Ați adăugat {medicines?.length || 0} medicamente în total.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicines?.slice(0, 4).map((med) => (
              <div className="flex items-center" key={med.id}>
                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <MedicineTypeIcon type={med.medicineType} className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium leading-none">{med.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {med.medicineType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">x{med.quantity}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
