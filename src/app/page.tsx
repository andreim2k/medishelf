"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Activity, Users, CreditCard } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { initialMedicines } from "@/lib/data";

const generateChartData = () => [
  { name: "Ian", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Feb", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Mar", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Apr", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Mai", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Iun", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Iul", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Aug", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Sep", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Oct", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Nov", total: Math.floor(Math.random() * 5) + 1 },
  { name: "Dec", total: Math.floor(Math.random() * 5) + 1 },
];


export default function Home() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData(generateChartData());
  }, []);

  const expiringSoonCount = initialMedicines.filter((med) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(med.expiryDate);
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const expiredCount = initialMedicines.filter((med) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(med.expiryDate);
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays < 0;
  }).length;

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
            <div className="text-2xl font-bold">{initialMedicines.length}</div>
            <p className="text-xs text-muted-foreground">
              în inventarul dvs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiră în curând</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{expiredCount}</div>
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
            <div className="text-2xl font-bold">+2</div>
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
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
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
              Ați adăugat {initialMedicines.length} medicamente în total.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {initialMedicines.slice(0, 4).map((med) => (
              <div className="flex items-center" key={med.id}>
                <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium leading-none">{med.name}</p>
                  <p className="text-sm text-muted-foreground">{med.medicineType}</p>
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
