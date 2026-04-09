import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Fish, Egg, Users, Factory, TrendingUp, TrendingDown, AlertTriangle, Package,
  Droplets, Activity, Thermometer, Target, Calendar, ArrowUpRight, Clock, CheckCircle2, Zap,
  Truck, DollarSign, Warehouse
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="hsl(210,18%,40%)" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const COLORS = ["hsl(199,89%,32%)", "hsl(168,60%,42%)", "hsl(38,92%,50%)", "hsl(199,89%,48%)", "hsl(152,60%,40%)"];

const monthlyData = [
  { month: "Out", production: 42000, mortality: 320, revenue: 8200 },
  { month: "Nov", production: 48000, mortality: 280, revenue: 9500 },
  { month: "Dez", production: 51000, mortality: 250, revenue: 8800 },
  { month: "Jan", production: 58000, mortality: 210, revenue: 11000 },
  { month: "Fev", production: 64000, mortality: 190, revenue: 12500 },
  { month: "Mar", production: 72000, mortality: 170, revenue: 13800 },
];

const stageData = [
  { name_en: "Breeding", name_pt: "Reprodução", value: 15 },
  { name_en: "Larval", name_pt: "Larval", value: 25 },
  { name_en: "Fry", name_pt: "Alevinos", value: 30 },
  { name_en: "Juvenile", name_pt: "Juvenil", value: 20 },
  { name_en: "Grow-out", name_pt: "Engorda", value: 10 },
];

const fcrData = [
  { month: "Out", fcr: 1.9 }, { month: "Nov", fcr: 1.8 }, { month: "Dez", fcr: 1.7 },
  { month: "Jan", fcr: 1.6 }, { month: "Fev", fcr: 1.55 }, { month: "Mar", fcr: 1.5 },
];

const waterQuality = [
  { pond: "P-1", temp: 28.5, ph: 7.2, do2: 6.8, status: "Good" },
  { pond: "P-3", temp: 29.1, ph: 7.0, do2: 6.5, status: "Good" },
  { pond: "P-7", temp: 31.2, ph: 6.8, do2: 5.9, status: "Warning" },
  { pond: "A-3", temp: 28.8, ph: 7.1, do2: 7.0, status: "Good" },
  { pond: "B-2", temp: 27.5, ph: 7.3, do2: 7.2, status: "Excellent" },
];

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const pt = language === "pt";

  const stats = [
    { label: t("activeBatches"), value: "248", change: "+18", trend: "up", icon: Fish, color: "text-primary" },
    { label: t("eggsThisMonth"), value: "2.85M", change: "+12,6%", trend: "up", icon: Egg, color: "text-accent" },
    { label: t("activeFarmers"), value: "186", change: "+14", trend: "up", icon: Users, color: "text-info" },
    { label: t("processingToday"), value: "45.800 kg", change: "+22%", trend: "up", icon: Factory, color: "text-warning" },
    { label: t("avgSurvivalRate"), value: "94.2%", change: "+3.1%", trend: "up", icon: Target, color: "text-success" },
    { label: t("revenueMTD"), value: "R$13,8M", change: "+18,4%", trend: "up", icon: TrendingUp, color: "text-primary" },
  ];

  // Logistics Summary
  const logisticsStats = [
    { label: pt ? "Entregas Este Mês" : "Deliveries This Month", value: "1.560", icon: Truck, color: "text-blue-500" },
    { label: pt ? "Em Trânsito" : "In Transit", value: "42", icon: Truck, color: "text-orange-500" },
    { label: pt ? "Custo Logístico" : "Logistics Cost", value: "R$2,85M", icon: DollarSign, color: "text-violet-500" },
  ];

  // Production Summary
  const productionStats = [
    { label: pt ? "Produção do Mês" : "Month Production", value: "385.000 kg", icon: Factory, color: "text-green-500" },
    { label: pt ? "Estoque Atual" : "Current Stock", value: "125.000 kg", icon: Warehouse, color: "text-cyan-500" },
    { label: pt ? "Lucro Líquido" : "Net Profit", value: "R$5,2M", icon: TrendingUp, color: "text-emerald-500" },
  ];

  const profitTrend = [
    { month: "Jan", revenue: 8200000, profit: 3200000 },
    { month: "Fev", revenue: 9500000, profit: 3800000 },
    { month: "Mar", revenue: 11200000, profit: 4500000 },
    { month: "Abr", revenue: 13800000, profit: 5200000 },
  ];

  const alerts = [
    { type: "danger", msg: t("highMortalityAlert"), time: "15m" },
    { type: "warning", msg: t("lowFeedStockAlert"), time: "2h" },
    { type: "warning", msg: t("waterTempSpikeAlert"), time: "3h" },
    { type: "info", msg: t("harvestScheduledAlert"), time: "5h" },
    { type: "info", msg: t("batchTransferredAlert"), time: "2d" },
  ];

  const recentActivity = [
    { action: t("farmerDailyUpdate"), by: "Carlos Silva", time: "30 min", icon: CheckCircle2 },
    { action: t("newBatchStarted"), by: "Sistema", time: "1 hora", icon: Zap },
    { action: t("processingBatchCompleted"), by: "Admin", time: "2 horas", icon: Package },
    { action: t("feedDeliveryReceived"), by: "Sistema", time: "4 horas", icon: ArrowUpRight },
    { action: t("farmerPaymentProcessedDash"), by: "Admin", time: language === "pt" ? "Ontem" : "Yesterday", icon: TrendingUp },
  ];

  const topFarmers = [
    { name: "Pedro Oliveira", score: 97, production: "125.000 kg" },
    { name: "Carlos Silva", score: 94, production: "98.200 kg" },
    { name: "João Santos", score: 91, production: "84.800 kg" },
    { name: "Rafael Costa", score: 88, production: "72.500 kg" },
  ];

  const statusMap: Record<string, string> = {
    Good: t("good"),
    Warning: t("warning"),
    Excellent: t("excellent"),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{t("dashboard")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("dashboardWelcome")}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{t("lastUpdated")}: {new Date().toLocaleDateString(language === "pt" ? "pt-BR" : "en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
                  <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${s.trend === "up" ? "text-success" : "text-destructive"}`}>
                    {s.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.change}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logistics & Production Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2"><Truck className="w-4 h-4 text-blue-500" /> {pt ? "Resumo Logístico" : "Logistics Summary"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {logisticsStats.map(s => (
                <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2"><Factory className="w-4 h-4 text-green-500" /> {pt ? "Resumo de Produção" : "Production Summary"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {productionStats.map(s => (
                <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">{t("productionRevenueTrends")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="production" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.12} name={t("productionKg")} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(168,60%,42%)" fill="hsl(168,60%,42%)" fillOpacity={0.1} name={t("revenueK")} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">{t("fishByStage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3} label={renderPieLabel}>
                  {stageData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {stageData.map((s, i) => (
                <div key={s.name_en} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{language === "pt" ? s.name_pt : s.name_en}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Trend */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">{pt ? "Receita vs Lucro (R$)" : "Revenue vs Profit (R$)"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={profitTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => `R$${(v/1000000).toFixed(2)}M`} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.12} name={pt ? "Receita" : "Revenue"} />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name={pt ? "Lucro" : "Profit"} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("fcrTrend")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fcrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis domain={[1.2, 2.2]} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="fcr" stroke="hsl(199,89%,32%)" strokeWidth={2} dot={{ fill: "hsl(199,89%,32%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("mortalityTrendCount")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="mortality" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("topFarmers")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topFarmers.map((f, i) => (
              <div key={f.name} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>#{i + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.production}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={f.score} className="w-12 h-2" />
                  <span className="text-xs font-bold text-foreground">{f.score}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2"><Droplets className="w-4 h-4 text-primary" /> {t("waterQuality")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {waterQuality.map((w) => (
              <div key={w.pond} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 text-sm">
                <span className="font-medium text-foreground">{w.pond}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{w.temp}°C</span>
                  <span>pH {w.ph}</span>
                  <span>DO {w.do2}</span>
                </div>
                <Badge variant={w.status === "Excellent" ? "default" : w.status === "Warning" ? "destructive" : "secondary"} className="text-xs">{statusMap[w.status]}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2"><Clock className="w-4 h-4 text-info" /> {t("recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <a.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.by} · {a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> {t("recentAlerts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg ${
                a.type === "danger" ? "bg-destructive/10" : a.type === "warning" ? "bg-warning/10" : "bg-info/10"
              }`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                  a.type === "danger" ? "text-destructive" : a.type === "warning" ? "text-warning" : "text-info"
                }`} />
                <div>
                  <p className="text-xs text-foreground">{a.msg}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
