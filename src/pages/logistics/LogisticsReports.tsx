import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const LogisticsReports = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const costByRoute = [
    { route: "SP→Proc", cost: 8500 },
    { route: "MG→Farm", cost: 6200 },
    { route: "GO→Proc", cost: 5800 },
    { route: "BA→MG", cost: 7100 },
    { route: "Proc→WH", cost: 3200 },
  ];

  const monthlyLoss = [
    { month: "Jan", loss: 0.8 },
    { month: "Fev", loss: 0.6 },
    { month: "Mar", loss: 0.5 },
    { month: "Abr", loss: 0.4 },
  ];

  const deliveriesPerDriver = [
    { driver: "Roberto", deliveries: 42 },
    { driver: "André", deliveries: 38 },
    { driver: "Marcos", deliveries: 35 },
    { driver: "Paulo", deliveries: 28 },
    { driver: "Lucas", deliveries: 13 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Relatórios de Logística" : "Logistics Reports"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Análises de custo, perda e desempenho" : "Cost, loss, and performance analytics"}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Custo por Rota (R$)" : "Cost by Route (R$)"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costByRoute}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="route" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={pt ? "Custo (R$)" : "Cost (R$)"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Tendência de Perda (%)" : "Loss Trend (%)"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyLoss}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name={pt ? "Perda %" : "Loss %"} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Entregas por Motorista" : "Deliveries per Driver"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deliveriesPerDriver} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="driver" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={70} />
                <Tooltip />
                <Bar dataKey="deliveries" fill="#10b981" radius={[0, 4, 4, 0]} name={pt ? "Entregas" : "Deliveries"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsReports;
