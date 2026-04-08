import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, MapPin, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";

const COLORS = ["hsl(var(--primary))", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const LogisticsDashboard = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const stats = [
    { label: pt ? "Total de Entregas" : "Total Deliveries", value: "156", icon: Truck, change: "+12%", color: "text-blue-500" },
    { label: pt ? "Em Trânsito" : "In Transit", value: "8", icon: MapPin, change: "3 urgentes", color: "text-orange-500" },
    { label: pt ? "Pendentes" : "Pending", value: "14", icon: Clock, change: pt ? "5 hoje" : "5 today", color: "text-yellow-500" },
    { label: pt ? "Entregues Hoje" : "Delivered Today", value: "6", icon: CheckCircle, change: "100%", color: "text-green-500" },
    { label: pt ? "Custo de Transporte" : "Transport Cost", value: "R$28.500", icon: Package, change: "-5%", color: "text-violet-500" },
    { label: pt ? "Perdas/Danos" : "Losses/Damages", value: "0.3%", icon: AlertTriangle, change: pt ? "Meta: <1%" : "Target: <1%", color: "text-red-500" },
  ];

  const weeklyDeliveries = [
    { day: pt ? "Seg" : "Mon", deliveries: 8, cost: 4200 },
    { day: pt ? "Ter" : "Tue", deliveries: 12, cost: 5800 },
    { day: pt ? "Qua" : "Wed", deliveries: 6, cost: 3100 },
    { day: pt ? "Qui" : "Thu", deliveries: 10, cost: 4900 },
    { day: pt ? "Sex" : "Fri", deliveries: 14, cost: 6500 },
    { day: pt ? "Sáb" : "Sat", deliveries: 4, cost: 2200 },
  ];

  const itemTypeData = [
    { name: pt ? "Peixes" : "Fish", value: 45 },
    { name: pt ? "Ovos" : "Eggs", value: 20 },
    { name: pt ? "Alevinos" : "Fry", value: 15 },
    { name: pt ? "Embalados" : "Packaged", value: 20 },
  ];

  const monthlyTrend = [
    { month: "Jan", deliveries: 120, cost: 22000 },
    { month: "Fev", deliveries: 135, cost: 24500 },
    { month: "Mar", deliveries: 148, cost: 26800 },
    { month: "Abr", deliveries: 156, cost: 28500 },
  ];

  const recentTransports = [
    { id: "TR-001", from: pt ? "Fazenda Silva - SP" : "Silva Farm - SP", to: pt ? "Processamento Central" : "Central Processing", item: pt ? "Peixes" : "Fish", qty: "1.200 kg", status: pt ? "Entregue" : "Delivered", driver: "Roberto Lima" },
    { id: "TR-002", from: pt ? "Incubatório - MG" : "Hatchery - MG", to: pt ? "Fazenda Santos" : "Santos Farm", item: pt ? "Alevinos" : "Fry", qty: "5.000 un", status: pt ? "Em Trânsito" : "In Transit", driver: "André Costa" },
    { id: "TR-003", from: pt ? "Fazenda Oliveira - GO" : "Oliveira Farm - GO", to: pt ? "Processamento Central" : "Central Processing", item: pt ? "Peixes" : "Fish", qty: "800 kg", status: pt ? "Pendente" : "Pending", driver: "—" },
    { id: "TR-004", from: pt ? "Reprodução - BA" : "Breeding - BA", to: pt ? "Incubatório - MG" : "Hatchery - MG", item: pt ? "Ovos" : "Eggs", qty: "50.000 un", status: pt ? "Entregue" : "Delivered", driver: "Marcos Silva" },
    { id: "TR-005", from: pt ? "Processamento" : "Processing", to: pt ? "Armazém Central" : "Central Warehouse", item: pt ? "Embalados" : "Packaged", qty: "600 kg", status: pt ? "Em Trânsito" : "In Transit", driver: "Paulo Mendes" },
  ];

  const statusColor = (s: string) => {
    if (s.includes("Entregue") || s.includes("Delivered")) return "bg-green-100 text-green-700";
    if (s.includes("Trânsito") || s.includes("Transit")) return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Painel de Logística" : "Logistics Dashboard"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Gestão de transporte e movimentação de produtos" : "Transport and product movement management"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-[10px] text-muted-foreground">{s.change}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Entregas Semanais & Custos" : "Weekly Deliveries & Costs"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyDeliveries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="deliveries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={pt ? "Entregas" : "Deliveries"} />
                <Bar yAxisId="right" dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} name={pt ? "Custo (R$)" : "Cost (R$)"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Tipo de Carga" : "Cargo Type"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={itemTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={renderPieLabel}>
                  {itemTypeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Tendência Mensal" : "Monthly Trend"}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Area type="monotone" dataKey="deliveries" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name={pt ? "Entregas" : "Deliveries"} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Transportes Recentes" : "Recent Transports"}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">{pt ? "Origem" : "From"}</th>
                <th className="text-left py-2 font-medium">{pt ? "Destino" : "To"}</th>
                <th className="text-left py-2 font-medium">{pt ? "Item" : "Item"}</th>
                <th className="text-left py-2 font-medium">{pt ? "Qtd" : "Qty"}</th>
                <th className="text-left py-2 font-medium">{pt ? "Motorista" : "Driver"}</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransports.map((t) => (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="py-2.5 font-mono text-xs">{t.id}</td>
                  <td className="py-2.5">{t.from}</td>
                  <td className="py-2.5">{t.to}</td>
                  <td className="py-2.5">{t.item}</td>
                  <td className="py-2.5">{t.qty}</td>
                  <td className="py-2.5">{t.driver}</td>
                  <td className="py-2.5"><Badge className={statusColor(t.status)} variant="secondary">{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
