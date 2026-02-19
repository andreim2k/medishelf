"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { StatusBadge } from "@/components/medishelf/status-badge";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Medicine } from "@/lib/types";
import { Loader2 } from "lucide-react";

const COLORS = {
  safe: "hsl(var(--success))",
  expiring_soon: "hsl(var(--warning))",
  expired: "hsl(var(--destructive))",
};

const TYPE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
];

export default function ReportsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const medicinesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "users", user.uid, "medicines");
  }, [firestore, user]);

  const { data: medicines, loading } = useCollection<Medicine>(medicinesQuery);

  const { expiryStatusData, medicineTypeData, expiringMedicines } =
    useMemo(() => {
      if (!medicines) {
        return {
          expiryStatusData: [],
          medicineTypeData: [],
          expiringMedicines: [],
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const statusCounts = { safe: 0, expiring_soon: 0, expired: 0 };
      const typeCounts: { [key: string]: number } = {};
      const expiringMeds: Medicine[] = [];

      medicines.forEach((med) => {
        const expiry = new Date(med.expiryDate);
        const diffDays = Math.ceil(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) {
          statusCounts.expired += 1;
          expiringMeds.push(med);
        } else if (diffDays <= 30) {
          statusCounts.expiring_soon += 1;
          expiringMeds.push(med);
        } else {
          statusCounts.safe += 1;
        }

        typeCounts[med.medicineType] = (typeCounts[med.medicineType] || 0) + 1;
      });

      const expiryStatusData = [
        { name: "Valabil", value: statusCounts.safe, color: COLORS.safe },
        {
          name: "Expiră în curând",
          value: statusCounts.expiring_soon,
          color: COLORS.expiring_soon,
        },
        { name: "Expirat", value: statusCounts.expired, color: COLORS.expired },
      ].filter((d) => d.value > 0);

      const medicineTypeData = Object.entries(typeCounts)
        .map(([name, value], index) => ({
          name,
          value,
          color: TYPE_COLORS[index % TYPE_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

      expiringMeds.sort(
        (a, b) =>
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );

      return {
        expiryStatusData,
        medicineTypeData,
        expiringMedicines: expiringMeds,
      };
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
          Rapoarte și Analize
        </h1>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card className="border bg-card/60 shadow-lg backdrop-blur-xl dark:bg-card/20">
          <CardHeader>
            <CardTitle>Sumar Status Inventar</CardTitle>
            <CardDescription>
              Distribuția medicamentelor după statusul de expirare.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Pie
                  data={expiryStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {expiryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border bg-card/60 shadow-lg backdrop-blur-xl dark:bg-card/20">
          <CardHeader>
            <CardTitle>Distribuție pe Tipuri</CardTitle>
            <CardDescription>
              Procentajul fiecărui tip de medicament din inventar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Pie
                  data={medicineTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {medicineTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconSize={10}
                  wrapperStyle={{ lineHeight: "20px", fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 border bg-card/60 shadow-lg backdrop-blur-xl dark:bg-card/20 md:mt-8">
        <CardHeader>
          <CardTitle>Medicamente Expirate sau pe Cale de a Expira</CardTitle>
          <CardDescription>
            Aceste medicamente necesită atenția ta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nume Medicament</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dată Expirare</TableHead>
                  <TableHead className="text-right">Cantitate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringMedicines.length > 0 ? (
                  expiringMedicines.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-medium">{med.name}</TableCell>
                      <TableCell>
                        <StatusBadge expiryDate={med.expiryDate} />
                      </TableCell>
                      <TableCell>
                        {format(parseISO(med.expiryDate), "d MMMM yyyy", {
                          locale: ro,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {med.quantity}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Niciun medicament nu este expirat sau pe cale de a
                      expira. Felicitări!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
