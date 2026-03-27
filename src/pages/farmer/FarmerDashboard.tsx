import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Fish, Droplets, Thermometer, Activity, CheckCircle2, TrendingUp,
  Calendar, CloudSun, AlertTriangle, ArrowUpRight, Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

const pondHealth = [
  { pond: "A1", temp: 28.5, ph: 7.2, do2: 6.8, stock: 640, status: "Good" },
  { pond: "A2", temp: 29.0, ph: 7.0, do2: 6.5, stock: 720, status: "Good" },
  { pond: "B1", temp: 27.8, ph: 7.1, do2: 7.0, stock: 580, status: "Excellent" },
  { pond: "B2", temp: 31.2, ph: 6.8, do2: 5.8, stock: 510, status: "Warning" },
  { pond: "C1", temp: 28.2, ph: 7.3, do2: 6.9, stock: 750, status: "Good" },
];

const weeklyFeed = [
  { day: "Mon", feed: 45 }, { day: "Tue", feed: 48 }, { day: "Wed", feed: 42 },
  { day: "Thu", feed: 50 }, { day: "Fri", feed: 47 }, { day: "Sat", feed: 52 }, { day: "Sun", feed: 44 },
];

const growthData = [
  { week: "W1", weight: 120 }, { week: "W2", weight: 155 }, { week: "W3", weight: 195 },
  { week: "W4", weight: 240 }, { week: "W5", weight: 290 }, { week: "W6", weight: 345 },
  { week: "W7", weight: 405 }, { week: "W8", weight: 470 },
];

const FarmerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:pt-14">
      {/* Greeting + Weather */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading">Hello, {user?.name} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your farm overview for today</p>
        </div>
        <Card className="shadow-card border-border/50 w-fit">
          <CardContent className="p-3 flex items-center gap-3">
            <CloudSun className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm font-bold text-foreground">32°C Sunny</p>
              <p className="text-xs text-muted-foreground">Andhra Pradesh</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Ponds", value: "5", icon: Droplets, color: "text-primary", sub: "All healthy" },
          { label: "Current Stock", value: "3,200", icon: Fish, color: "text-accent", sub: "+120 this week" },
          { label: "Avg Water Temp", value: "28.9°C", icon: Thermometer, color: "text-warning", sub: "Within range" },
          { label: "FCR", value: "1.6", icon: Activity, color: "text-success", sub: "Target: 1.5" },
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Fish Growth (g)</CardTitle></CardHeader>
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
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Weekly Feed (kg)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyFeed}>
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

      {/* Pond Health */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">🐟 Pond Health Monitor</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pondHealth.map((p) => (
              <div key={p.pond} className={`flex items-center justify-between p-3 rounded-lg ${
                p.status === "Warning" ? "bg-warning/10" : "bg-muted/50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-foreground">{p.pond}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.stock} fish</p>
                    <p className="text-xs text-muted-foreground">{p.temp}°C · pH {p.ph} · DO {p.do2}</p>
                  </div>
                </div>
                <Badge variant={p.status === "Warning" ? "destructive" : p.status === "Excellent" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks + Notifications side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">Today's Tasks</CardTitle>
              <Badge variant="secondary" className="text-xs">3/5 done</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { task: "Morning feeding - All ponds", done: true },
              { task: "Water quality check", done: true },
              { task: "Upload daily photos", done: true },
              { task: "Evening feeding - All ponds", done: false },
              { task: "Record mortality count", done: false },
            ].map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${t.done ? "bg-success/10" : "bg-muted"}`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${t.done ? "text-success" : "text-muted-foreground"}`} />
                <span className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.task}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Recent Updates</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { msg: "New feed delivery arriving tomorrow — 500kg", type: "info", time: "2h ago" },
              { msg: "⚠ Water temp above threshold in Pond B2", type: "warning", time: "3h ago" },
              { msg: "Weekly report reviewed by admin ✓", type: "success", time: "1d ago" },
              { msg: "Harvest scheduled for Pond B2 — Friday", type: "info", time: "2d ago" },
              { msg: "Payment ₹85,000 processed successfully", type: "success", time: "3d ago" },
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

      {/* Quick Performance */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">📊 Your Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Performance Score", value: 88, max: 100, color: "[&>div]:bg-primary" },
              { label: "Feed Efficiency", value: 85, max: 100, color: "[&>div]:bg-accent" },
              { label: "Task Completion", value: 92, max: 100, color: "[&>div]:bg-success" },
              { label: "Report Accuracy", value: 78, max: 100, color: "[&>div]:bg-warning" },
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
