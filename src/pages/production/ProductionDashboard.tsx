import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Factory, PackageOpen, Scissors, Package, Warehouse, DollarSign, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const COLORS = ["hsl(var(--primary))", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const ProductionDashboard = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const stats = [
    { label: pt ? "Recebimento Hoje" : "Today's Intake", value: "45.800 kg", icon: PackageOpen, change: "+18%", color: "text-blue-500" },
    { label: pt ? "Em Processamento" : "Processing", value: "38.500 kg", icon: Scissors, change: "12 lotes", color: "text-orange-500" },
    { label: pt ? "Embalados" : "Packaged", value: "28.600 kg", icon: Package, change: pt ? "14.300 pacotes" : "14,300 packs", color: "text-green-500" },
    { label: pt ? "Em Estoque" : "In Storage", value: "125.000 kg", icon: Warehouse, change: pt ? "78% capacidade" : "78% capacity", color: "text-violet-500" },
    { label: pt ? "Vendas do Mês" : "Month Sales", value: "R$13,8M", icon: DollarSign, change: "+22%", color: "text-emerald-500" },
    { label: pt ? "Lucro Líquido" : "Net Profit", value: "R$5,2M", icon: TrendingUp, change: "+18%", color: "text-cyan-500" },
  ];

  const weeklyProcessing = [
    { day: pt ? "Seg" : "Mon", intake: 42000, output: 31500, waste: 6300 },
    { day: pt ? "Ter" : "Tue", intake: 48000, output: 36000, waste: 7200 },
    { day: pt ? "Qua" : "Wed", intake: 39000, output: 29250, waste: 5850 },
    { day: pt ? "Qui" : "Thu", intake: 46000, output: 34500, waste: 6900 },
    { day: pt ? "Sex" : "Fri", intake: 52000, output: 39000, waste: 7800 },
  ];

  const productMix = [
    { name: pt ? "Tilápia Inteira" : "Whole Tilapia", value: 35 },
    { name: pt ? "Filé de Tilápia" : "Tilapia Fillet", value: 40 },
    { name: pt ? "Congelado" : "Frozen Pack", value: 15 },
    { name: pt ? "Subprodutos" : "By-products", value: 10 },
  ];

  const profitTrend = [
    { month: "Jan", revenue: 8200000, cost: 4900000, profit: 3300000 },
    { month: "Fev", revenue: 9500000, cost: 5700000, profit: 3800000 },
    { month: "Mar", revenue: 11200000, cost: 6700000, profit: 4500000 },
    { month: "Abr", revenue: 13800000, cost: 8600000, profit: 5200000 },
  ];

  const recentBatches = [
    { id: "PB-601", source: "Carlos Silva - SP", qty: "8.500 kg", grade: "A", product: pt ? "Filé Premium" : "Premium Fillet", output: "5.525 kg", yield: "65%", status: pt ? "Concluído" : "Completed", fishType: pt ? "Tilápia Nilo" : "Nile Tilapia" },
    { id: "PB-602", source: "João Santos - MG", qty: "6.200 kg", grade: "A+", product: pt ? "Tilápia Inteira" : "Whole Tilapia", output: "5.580 kg", yield: "90%", status: pt ? "Concluído" : "Completed", fishType: pt ? "Tilápia GIFT" : "GIFT Tilapia" },
    { id: "PB-603", source: "Pedro Oliveira - GO", qty: "12.000 kg", grade: "B", product: pt ? "Filé / Congelado" : "Fillet / Frozen", output: "—", yield: "—", status: pt ? "Processando" : "Processing", fishType: "Tambaqui" },
    { id: "PB-604", source: "Rafael Costa - BA", qty: "5.800 kg", grade: "—", product: "—", output: "—", yield: "—", status: pt ? "Recebido" : "Received", fishType: pt ? "Tilápia Nilo" : "Nile Tilapia" },
  ];

  const statusColor = (s: string) => {
    if (s.includes("Concluído") || s.includes("Completed")) return "bg-green-100 text-green-700";
    if (s.includes("Processando") || s.includes("Processing")) return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Painel de Produção" : "Production Dashboard"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Processamento, embalagem e vendas em tempo real" : "Processing, packaging, and sales in real-time"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <Card key={i}><CardContent className="p-4">
            <div className="flex items-center justify-between mb-2"><s.icon className={`w-5 h-5 ${s.color}`} /><span className="text-[10px] text-muted-foreground">{s.change}</span></div>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Processamento Semanal (kg)" : "Weekly Processing (kg)"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyProcessing}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip />
                <Bar dataKey="intake" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={pt ? "Entrada" : "Intake"} />
                <Bar dataKey="output" fill="#10b981" radius={[4, 4, 0, 0]} name={pt ? "Saída" : "Output"} />
                <Bar dataKey="waste" fill="#ef4444" radius={[4, 4, 0, 0]} name={pt ? "Resíduo" : "Waste"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Estágio dos Peixes" : "Fish Stage"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={productMix} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={renderPieLabel}>
                  {productMix.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Tendência de Receita & Lucro (R$)" : "Revenue & Profit Trend (R$)"}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={profitTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => `R$${(v/1000000).toFixed(2)}M`} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name={pt ? "Receita" : "Revenue"} />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name={pt ? "Lucro" : "Profit"} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Lotes Recentes" : "Recent Batches"}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 font-medium">ID</th>
              <th className="text-left py-2 font-medium">{pt ? "Origem" : "Source"}</th>
              <th className="text-left py-2 font-medium">{pt ? "Espécie" : "Species"}</th>
              <th className="text-left py-2 font-medium">{pt ? "Entrada" : "Intake"}</th>
              <th className="text-left py-2 font-medium">{pt ? "Classe" : "Grade"}</th>
              <th className="text-left py-2 font-medium">{pt ? "Produto" : "Product"}</th>
              <th className="text-left py-2 font-medium">{pt ? "Saída" : "Output"}</th>
              <th className="text-left py-2 font-medium">{pt ? "Rendimento" : "Yield"}</th>
              <th className="text-left py-2 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {recentBatches.map(b => (
                <tr key={b.id} className="border-b border-border/50">
                  <td className="py-2.5 font-mono text-xs">{b.id}</td>
                  <td className="py-2.5">{b.source}</td>
                  <td className="py-2.5"><Badge variant="secondary" className="text-xs">{b.fishType}</Badge></td>
                  <td className="py-2.5">{b.qty}</td>
                  <td className="py-2.5"><Badge variant="secondary">{b.grade}</Badge></td>
                  <td className="py-2.5">{b.product}</td>
                  <td className="py-2.5">{b.output}</td>
                  <td className="py-2.5">{b.yield}</td>
                  <td className="py-2.5"><Badge className={statusColor(b.status)} variant="secondary">{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionDashboard;
