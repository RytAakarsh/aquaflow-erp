import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Egg, Bug, Waves, Factory, Package, DollarSign, BarChart3, Bell,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock,
  Thermometer, Droplets, Activity, Fish, Pill, Scale, Scissors,
  ArrowUpRight, ArrowDownRight, Calendar, Target, Zap, Shield
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ["hsl(199,89%,32%)", "hsl(168,60%,42%)", "hsl(38,92%,50%)", "hsl(199,89%,48%)", "hsl(152,60%,40%)", "hsl(0,72%,51%)"];

// ============ BREEDING ============
const broodstockData = [
  { id: "BS-001", strain: "GIFT Tilápia", age_en: "18 months", age_pt: "18 meses", weight: "1,2 kg", status_en: "Breeding", status_pt: "Reprodução", eggs: 2400 },
  { id: "BS-002", strain: "Tilápia do Nilo", age_en: "24 months", age_pt: "24 meses", weight: "1,5 kg", status_en: "Resting", status_pt: "Descanso", eggs: 0 },
  { id: "BS-003", strain: "GIFT Tilápia", age_en: "20 months", age_pt: "20 meses", weight: "1,3 kg", status_en: "Breeding", status_pt: "Reprodução", eggs: 1800 },
  { id: "BS-004", strain: "Tilápia Vermelha", age_en: "16 months", age_pt: "16 meses", weight: "1,1 kg", status_en: "Conditioning", status_pt: "Condicionamento", eggs: 0 },
  { id: "BS-005", strain: "Tilápia do Nilo", age_en: "22 months", age_pt: "22 meses", weight: "1,4 kg", status_en: "Breeding", status_pt: "Reprodução", eggs: 3200 },
];

const eggProductionMonthly = [
  { month: "Out", eggs: 18500, hatchRate: 82 },
  { month: "Nov", eggs: 22000, hatchRate: 85 },
  { month: "Dez", eggs: 19800, hatchRate: 79 },
  { month: "Jan", eggs: 24500, hatchRate: 88 },
  { month: "Fev", eggs: 26000, hatchRate: 91 },
  { month: "Mar", eggs: 28500, hatchRate: 89 },
];

export const Breeding = () => {
  const { t, language } = useLanguage();
  const breedingStats = [
    { label: t("activeBroodstock"), value: "48", icon: Fish, color: "text-primary", change: "+5" },
    { label: t("eggsThisMonth"), value: "28.500", icon: Egg, color: "text-accent", change: "+9,6%" },
    { label: t("avgHatchRate"), value: "89%", icon: Target, color: "text-success", change: "+2%" },
    { label: t("nextSpawnCycle"), value: `3 ${t("days")}`, icon: Calendar, color: "text-warning", change: "" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("breedingManagement")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("breedingDesc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {breedingStats.map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  {s.change && <span className="text-xs font-medium text-success flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" />{s.change}</span>}
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("eggProductionHatchRate")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={eggProductionMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="eggs" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.15} />
                <Area type="monotone" dataKey="hatchRate" stroke="hsl(168,60%,42%)" fill="hsl(168,60%,42%)" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("strainDistribution")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[{ name: "GIFT", value: 22 }, { name: "Nilo", value: 18 }, { name: "Vermelha", value: 8 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {[0, 1, 2].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {["GIFT Tilápia", "Tilápia do Nilo", "Tilápia Vermelha"].map((n, i) => (
                <div key={n} className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} /><span className="text-muted-foreground">{n}</span></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("broodstockRegistry")}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">{t("id")}</th><th className="text-left py-3 px-2 font-medium">{t("strain")}</th><th className="text-left py-3 px-2 font-medium">{t("age")}</th><th className="text-left py-3 px-2 font-medium">{t("weight")}</th><th className="text-left py-3 px-2 font-medium">{t("status")}</th><th className="text-right py-3 px-2 font-medium">{t("eggs")}</th>
              </tr></thead>
              <tbody>
                {broodstockData.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{b.id}</td>
                    <td className="py-3 px-2 text-foreground">{b.strain}</td>
                    <td className="py-3 px-2 text-muted-foreground">{language === "pt" ? b.age_pt : b.age_en}</td>
                    <td className="py-3 px-2 text-muted-foreground">{b.weight}</td>
                    <td className="py-3 px-2"><Badge variant={b.status_en === "Breeding" ? "default" : "secondary"} className="text-xs">{language === "pt" ? b.status_pt : b.status_en}</Badge></td>
                    <td className="py-3 px-2 text-right font-medium text-foreground">{b.eggs.toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ HATCHERY ============
const tankData = [
  { id: "T-01", capacity: "500L", species: "GIFT", stage_en: "Eggs", stage_pt: "Ovos", count: 12000, temp: 28.5, survival: 92, daysLeft: 3 },
  { id: "T-02", capacity: "500L", species: "Nilo", stage_en: "Larvae", stage_pt: "Larvas", count: 8500, temp: 27.8, survival: 88, daysLeft: 7 },
  { id: "T-03", capacity: "1000L", species: "GIFT", stage_en: "Larvae", stage_pt: "Larvas", count: 15200, temp: 28.2, survival: 90, daysLeft: 5 },
  { id: "T-04", capacity: "500L", species: "Vermelha", stage_en: "Eggs", stage_pt: "Ovos", count: 6000, temp: 29.0, survival: 85, daysLeft: 4 },
  { id: "T-05", capacity: "1000L", species: "Nilo", stage_en: "Pre-Fry", stage_pt: "Pré-Alevino", count: 9800, temp: 28.0, survival: 94, daysLeft: 2 },
];

const hatcherySurvival = [
  { day: "D1", survival: 100 }, { day: "D3", survival: 96 }, { day: "D5", survival: 93 },
  { day: "D7", survival: 91 }, { day: "D10", survival: 89 }, { day: "D14", survival: 87 },
  { day: "D21", survival: 85 }, { day: "D28", survival: 83 },
];

export const Hatchery = () => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("hatcheryModule")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("hatcheryDesc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("activeTanks"), value: "12", icon: Droplets, color: "text-primary" },
          { label: t("totalLarvae"), value: "51.500", icon: Bug, color: "text-accent" },
          { label: t("avgSurvival"), value: "90%", icon: Shield, color: "text-success" },
          { label: t("avgTemp"), value: "28,3°C", icon: Thermometer, color: "text-warning" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("survivalRateCurve")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={hatcherySurvival}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis domain={[75, 100]} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="survival" stroke="hsl(168,60%,42%)" strokeWidth={2} dot={{ fill: "hsl(168,60%,42%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("feedingScheduleToday")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { time: "06:00", feed: "Artemia nauplii", tanks: "T-02, T-03", done: true },
              { time: "10:00", feed: "Micro pellets", tanks: "T-05", done: true },
              { time: "14:00", feed: "Artemia nauplii", tanks: "T-02, T-03", done: false },
              { time: "18:00", feed: "Micro pellets", tanks: language === "pt" ? "Todos tanques" : "All tanks", done: false },
              { time: "22:00", feed: language === "pt" ? "Mix de alimento vivo" : "Live feed mix", tanks: "T-01, T-04", done: false },
            ].map((f, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${f.done ? "bg-success/10" : "bg-muted"}`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${f.done ? "text-success" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${f.done ? "text-muted-foreground" : "text-foreground"}`}>{f.time} — {f.feed}</p>
                  <p className="text-xs text-muted-foreground">{f.tanks}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("tankStatus")}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">{t("tank")}</th><th className="text-left py-3 px-2 font-medium">{t("species")}</th><th className="text-left py-3 px-2 font-medium">{t("stage")}</th><th className="text-right py-3 px-2 font-medium">{t("count")}</th><th className="text-right py-3 px-2 font-medium">{t("temp")}</th><th className="text-right py-3 px-2 font-medium">{t("survival")}</th><th className="text-right py-3 px-2 font-medium">{t("daysLeft")}</th>
              </tr></thead>
              <tbody>
                {tankData.map((tk) => (
                  <tr key={tk.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{tk.id}</td>
                    <td className="py-3 px-2 text-foreground">{tk.species}</td>
                    <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{language === "pt" ? tk.stage_pt : tk.stage_en}</Badge></td>
                    <td className="py-3 px-2 text-right text-foreground">{tk.count.toLocaleString("pt-BR")}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{tk.temp}°C</td>
                    <td className="py-3 px-2 text-right"><span className={tk.survival >= 90 ? "text-success" : "text-warning"}>{tk.survival}%</span></td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{tk.daysLeft}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ NURSERY ============
const nurseryBatches = [
  { id: "NB-2401", source: "Incubatório T-01", count: 10500, avgWeight: "0,8g", stage_en: "Fry", stage_pt: "Alevino", growthRate: "+12%", pond: "N-A1", daysInNursery: 21 },
  { id: "NB-2402", source: "Incubatório T-03", count: 14200, avgWeight: "1,2g", stage_en: "Fry", stage_pt: "Alevino", growthRate: "+15%", pond: "N-A2", daysInNursery: 28 },
  { id: "NB-2403", source: "Incubatório T-05", count: 8800, avgWeight: "0,5g", stage_en: "Early Fry", stage_pt: "Alevino Inicial", growthRate: "+8%", pond: "N-B1", daysInNursery: 14 },
  { id: "NB-2404", source: "Incubatório T-02", count: 7600, avgWeight: "2,1g", stage_en: "Late Fry", stage_pt: "Alevino Tardio", growthRate: "+18%", pond: "N-B2", daysInNursery: 42 },
  { id: "NB-2405", source: language => language === "pt" ? "Lote Parceiro" : "Partner Batch", count: 5000, avgWeight: "1,8g", stage_en: "Fry", stage_pt: "Alevino", growthRate: "+10%", pond: "N-C1", daysInNursery: 35 },
];

const nurseryGrowth = [
  { week: "S1", weight: 0.2 }, { week: "S2", weight: 0.5 }, { week: "S3", weight: 0.8 },
  { week: "S4", weight: 1.2 }, { week: "S5", weight: 1.8 }, { week: "S6", weight: 2.5 },
  { week: "S7", weight: 3.2 }, { week: "S8", weight: 4.0 },
];

export const Nursery = () => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("nurseryModule")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("nurseryDesc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("activeBatches"), value: "5", icon: Waves, color: "text-primary" },
          { label: t("totalFry"), value: "46.100", icon: Fish, color: "text-accent" },
          { label: t("avgGrowth"), value: "+12,6%", icon: TrendingUp, color: "text-success" },
          { label: t("readyToTransfer"), value: "2", icon: ArrowUpRight, color: "text-info" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("growthCurve")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={nurseryGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="weight" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("recentTransfers")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { batch: "NB-2399", from: "Berçário N-A1", to: "Tanque P-3", count: language === "pt" ? "9.200 alevinos" : "9,200 fry", date: "24 Mar" },
              { batch: "NB-2398", from: "Berçário N-B2", to: "Tanque P-7", count: language === "pt" ? "11.000 alevinos" : "11,000 fry", date: "20 Mar" },
              { batch: "NB-2396", from: "Berçário N-C1", to: language === "pt" ? "Fazenda Parceira" : "Partner Farm", count: language === "pt" ? "5.500 alevinos" : "5,500 fry", date: "18 Mar" },
              { batch: "NB-2395", from: "Berçário N-A2", to: "Tanque P-1", count: language === "pt" ? "8.400 alevinos" : "8,400 fry", date: "15 Mar" },
            ].map((tr, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tr.batch}: {tr.count}</p>
                  <p className="text-xs text-muted-foreground">{tr.from} → {tr.to} · {tr.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("nurseryBatches")}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">{t("batch")}</th><th className="text-left py-3 px-2 font-medium">{t("source")}</th><th className="text-left py-3 px-2 font-medium">{t("pond")}</th><th className="text-right py-3 px-2 font-medium">{t("count")}</th><th className="text-right py-3 px-2 font-medium">{t("avgWt")}</th><th className="text-left py-3 px-2 font-medium">{t("stage")}</th><th className="text-right py-3 px-2 font-medium">{t("growth")}</th>
              </tr></thead>
              <tbody>
                {nurseryBatches.slice(0, 4).map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{b.id}</td>
                    <td className="py-3 px-2 text-muted-foreground">{b.source}</td>
                    <td className="py-3 px-2 text-foreground">{b.pond}</td>
                    <td className="py-3 px-2 text-right text-foreground">{b.count.toLocaleString("pt-BR")}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{b.avgWeight}</td>
                    <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{language === "pt" ? b.stage_pt : b.stage_en}</Badge></td>
                    <td className="py-3 px-2 text-right text-success font-medium">{b.growthRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ PROCESSING ============
const processingDaily = [
  { day: "Seg", intake: 850, output: 620, waste: 95 },
  { day: "Ter", intake: 920, output: 680, waste: 88 },
  { day: "Qua", intake: 780, output: 570, waste: 82 },
  { day: "Qui", intake: 1050, output: 780, waste: 110 },
  { day: "Sex", intake: 960, output: 720, waste: 92 },
  { day: "Sáb", intake: 1100, output: 830, waste: 105 },
];

const gradeDistribution = [
  { name: "Premium (A+)", value: 35 }, { name: "Classe A", value: 30 },
  { name: "Classe B", value: 20 }, { name: "Classe C", value: 10 }, { name: "Rejeitado", value: 5 },
];

export const Processing = () => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("processingModule")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("processingDesc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("todaysIntake"), value: "1.100 kg", icon: Scale, color: "text-primary" },
          { label: t("outputProducts"), value: "830 kg", icon: Package, color: "text-accent" },
          { label: t("yieldRate"), value: "75,5%", icon: Target, color: "text-success" },
          { label: t("waste"), value: "105 kg", icon: Scissors, color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("weeklyIntakeVsOutput")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={processingDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="intake" fill="hsl(199,89%,32%)" radius={[4, 4, 0, 0]} name={t("intake")} />
                <Bar dataKey="output" fill="hsl(168,60%,42%)" radius={[4, 4, 0, 0]} name={t("output")} />
                <Bar dataKey="waste" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} name={t("waste")} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("qualityGradeDistribution")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {gradeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {gradeDistribution.map((g, i) => (
                <div key={g.name} className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} /><span className="text-muted-foreground">{g.name}</span></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("recentProcessingBatches")}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">{t("batch")}</th><th className="text-left py-3 px-2 font-medium">{t("source")}</th><th className="text-right py-3 px-2 font-medium">{t("intake")}</th><th className="text-right py-3 px-2 font-medium">{t("output")}</th><th className="text-right py-3 px-2 font-medium">{t("yieldPercent")}</th><th className="text-left py-3 px-2 font-medium">{t("grade")}</th><th className="text-left py-3 px-2 font-medium">{t("date")}</th>
              </tr></thead>
              <tbody>
                {[
                  { batch: "PB-501", source: "Tanque P-3", intake: 450, output: 340, yield: "75,6%", grade: "A+", date: "27 Mar" },
                  { batch: "PB-500", source: "Tanque P-7", intake: 380, output: 280, yield: "73,7%", grade: "A", date: "26 Mar" },
                  { batch: "PB-499", source: language === "pt" ? "Fazenda Parceira" : "Partner Farm", intake: 520, output: 400, yield: "76,9%", grade: "A+", date: "25 Mar" },
                  { batch: "PB-498", source: "Tanque P-1", intake: 290, output: 210, yield: "72,4%", grade: "B", date: "24 Mar" },
                ].map((b) => (
                  <tr key={b.batch} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{b.batch}</td>
                    <td className="py-3 px-2 text-muted-foreground">{b.source}</td>
                    <td className="py-3 px-2 text-right text-foreground">{b.intake}</td>
                    <td className="py-3 px-2 text-right text-foreground">{b.output}</td>
                    <td className="py-3 px-2 text-right text-success">{b.yield}</td>
                    <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{b.grade}</Badge></td>
                    <td className="py-3 px-2 text-muted-foreground">{b.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ INVENTORY ============
const feedStock = [
  { name: language => language === "pt" ? "Ração Flutuante (3mm)" : "Floating Pellets (3mm)", qty: 2500, unit: "kg", capacity: 5000, reorder: 1000, status: "ok" },
  { name: language => language === "pt" ? "Ração Afundante (5mm)" : "Sinking Pellets (5mm)", qty: 800, unit: "kg", capacity: 3000, reorder: 1000, status: "low" },
  { name: () => "Artemia Cysts", qty: 45, unit: "kg", capacity: 100, reorder: 20, status: "ok" },
  { name: () => "Micro Pellets (0,5mm)", qty: 12, unit: "kg", capacity: 50, reorder: 15, status: "critical" },
  { name: language => language === "pt" ? "Mix de Alimento Vivo" : "Live Feed Mix", qty: 180, unit: "L", capacity: 500, reorder: 100, status: "ok" },
];

const medicineStock = [
  { name: language => language === "pt" ? "Oxitetraciclina" : "Oxytetracycline", qty: 25, unit: "kg", expiry: language => language === "pt" ? "Set 2026" : "Sep 2026", status: "ok" },
  { name: language => language === "pt" ? "Permanganato de Potássio" : "Potassium Permanganate", qty: 8, unit: "kg", expiry: () => "Dez 2026", status: "ok" },
  { name: language => language === "pt" ? "Solução de Formalina" : "Formalin Solution", qty: 3, unit: "L", expiry: () => "Jun 2026", status: "low" },
  { name: language => language === "pt" ? "Sal (NaCl)" : "Salt (NaCl)", qty: 500, unit: "kg", expiry: () => "N/A", status: "ok" },
  { name: language => language === "pt" ? "Probióticos" : "Probiotics", qty: 2, unit: "kg", expiry: () => "Abr 2026", status: "critical" },
];

const feedConsumption = [
  { month: "Out", consumed: 3200 }, { month: "Nov", consumed: 3800 }, { month: "Dez", consumed: 3500 },
  { month: "Jan", consumed: 4100 }, { month: "Fev", consumed: 4500 }, { month: "Mar", consumed: 4800 },
];

export const Inventory = () => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("inventorySystem")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("inventoryDesc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("feedItems"), value: "5", icon: Package, color: "text-primary" },
          { label: t("medicineItems"), value: "5", icon: Pill, color: "text-accent" },
          { label: t("lowStockAlerts"), value: "3", icon: AlertTriangle, color: "text-warning" },
          { label: t("monthlySpend"), value: "R$24K", icon: DollarSign, color: "text-info" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("feedStockLevels")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {feedStock.map((f, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{typeof f.name === "function" ? f.name(language) : f.name}</span>
                  <span className="text-muted-foreground">{f.qty} / {f.capacity} {f.unit}</span>
                </div>
                <Progress value={(f.qty / f.capacity) * 100} className={`h-2 ${f.status === "critical" ? "[&>div]:bg-destructive" : f.status === "low" ? "[&>div]:bg-warning" : "[&>div]:bg-primary"}`} />
                {f.status !== "ok" && <p className="text-xs text-destructive mt-1">⚠ {t("belowReorderLevel")} ({f.reorder} {f.unit})</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("medicineInventory")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medicineStock.map((m, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${m.status === "critical" ? "bg-destructive/10" : m.status === "low" ? "bg-warning/10" : "bg-muted/50"}`}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{typeof m.name === "function" ? m.name(language) : m.name}</p>
                    <p className="text-xs text-muted-foreground">{t("expires")}: {typeof m.expiry === "function" ? m.expiry(language) : m.expiry}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{m.qty} {m.unit}</p>
                    <Badge variant={m.status === "critical" ? "destructive" : m.status === "low" ? "default" : "secondary"} className="text-xs">{m.status === "critical" ? t("critical") : m.status === "low" ? t("low") : t("ok")}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("feedConsumptionTrend")}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feedConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="consumed" fill="hsl(199,89%,32%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ FINANCE ============
const revenueData = [
  { month: "Out", revenue: 820000, expenses: 540000, profit: 280000 },
  { month: "Nov", revenue: 950000, expenses: 580000, profit: 370000 },
  { month: "Dez", revenue: 880000, expenses: 620000, profit: 260000 },
  { month: "Jan", revenue: 1100000, expenses: 650000, profit: 450000 },
  { month: "Fev", revenue: 1250000, expenses: 700000, profit: 550000 },
  { month: "Mar", revenue: 1380000, expenses: 720000, profit: 660000 },
];

export const Finance = () => {
  const { t, language } = useLanguage();
  const expenseBreakdown = [
    { name: t("feed"), value: 45 }, { name: t("labor"), value: 20 }, { name: t("medicine"), value: 8 },
    { name: t("transport"), value: 12 }, { name: t("utilities"), value: 10 }, { name: t("other"), value: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("financeModule")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("financeDesc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("monthlyRevenue"), value: "R$138K", icon: TrendingUp, color: "text-success", change: "+10,4%" },
          { label: t("monthlyExpenses"), value: "R$72K", icon: TrendingDown, color: "text-destructive", change: "+2,9%" },
          { label: t("netProfit"), value: "R$66K", icon: DollarSign, color: "text-primary", change: "+20%" },
          { label: t("farmerPayments"), value: "R$31K", icon: Zap, color: "text-warning", change: `${t("pending")}: 2` },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  <span className="text-xs font-medium text-muted-foreground mt-1">{s.change}</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("revenueVsExpenses")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => `R$${(v / 1000).toFixed(0)}K`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(168,60%,42%)" fill="hsl(168,60%,42%)" fillOpacity={0.15} name={t("monthlyRevenue")} />
                <Area type="monotone" dataKey="expenses" stroke="hsl(0,72%,51%)" fill="hsl(0,72%,51%)" fillOpacity={0.1} name={t("monthlyExpenses")} />
                <Area type="monotone" dataKey="profit" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.15} name={t("netProfit")} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("expenseBreakdown")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {expenseBreakdown.map((e, i) => (
                <div key={e.name} className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /><span className="text-muted-foreground">{e.name} ({e.value}%)</span></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("farmerPaymentLedger")}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">{t("farmer")}</th><th className="text-left py-3 px-2 font-medium">{t("period")}</th><th className="text-right py-3 px-2 font-medium">{t("amount")}</th><th className="text-left py-3 px-2 font-medium">{t("status")}</th><th className="text-left py-3 px-2 font-medium">{t("date")}</th>
              </tr></thead>
              <tbody>
                {[
                  { farmer: "Carlos Silva", period: "Mar 2026", amount: "R$85.000", status: "Paid", date: "25 Mar" },
                  { farmer: "João Santos", period: "Mar 2026", amount: "R$62.000", status: "Pending", date: "—" },
                  { farmer: "Pedro Oliveira", period: "Mar 2026", amount: "R$110.000", status: "Paid", date: "24 Mar" },
                  { farmer: "Rafael Costa", period: "Mar 2026", amount: "R$45.000", status: "Pending", date: "—" },
                  { farmer: "Carlos Silva", period: "Fev 2026", amount: "R$78.000", status: "Paid", date: "28 Fev" },
                ].map((p, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{p.farmer}</td>
                    <td className="py-3 px-2 text-muted-foreground">{p.period}</td>
                    <td className="py-3 px-2 text-right font-medium text-foreground">{p.amount}</td>
                    <td className="py-3 px-2"><Badge variant={p.status === "Paid" ? "default" : "secondary"} className="text-xs">{p.status === "Paid" ? t("paid") : t("pending")}</Badge></td>
                    <td className="py-3 px-2 text-muted-foreground">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ ANALYTICS ============
const mortalityTrend = [
  { month: "Out", rate: 4.2 }, { month: "Nov", rate: 3.8 }, { month: "Dez", rate: 3.5 },
  { month: "Jan", rate: 3.1 }, { month: "Fev", rate: 2.8 }, { month: "Mar", rate: 2.5 },
];

const fcrTrend = [
  { month: "Out", fcr: 1.9 }, { month: "Nov", fcr: 1.8 }, { month: "Dez", fcr: 1.7 },
  { month: "Jan", fcr: 1.6 }, { month: "Fev", fcr: 1.55 }, { month: "Mar", fcr: 1.5 },
];

const roiData = [
  { month: "Out", roi: 18 }, { month: "Nov", roi: 24 }, { month: "Dez", roi: 15 },
  { month: "Jan", roi: 32 }, { month: "Fev", roi: 38 }, { month: "Mar", roi: 42 },
];

export const Analytics = () => {
  const { t } = useLanguage();
  const farmerRankings = [
    { name: "Pedro Oliveira", ponds: 8, production: "12.500 kg", fcr: 1.4, mortality: "2,1%", score: 95 },
    { name: "Carlos Silva", ponds: 5, production: "8.200 kg", fcr: 1.5, mortality: "2,8%", score: 88 },
    { name: "João Santos", ponds: 3, production: "4.800 kg", fcr: 1.6, mortality: "3,2%", score: 82 },
    { name: "Rafael Costa", ponds: 4, production: "3.100 kg", fcr: 1.8, mortality: "4,5%", score: 71 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("analyticsDashboard")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("analyticsDesc")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("avgMortality"), value: "2,5%", icon: TrendingDown, color: "text-success", change: "↓ 0,3%" },
          { label: t("avgFCR"), value: "1,50", icon: Activity, color: "text-primary", change: "↓ 0,05" },
          { label: t("roiThisMonth"), value: "42%", icon: TrendingUp, color: "text-accent", change: "↑ 4%" },
          { label: t("topFarmerScore"), value: "95/100", icon: Zap, color: "text-warning", change: "Pedro Oliveira" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  <span className="text-xs font-medium text-muted-foreground mt-1">{s.change}</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("mortalityRateTrend")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mortalityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis domain={[0, 6]} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={{ fill: "hsl(0,72%,51%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("fcrImprovement")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={fcrTrend}>
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
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("roiTrend")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="roi" stroke="hsl(168,60%,42%)" fill="hsl(168,60%,42%)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("farmerPerformanceRankings")}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">{t("rank")}</th><th className="text-left py-3 px-2 font-medium">{t("farmer")}</th><th className="text-right py-3 px-2 font-medium">{t("ponds")}</th><th className="text-right py-3 px-2 font-medium">{t("production")}</th><th className="text-right py-3 px-2 font-medium">TCA</th><th className="text-right py-3 px-2 font-medium">{t("mortality")}</th><th className="text-right py-3 px-2 font-medium">{t("score")}</th>
              </tr></thead>
              <tbody>
                {farmerRankings.map((f, i) => (
                  <tr key={f.name} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-bold text-foreground">#{i + 1}</td>
                    <td className="py-3 px-2 font-medium text-foreground">{f.name}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{f.ponds}</td>
                    <td className="py-3 px-2 text-right text-foreground">{f.production}</td>
                    <td className="py-3 px-2 text-right text-foreground">{f.fcr}</td>
                    <td className="py-3 px-2 text-right"><span className={parseFloat(f.mortality) < 3 ? "text-success" : "text-warning"}>{f.mortality}</span></td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={f.score} className="w-16 h-2" />
                        <span className="font-bold text-foreground">{f.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ ALERTS ============
export const Alerts = () => {
  const { t, language } = useLanguage();

  const allAlerts = [
    { id: 1, type: "critical", title: language === "pt" ? "Alta mortalidade detectada" : "High mortality detected", msg: language === "pt" ? "Lote #1247 no Tanque P-3 com 8% de mortalidade nas últimas 24h. Atenção imediata necessária." : "Batch #1247 in Pond P-3 showing 8% mortality in last 24h.", time: "15 min", module: language === "pt" ? "Fazenda" : "Farm" },
    { id: 2, type: "warning", title: language === "pt" ? "Estoque baixo de ração" : "Low feed stock", msg: language === "pt" ? "Micro Pellets (0,5mm) apenas 12kg — abaixo do nível de reposição de 15kg." : "Micro Pellets (0.5mm) only 12kg remaining — below reorder.", time: "2h", module: t("inventory") },
    { id: 3, type: "warning", title: language === "pt" ? "Pico de temperatura" : "Water temperature spike", msg: language === "pt" ? "Tanque A3 atingiu 32°C — acima do limite seguro de 30°C." : "Pond A3 temperature reached 32°C — above safe threshold.", time: "3h", module: language === "pt" ? "Fazenda" : "Farm" },
    { id: 4, type: "info", title: language === "pt" ? "Colheita agendada" : "Harvest scheduled", msg: language === "pt" ? "Colheita do Tanque B2 planejada para amanhã. Rendimento estimado: 1.200 kg." : "Pond B2 harvest planned for tomorrow. Est. 1,200 kg.", time: "5h", module: t("processing") },
    { id: 5, type: "critical", title: language === "pt" ? "Probióticos vencendo" : "Probiotics expiring soon", msg: language === "pt" ? "Estoque de probióticos (2kg) vence em abril 2026. Repor imediatamente." : "Probiotics stock (2kg) expires April 2026.", time: "1d", module: t("inventory") },
    { id: 6, type: "warning", title: language === "pt" ? "TCA acima da meta" : "FCR above target", msg: language === "pt" ? "Tanque P-7 TCA está 2,1 — acima da meta de 1,8." : "Pond P-7 FCR is 2.1 — above target of 1.8.", time: "1d", module: t("analytics") },
    { id: 7, type: "info", title: language === "pt" ? "Novo produtor cadastrado" : "New farmer onboarded", msg: language === "pt" ? "Maria Fernanda foi adicionada com 6 tanques em Mato Grosso." : "Maria Fernanda added with 6 ponds in Mato Grosso.", time: "2d", module: t("farmers") },
    { id: 8, type: "success", title: language === "pt" ? "Transferência concluída" : "Batch transfer complete", msg: language === "pt" ? "NB-2399: 9.200 alevinos transferidos do Berçário N-A1 para Tanque P-3." : "NB-2399: 9,200 fry transferred to Pond P-3.", time: "2d", module: t("nursery") },
    { id: 9, type: "info", title: language === "pt" ? "Processamento concluído" : "Processing batch completed", msg: language === "pt" ? "PB-499: 520kg processados com 76,9% de rendimento — Classe A+." : "PB-499: 520kg processed, 76.9% yield — Grade A+.", time: "3d", module: t("processing") },
    { id: 10, type: "success", title: language === "pt" ? "Pagamento processado" : "Payment processed", msg: language === "pt" ? "R$110.000 pagos a Pedro Oliveira pela produção de março." : "R$110,000 paid to Pedro Oliveira for March.", time: "3d", module: t("finance") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{t("alertsNotifications")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("alertsDesc")}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("critical"), count: 2, color: "bg-destructive/10 text-destructive" },
          { label: t("warnings"), count: 3, color: "bg-warning/10 text-warning" },
          { label: t("info"), count: 3, color: "bg-info/10 text-info" },
          { label: t("resolved"), count: 2, color: "bg-success/10 text-success" },
        ].map((a) => (
          <Card key={a.label} className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{a.count}</p>
              <Badge className={`text-xs mt-1 ${a.color} border-0`}>{a.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("allAlerts")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {allAlerts.map((a) => (
            <div key={a.id} className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
              a.type === "critical" ? "bg-destructive/5 border-destructive/20" :
              a.type === "warning" ? "bg-warning/5 border-warning/20" :
              a.type === "success" ? "bg-success/5 border-success/20" :
              "bg-info/5 border-info/20"
            }`}>
              {a.type === "critical" ? <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" /> :
               a.type === "warning" ? <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" /> :
               a.type === "success" ? <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" /> :
               <Bell className="w-5 h-5 text-info shrink-0 mt-0.5" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <Badge variant="secondary" className="text-xs">{a.module}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{a.msg}</p>
                <p className="text-xs text-muted-foreground mt-2">{a.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
