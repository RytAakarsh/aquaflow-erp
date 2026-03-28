import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Fish, Droplets, Thermometer, Activity, CheckCircle2, CloudSun
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

const pondHealth = [
  { pond: "A1", temp: 28.5, ph: 7.2, do2: 6.8, stock: 640, status: "Good" },
  { pond: "A2", temp: 29.0, ph: 7.0, do2: 6.5, stock: 720, status: "Good" },
  { pond: "B1", temp: 27.8, ph: 7.1, do2: 7.0, stock: 580, status: "Excellent" },
  { pond: "B2", temp: 31.2, ph: 6.8, do2: 5.8, stock: 510, status: "Warning" },
  { pond: "C1", temp: 28.2, ph: 7.3, do2: 6.9, stock: 750, status: "Good" },
];

const weeklyFeedData = [
  { day: "Seg", feed: 45 }, { day: "Ter", feed: 48 }, { day: "Qua", feed: 42 },
  { day: "Qui", feed: 50 }, { day: "Sex", feed: 47 }, { day: "Sáb", feed: 52 }, { day: "Dom", feed: 44 },
];

const growthData = [
  { week: "S1", weight: 120 }, { week: "S2", weight: 155 }, { week: "S3", weight: 195 },
  { week: "S4", weight: 240 }, { week: "S5", weight: 290 }, { week: "S6", weight: 345 },
  { week: "S7", weight: 405 }, { week: "S8", weight: 470 },
];

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const statusMap: Record<string, string> = {
    Good: t("good"),
    Warning: t("warning"),
    Excellent: t("excellent"),
  };

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading">{t("hello")}, {user?.name} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("farmOverviewToday")}</p>
        </div>
        <Card className="shadow-card border-border/50 w-fit">
          <CardContent className="p-3 flex items-center gap-3">
            <CloudSun className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm font-bold text-foreground">32°C {t("sunny")}</p>
              <p className="text-xs text-muted-foreground">São Paulo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("activePonds"), value: "5", icon: Droplets, color: "text-primary", sub: t("allHealthy") },
          { label: t("currentStock"), value: "3.200", icon: Fish, color: "text-accent", sub: `+120 ${t("thisWeek")}` },
          { label: t("avgWaterTemp"), value: "28,9°C", icon: Thermometer, color: "text-warning", sub: t("withinRange") },
          { label: "TCA", value: "1,6", icon: Activity, color: "text-success", sub: `${t("target")}: 1,5` },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("fishGrowth")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="week" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="weight" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("weeklyFeed")}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyFeedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="feed" fill="hsl(168,60%,42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("pondHealthMonitor")}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pondHealth.map((p) => (
              <div key={p.pond} className={`flex items-center justify-between p-3 rounded-lg ${
                p.status === "Warning" ? "bg-warning/10" : "bg-muted/50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-foreground">{p.pond}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.stock} {t("fish")}</p>
                    <p className="text-xs text-muted-foreground">{p.temp}°C · pH {p.ph} · DO {p.do2}</p>
                  </div>
                </div>
                <Badge variant={p.status === "Warning" ? "destructive" : p.status === "Excellent" ? "default" : "secondary"} className="text-xs">{statusMap[p.status]}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">{t("todaysTasks")}</CardTitle>
              <Badge variant="secondary" className="text-xs">3/5 {language === "pt" ? "feitas" : "done"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { task: t("morningFeedingTask"), done: true },
              { task: t("waterQualityCheck"), done: true },
              { task: t("uploadDailyPhotosTask"), done: true },
              { task: t("eveningFeedingTask"), done: false },
              { task: t("recordMortalityTask"), done: false },
            ].map((tsk, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${tsk.done ? "bg-success/10" : "bg-muted"}`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${tsk.done ? "text-success" : "text-muted-foreground"}`} />
                <span className={`text-sm ${tsk.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{tsk.task}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("recentUpdates")}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { msg: t("newFeedDelivery"), type: "info", time: "2h" },
              { msg: t("waterTempAboveThreshold"), type: "warning", time: "3h" },
              { msg: t("weeklyReportReviewed"), type: "success", time: "1d" },
              { msg: t("harvestScheduledPondB2"), type: "info", time: "2d" },
              { msg: t("paymentProcessedAmount"), type: "success", time: "3d" },
            ].map((n, i) => (
              <div key={i} className={`p-2.5 rounded-lg text-sm ${
                n.type === "warning" ? "bg-warning/10" : n.type === "success" ? "bg-success/10" : "bg-info/10"
              }`}>
                <p className="text-foreground text-sm">{n.msg}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{t("yourPerformance")}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t("performanceScore"), value: 88, color: "[&>div]:bg-primary" },
              { label: t("feedEfficiency"), value: 85, color: "[&>div]:bg-accent" },
              { label: t("taskCompletion"), value: 92, color: "[&>div]:bg-success" },
              { label: t("reportAccuracy"), value: 78, color: "[&>div]:bg-warning" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">{m.value}%</p>
                <Progress value={m.value} className={`h-2 mt-2 ${m.color}`} />
                <p className="text-xs text-muted-foreground mt-2">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
