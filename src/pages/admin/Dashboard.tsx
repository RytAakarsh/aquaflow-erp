import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fish, Egg, Users, Factory, TrendingUp, TrendingDown, AlertTriangle, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Active Batches", value: "24", change: "+3", trend: "up", icon: Fish, color: "text-primary" },
  { label: "Eggs This Month", value: "12,450", change: "+8%", trend: "up", icon: Egg, color: "text-accent" },
  { label: "Active Farmers", value: "18", change: "+2", trend: "up", icon: Users, color: "text-info" },
  { label: "Processing Today", value: "850 kg", change: "-5%", trend: "down", icon: Factory, color: "text-warning" },
];

const monthlyData = [
  { month: "Jan", production: 4200, mortality: 320 },
  { month: "Feb", production: 4800, mortality: 280 },
  { month: "Mar", production: 5100, mortality: 250 },
  { month: "Apr", production: 4900, mortality: 310 },
  { month: "May", production: 5600, mortality: 220 },
  { month: "Jun", production: 6200, mortality: 190 },
];

const stageData = [
  { name: "Breeding", value: 15 },
  { name: "Larval", value: 25 },
  { name: "Fry", value: 30 },
  { name: "Juvenile", value: 20 },
  { name: "Grow-out", value: 10 },
];

const COLORS = ["hsl(199,89%,32%)", "hsl(168,60%,42%)", "hsl(38,92%,50%)", "hsl(199,89%,48%)", "hsl(152,60%,40%)"];

const alerts = [
  { type: "warning", msg: "Low feed stock in Pond A3 - 2 days remaining" },
  { type: "danger", msg: "High mortality detected in Batch #1247" },
  { type: "info", msg: "Harvest scheduled for Pond B2 tomorrow" },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Dashboard</h1>
      <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your operation overview.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="shadow-card border-border/50">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${s.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {s.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Production & Mortality Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="production" fill="hsl(199,89%,32%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mortality" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Fish by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {stageData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {stageData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Alerts */}
    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" /> Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((a, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
            a.type === "danger" ? "bg-destructive/10" : a.type === "warning" ? "bg-warning/10" : "bg-info/10"
          }`}>
            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
              a.type === "danger" ? "text-destructive" : a.type === "warning" ? "text-warning" : "text-info"
            }`} />
            <p className="text-sm text-foreground">{a.msg}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default AdminDashboard;
