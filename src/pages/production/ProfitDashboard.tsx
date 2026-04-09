import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6"];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const ProfitDashboard = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const profitData = [
    { month: "Jan", revenue: 8200000, transport: 520000, processing: 1850000, packaging: 680000, other: 350000, profit: 4800000 },
    { month: "Fev", revenue: 9500000, transport: 610000, processing: 2100000, packaging: 750000, other: 400000, profit: 5640000 },
    { month: "Mar", revenue: 11200000, transport: 720000, processing: 2450000, packaging: 890000, other: 480000, profit: 6660000 },
    { month: "Abr", revenue: 13800000, transport: 850000, processing: 2980000, packaging: 1050000, other: 520000, profit: 8400000 },
  ];

  const costBreakdown = [
    { name: pt ? "Transporte" : "Transport", value: 850000 },
    { name: pt ? "Processamento" : "Processing", value: 2980000 },
    { name: pt ? "Embalagem" : "Packaging", value: 1050000 },
    { name: pt ? "Outros" : "Other", value: 520000 },
  ];

  const latest = profitData[profitData.length - 1];
  const totalCost = latest.transport + latest.processing + latest.packaging + latest.other;
  const margin = ((latest.profit / latest.revenue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Análise de Lucro" : "Profit Analysis"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Receita, custos e lucro líquido" : "Revenue, costs, and net profit"}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-5 h-5 text-green-500" /><span className="text-xs text-muted-foreground">{pt ? "Receita" : "Revenue"}</span></div><p className="text-xl font-bold">R${(latest.revenue / 1000000).toFixed(1)}M</p><p className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+23.2%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><TrendingDown className="w-5 h-5 text-red-500" /><span className="text-xs text-muted-foreground">{pt ? "Custos" : "Costs"}</span></div><p className="text-xl font-bold">R${(totalCost / 1000000).toFixed(1)}M</p><p className="text-xs text-red-500">+8.5%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-5 h-5 text-emerald-500" /><span className="text-xs text-muted-foreground">{pt ? "Lucro Líquido" : "Net Profit"}</span></div><p className="text-xl font-bold">R${(latest.profit / 1000000).toFixed(1)}M</p><p className="text-xs text-emerald-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+26.1%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Percent className="w-5 h-5 text-blue-500" /><span className="text-xs text-muted-foreground">{pt ? "Margem" : "Margin"}</span></div><p className="text-xl font-bold">{margin}%</p><p className="text-xs text-blue-500">{pt ? "Meta: 65%" : "Target: 65%"}</p></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Receita vs Lucro (R$)" : "Revenue vs Profit (R$)"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => `R$${(v/1000000).toFixed(2)}M`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name={pt ? "Receita" : "Revenue"} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name={pt ? "Lucro" : "Profit"} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Detalhamento de Custos" : "Cost Breakdown"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={costBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={renderPieLabel}>
                  {costBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `R$${(v/1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Custos Mensais Detalhados (R$)" : "Monthly Cost Details (R$)"}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => `R$${(v/1000).toFixed(0)}K`} />
              <Bar dataKey="transport" stackId="cost" fill="#f59e0b" name={pt ? "Transporte" : "Transport"} />
              <Bar dataKey="processing" stackId="cost" fill="#ef4444" name={pt ? "Processamento" : "Processing"} />
              <Bar dataKey="packaging" stackId="cost" fill="#8b5cf6" name={pt ? "Embalagem" : "Packaging"} />
              <Bar dataKey="other" stackId="cost" fill="#6b7280" name={pt ? "Outros" : "Other"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitDashboard;
