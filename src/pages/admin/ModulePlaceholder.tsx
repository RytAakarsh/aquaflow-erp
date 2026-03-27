import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Egg, Bug, Waves, Factory, Package, DollarSign, BarChart3, Bell,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock,
  Thermometer, Droplets, Activity, Fish, Pill, Scale, Scissors,
  ArrowUpRight, ArrowDownRight, Calendar, Target, Zap, Shield
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar
} from "recharts";

const COLORS = ["hsl(199,89%,32%)", "hsl(168,60%,42%)", "hsl(38,92%,50%)", "hsl(199,89%,48%)", "hsl(152,60%,40%)", "hsl(0,72%,51%)"];

// ============ BREEDING ============
const broodstockData = [
  { id: "BS-001", strain: "GIFT Tilapia", age: "18 months", weight: "1.2 kg", status: "Breeding", eggs: 2400 },
  { id: "BS-002", strain: "Nile Tilapia", age: "24 months", weight: "1.5 kg", status: "Resting", eggs: 0 },
  { id: "BS-003", strain: "GIFT Tilapia", age: "20 months", weight: "1.3 kg", status: "Breeding", eggs: 1800 },
  { id: "BS-004", strain: "Red Tilapia", age: "16 months", weight: "1.1 kg", status: "Conditioning", eggs: 0 },
  { id: "BS-005", strain: "Nile Tilapia", age: "22 months", weight: "1.4 kg", status: "Breeding", eggs: 3200 },
];

const eggProductionMonthly = [
  { month: "Oct", eggs: 18500, hatchRate: 82 },
  { month: "Nov", eggs: 22000, hatchRate: 85 },
  { month: "Dec", eggs: 19800, hatchRate: 79 },
  { month: "Jan", eggs: 24500, hatchRate: 88 },
  { month: "Feb", eggs: 26000, hatchRate: 91 },
  { month: "Mar", eggs: 28500, hatchRate: 89 },
];

const breedingStats = [
  { label: "Active Broodstock", value: "48", icon: Fish, color: "text-primary", change: "+5" },
  { label: "Eggs This Month", value: "28,500", icon: Egg, color: "text-accent", change: "+9.6%" },
  { label: "Avg Hatch Rate", value: "89%", icon: Target, color: "text-success", change: "+2%" },
  { label: "Next Spawn Cycle", value: "3 days", icon: Calendar, color: "text-warning", change: "" },
];

export const Breeding = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Breeding Management</h1>
      <p className="text-muted-foreground text-sm mt-1">Broodstock tracking, egg production, and genetics</p>
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Egg Production & Hatch Rate</CardTitle></CardHeader>
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Strain Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={[{ name: "GIFT", value: 22 }, { name: "Nile", value: 18 }, { name: "Red", value: 8 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {[0, 1, 2].map((i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {["GIFT Tilapia", "Nile Tilapia", "Red Tilapia"].map((n, i) => (
              <div key={n} className="flex items-center gap-1.5 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} /><span className="text-muted-foreground">{n}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Broodstock Registry</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2 font-medium">ID</th><th className="text-left py-3 px-2 font-medium">Strain</th><th className="text-left py-3 px-2 font-medium">Age</th><th className="text-left py-3 px-2 font-medium">Weight</th><th className="text-left py-3 px-2 font-medium">Status</th><th className="text-right py-3 px-2 font-medium">Eggs</th>
            </tr></thead>
            <tbody>
              {broodstockData.map((b) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{b.id}</td>
                  <td className="py-3 px-2 text-foreground">{b.strain}</td>
                  <td className="py-3 px-2 text-muted-foreground">{b.age}</td>
                  <td className="py-3 px-2 text-muted-foreground">{b.weight}</td>
                  <td className="py-3 px-2"><Badge variant={b.status === "Breeding" ? "default" : "secondary"} className="text-xs">{b.status}</Badge></td>
                  <td className="py-3 px-2 text-right font-medium text-foreground">{b.eggs.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ============ HATCHERY ============
const tankData = [
  { id: "T-01", capacity: "500L", species: "GIFT", stage: "Eggs", count: 12000, temp: 28.5, survival: 92, daysLeft: 3 },
  { id: "T-02", capacity: "500L", species: "Nile", stage: "Larvae", count: 8500, temp: 27.8, survival: 88, daysLeft: 7 },
  { id: "T-03", capacity: "1000L", species: "GIFT", stage: "Larvae", count: 15200, temp: 28.2, survival: 90, daysLeft: 5 },
  { id: "T-04", capacity: "500L", species: "Red", stage: "Eggs", count: 6000, temp: 29.0, survival: 85, daysLeft: 4 },
  { id: "T-05", capacity: "1000L", species: "Nile", stage: "Pre-Fry", count: 9800, temp: 28.0, survival: 94, daysLeft: 2 },
];

const hatcherySurvival = [
  { day: "D1", survival: 100 }, { day: "D3", survival: 96 }, { day: "D5", survival: 93 },
  { day: "D7", survival: 91 }, { day: "D10", survival: 89 }, { day: "D14", survival: 87 },
  { day: "D21", survival: 85 }, { day: "D28", survival: 83 },
];

export const Hatchery = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Hatchery Module</h1>
      <p className="text-muted-foreground text-sm mt-1">Tank management, survival tracking, and feeding schedules</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Active Tanks", value: "12", icon: Droplets, color: "text-primary" },
        { label: "Total Larvae", value: "51,500", icon: Bug, color: "text-accent" },
        { label: "Avg Survival", value: "90%", icon: Shield, color: "text-success" },
        { label: "Avg Temp", value: "28.3°C", icon: Thermometer, color: "text-warning" },
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Survival Rate Curve</CardTitle></CardHeader>
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Feeding Schedule Today</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { time: "06:00 AM", feed: "Artemia nauplii", tanks: "T-02, T-03", done: true },
            { time: "10:00 AM", feed: "Micro pellets", tanks: "T-05", done: true },
            { time: "02:00 PM", feed: "Artemia nauplii", tanks: "T-02, T-03", done: false },
            { time: "06:00 PM", feed: "Micro pellets", tanks: "All tanks", done: false },
            { time: "10:00 PM", feed: "Live feed mix", tanks: "T-01, T-04", done: false },
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
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Tank Status</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2 font-medium">Tank</th><th className="text-left py-3 px-2 font-medium">Species</th><th className="text-left py-3 px-2 font-medium">Stage</th><th className="text-right py-3 px-2 font-medium">Count</th><th className="text-right py-3 px-2 font-medium">Temp</th><th className="text-right py-3 px-2 font-medium">Survival</th><th className="text-right py-3 px-2 font-medium">Days Left</th>
            </tr></thead>
            <tbody>
              {tankData.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{t.id}</td>
                  <td className="py-3 px-2 text-foreground">{t.species}</td>
                  <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{t.stage}</Badge></td>
                  <td className="py-3 px-2 text-right text-foreground">{t.count.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-muted-foreground">{t.temp}°C</td>
                  <td className="py-3 px-2 text-right"><span className={t.survival >= 90 ? "text-success" : "text-warning"}>{t.survival}%</span></td>
                  <td className="py-3 px-2 text-right text-muted-foreground">{t.daysLeft}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ============ NURSERY ============
const nurseryBatches = [
  { id: "NB-2401", source: "Hatchery T-01", count: 10500, avgWeight: "0.8g", stage: "Fry", growthRate: "+12%", pond: "N-A1", daysInNursery: 21 },
  { id: "NB-2402", source: "Hatchery T-03", count: 14200, avgWeight: "1.2g", stage: "Fry", growthRate: "+15%", pond: "N-A2", daysInNursery: 28 },
  { id: "NB-2403", source: "Hatchery T-05", count: 8800, avgWeight: "0.5g", stage: "Early Fry", growthRate: "+8%", pond: "N-B1", daysInNursery: 14 },
  { id: "NB-2404", source: "Hatchery T-02", count: 7600, avgWeight: "2.1g", stage: "Late Fry", growthRate: "+18%", pond: "N-B2", daysInNursery: 42 },
  { id: "NB-2405", source: "Partner Batch", count: 5000, avgWeight: "1.8g", stage: "Fry", growthRate: "+10%", pond: "N-C1", daysInNursery: 35 },
];

const nurseryGrowth = [
  { week: "W1", weight: 0.2 }, { week: "W2", weight: 0.5 }, { week: "W3", weight: 0.8 },
  { week: "W4", weight: 1.2 }, { week: "W5", weight: 1.8 }, { week: "W6", weight: 2.5 },
  { week: "W7", weight: 3.2 }, { week: "W8", weight: 4.0 },
];

export const Nursery = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Nursery Module</h1>
      <p className="text-muted-foreground text-sm mt-1">Batch tracking, growth logs, and transfer management</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Active Batches", value: "5", icon: Waves, color: "text-primary" },
        { label: "Total Fry", value: "46,100", icon: Fish, color: "text-accent" },
        { label: "Avg Growth", value: "+12.6%", icon: TrendingUp, color: "text-success" },
        { label: "Ready to Transfer", value: "2", icon: ArrowUpRight, color: "text-info" },
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Growth Curve (Avg Weight g)</CardTitle></CardHeader>
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Recent Transfers</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { batch: "NB-2399", from: "Nursery N-A1", to: "Farm Pond P-3", count: "9,200 fry", date: "Mar 24" },
            { batch: "NB-2398", from: "Nursery N-B2", to: "Farm Pond P-7", count: "11,000 fry", date: "Mar 20" },
            { batch: "NB-2396", from: "Nursery N-C1", to: "Partner Farm", count: "5,500 fry", date: "Mar 18" },
            { batch: "NB-2395", from: "Nursery N-A2", to: "Farm Pond P-1", count: "8,400 fry", date: "Mar 15" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t.batch}: {t.count}</p>
                <p className="text-xs text-muted-foreground">{t.from} → {t.to} · {t.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Nursery Batches</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2 font-medium">Batch</th><th className="text-left py-3 px-2 font-medium">Source</th><th className="text-left py-3 px-2 font-medium">Pond</th><th className="text-right py-3 px-2 font-medium">Count</th><th className="text-right py-3 px-2 font-medium">Avg Wt</th><th className="text-left py-3 px-2 font-medium">Stage</th><th className="text-right py-3 px-2 font-medium">Growth</th>
            </tr></thead>
            <tbody>
              {nurseryBatches.map((b) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{b.id}</td>
                  <td className="py-3 px-2 text-muted-foreground">{b.source}</td>
                  <td className="py-3 px-2 text-foreground">{b.pond}</td>
                  <td className="py-3 px-2 text-right text-foreground">{b.count.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right text-muted-foreground">{b.avgWeight}</td>
                  <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{b.stage}</Badge></td>
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

// ============ PROCESSING ============
const processingDaily = [
  { day: "Mon", intake: 850, output: 620, waste: 95 },
  { day: "Tue", intake: 920, output: 680, waste: 88 },
  { day: "Wed", intake: 780, output: 570, waste: 82 },
  { day: "Thu", intake: 1050, output: 780, waste: 110 },
  { day: "Fri", intake: 960, output: 720, waste: 92 },
  { day: "Sat", intake: 1100, output: 830, waste: 105 },
];

const gradeDistribution = [
  { name: "Premium (A+)", value: 35 }, { name: "Grade A", value: 30 },
  { name: "Grade B", value: 20 }, { name: "Grade C", value: 10 }, { name: "Reject", value: 5 },
];

export const Processing = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Processing Module</h1>
      <p className="text-muted-foreground text-sm mt-1">Intake records, quality control, output tracking, waste analysis</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Today's Intake", value: "1,100 kg", icon: Scale, color: "text-primary" },
        { label: "Output Products", value: "830 kg", icon: Package, color: "text-accent" },
        { label: "Yield Rate", value: "75.5%", icon: Target, color: "text-success" },
        { label: "Waste", value: "105 kg", icon: Scissors, color: "text-destructive" },
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Weekly Intake vs Output (kg)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={processingDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="intake" fill="hsl(199,89%,32%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="output" fill="hsl(168,60%,42%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="waste" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Quality Grade Distribution</CardTitle></CardHeader>
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
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Recent Processing Batches</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2 font-medium">Batch</th><th className="text-left py-3 px-2 font-medium">Source</th><th className="text-right py-3 px-2 font-medium">Intake (kg)</th><th className="text-right py-3 px-2 font-medium">Output (kg)</th><th className="text-right py-3 px-2 font-medium">Yield</th><th className="text-left py-3 px-2 font-medium">Grade</th><th className="text-left py-3 px-2 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {[
                { batch: "PB-501", source: "Pond P-3", intake: 450, output: 340, yield: "75.6%", grade: "A+", date: "Mar 27" },
                { batch: "PB-500", source: "Pond P-7", intake: 380, output: 280, yield: "73.7%", grade: "A", date: "Mar 26" },
                { batch: "PB-499", source: "Partner Farm", intake: 520, output: 400, yield: "76.9%", grade: "A+", date: "Mar 25" },
                { batch: "PB-498", source: "Pond P-1", intake: 290, output: 210, yield: "72.4%", grade: "B", date: "Mar 24" },
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

// ============ INVENTORY ============
const feedStock = [
  { name: "Floating Pellets (3mm)", qty: 2500, unit: "kg", capacity: 5000, reorder: 1000, status: "ok" },
  { name: "Sinking Pellets (5mm)", qty: 800, unit: "kg", capacity: 3000, reorder: 1000, status: "low" },
  { name: "Artemia Cysts", qty: 45, unit: "kg", capacity: 100, reorder: 20, status: "ok" },
  { name: "Micro Pellets (0.5mm)", qty: 12, unit: "kg", capacity: 50, reorder: 15, status: "critical" },
  { name: "Live Feed Mix", qty: 180, unit: "L", capacity: 500, reorder: 100, status: "ok" },
];

const medicineStock = [
  { name: "Oxytetracycline", qty: 25, unit: "kg", expiry: "Sep 2026", status: "ok" },
  { name: "Potassium Permanganate", qty: 8, unit: "kg", expiry: "Dec 2026", status: "ok" },
  { name: "Formalin Solution", qty: 3, unit: "L", expiry: "Jun 2026", status: "low" },
  { name: "Salt (NaCl)", qty: 500, unit: "kg", expiry: "N/A", status: "ok" },
  { name: "Probiotics", qty: 2, unit: "kg", expiry: "Apr 2026", status: "critical" },
];

const feedConsumption = [
  { month: "Oct", consumed: 3200 }, { month: "Nov", consumed: 3800 }, { month: "Dec", consumed: 3500 },
  { month: "Jan", consumed: 4100 }, { month: "Feb", consumed: 4500 }, { month: "Mar", consumed: 4800 },
];

export const Inventory = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Inventory System</h1>
      <p className="text-muted-foreground text-sm mt-1">Feed & medicine tracking with auto low-stock alerts</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Feed Items", value: "5", icon: Package, color: "text-primary" },
        { label: "Medicine Items", value: "5", icon: Pill, color: "text-accent" },
        { label: "Low Stock Alerts", value: "3", icon: AlertTriangle, color: "text-warning" },
        { label: "Monthly Spend", value: "₹2.4L", icon: DollarSign, color: "text-info" },
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Feed Stock Levels</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {feedStock.map((f) => (
            <div key={f.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground font-medium">{f.name}</span>
                <span className="text-muted-foreground">{f.qty} / {f.capacity} {f.unit}</span>
              </div>
              <Progress value={(f.qty / f.capacity) * 100} className={`h-2 ${f.status === "critical" ? "[&>div]:bg-destructive" : f.status === "low" ? "[&>div]:bg-warning" : "[&>div]:bg-primary"}`} />
              {f.status !== "ok" && <p className="text-xs text-destructive mt-1">⚠ Below reorder level ({f.reorder} {f.unit})</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Medicine Inventory</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medicineStock.map((m) => (
              <div key={m.name} className={`flex items-center justify-between p-3 rounded-lg ${m.status === "critical" ? "bg-destructive/10" : m.status === "low" ? "bg-warning/10" : "bg-muted/50"}`}>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">Expires: {m.expiry}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{m.qty} {m.unit}</p>
                  <Badge variant={m.status === "critical" ? "destructive" : m.status === "low" ? "default" : "secondary"} className="text-xs">{m.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Feed Consumption Trend (kg)</CardTitle></CardHeader>
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

// ============ FINANCE ============
const revenueData = [
  { month: "Oct", revenue: 820000, expenses: 540000, profit: 280000 },
  { month: "Nov", revenue: 950000, expenses: 580000, profit: 370000 },
  { month: "Dec", revenue: 880000, expenses: 620000, profit: 260000 },
  { month: "Jan", revenue: 1100000, expenses: 650000, profit: 450000 },
  { month: "Feb", revenue: 1250000, expenses: 700000, profit: 550000 },
  { month: "Mar", revenue: 1380000, expenses: 720000, profit: 660000 },
];

const expenseBreakdown = [
  { name: "Feed", value: 45 }, { name: "Labor", value: 20 }, { name: "Medicine", value: 8 },
  { name: "Transport", value: 12 }, { name: "Utilities", value: 10 }, { name: "Other", value: 5 },
];

export const Finance = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Finance Module</h1>
      <p className="text-muted-foreground text-sm mt-1">Cost tracking, farmer payments, and profit reports</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Monthly Revenue", value: "₹13.8L", icon: TrendingUp, color: "text-success", change: "+10.4%" },
        { label: "Monthly Expenses", value: "₹7.2L", icon: TrendingDown, color: "text-destructive", change: "+2.9%" },
        { label: "Net Profit", value: "₹6.6L", icon: DollarSign, color: "text-primary", change: "+20%" },
        { label: "Farmer Payments", value: "₹3.1L", icon: Zap, color: "text-warning", change: "Pending: 2" },
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Revenue vs Expenses (₹)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`} />
              <Tooltip formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(168,60%,42%)" fill="hsl(168,60%,42%)" fillOpacity={0.15} />
              <Area type="monotone" dataKey="expenses" stroke="hsl(0,72%,51%)" fill="hsl(0,72%,51%)" fillOpacity={0.1} />
              <Area type="monotone" dataKey="profit" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Expense Breakdown</CardTitle></CardHeader>
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
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Farmer Payment Ledger</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2 font-medium">Farmer</th><th className="text-left py-3 px-2 font-medium">Period</th><th className="text-right py-3 px-2 font-medium">Amount</th><th className="text-left py-3 px-2 font-medium">Status</th><th className="text-left py-3 px-2 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {[
                { farmer: "Rajesh Kumar", period: "Mar 2026", amount: "₹85,000", status: "Paid", date: "Mar 25" },
                { farmer: "Suresh Patel", period: "Mar 2026", amount: "₹62,000", status: "Pending", date: "—" },
                { farmer: "Amit Singh", period: "Mar 2026", amount: "₹1,10,000", status: "Paid", date: "Mar 24" },
                { farmer: "Vikram Rao", period: "Mar 2026", amount: "₹45,000", status: "Pending", date: "—" },
                { farmer: "Rajesh Kumar", period: "Feb 2026", amount: "₹78,000", status: "Paid", date: "Feb 28" },
              ].map((p, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{p.farmer}</td>
                  <td className="py-3 px-2 text-muted-foreground">{p.period}</td>
                  <td className="py-3 px-2 text-right font-medium text-foreground">{p.amount}</td>
                  <td className="py-3 px-2"><Badge variant={p.status === "Paid" ? "default" : "secondary"} className="text-xs">{p.status}</Badge></td>
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

// ============ ANALYTICS ============
const farmerRankings = [
  { name: "Amit Singh", ponds: 8, production: "12,500 kg", fcr: 1.4, mortality: "2.1%", score: 95 },
  { name: "Rajesh Kumar", ponds: 5, production: "8,200 kg", fcr: 1.5, mortality: "2.8%", score: 88 },
  { name: "Suresh Patel", ponds: 3, production: "4,800 kg", fcr: 1.6, mortality: "3.2%", score: 82 },
  { name: "Vikram Rao", ponds: 4, production: "3,100 kg", fcr: 1.8, mortality: "4.5%", score: 71 },
];

const mortalityTrend = [
  { month: "Oct", rate: 4.2 }, { month: "Nov", rate: 3.8 }, { month: "Dec", rate: 3.5 },
  { month: "Jan", rate: 3.1 }, { month: "Feb", rate: 2.8 }, { month: "Mar", rate: 2.5 },
];

const fcrTrend = [
  { month: "Oct", fcr: 1.9 }, { month: "Nov", fcr: 1.8 }, { month: "Dec", fcr: 1.7 },
  { month: "Jan", fcr: 1.6 }, { month: "Feb", fcr: 1.55 }, { month: "Mar", fcr: 1.5 },
];

const roiData = [
  { month: "Oct", roi: 18 }, { month: "Nov", roi: 24 }, { month: "Dec", roi: 15 },
  { month: "Jan", roi: 32 }, { month: "Feb", roi: 38 }, { month: "Mar", roi: 42 },
];

export const Analytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Analytics Dashboard</h1>
      <p className="text-muted-foreground text-sm mt-1">Deep insights into mortality, growth, FCR, ROI, and farmer performance</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Avg Mortality", value: "2.5%", icon: TrendingDown, color: "text-success", change: "↓ 0.3%" },
        { label: "Avg FCR", value: "1.50", icon: Activity, color: "text-primary", change: "↓ 0.05" },
        { label: "ROI This Month", value: "42%", icon: TrendingUp, color: "text-accent", change: "↑ 4%" },
        { label: "Top Farmer Score", value: "95/100", icon: Zap, color: "text-warning", change: "Amit Singh" },
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">Mortality Rate Trend (%)</CardTitle></CardHeader>
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">FCR Improvement</CardTitle></CardHeader>
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
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">ROI Trend (%)</CardTitle></CardHeader>
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
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">🏆 Farmer Performance Rankings</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-3 px-2 font-medium">Rank</th><th className="text-left py-3 px-2 font-medium">Farmer</th><th className="text-right py-3 px-2 font-medium">Ponds</th><th className="text-right py-3 px-2 font-medium">Production</th><th className="text-right py-3 px-2 font-medium">FCR</th><th className="text-right py-3 px-2 font-medium">Mortality</th><th className="text-right py-3 px-2 font-medium">Score</th>
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

// ============ ALERTS ============
const allAlerts = [
  { id: 1, type: "critical", title: "High mortality detected", msg: "Batch #1247 in Pond P-3 showing 8% mortality in last 24h. Immediate attention required.", time: "15 min ago", module: "Farm" },
  { id: 2, type: "warning", title: "Low feed stock", msg: "Micro Pellets (0.5mm) only 12kg remaining — below reorder level of 15kg.", time: "2 hours ago", module: "Inventory" },
  { id: 3, type: "warning", title: "Water temperature spike", msg: "Pond A3 temperature reached 32°C — above safe threshold of 30°C.", time: "3 hours ago", module: "Farm" },
  { id: 4, type: "info", title: "Harvest scheduled", msg: "Pond B2 harvest planned for tomorrow. Estimated yield: 1,200 kg.", time: "5 hours ago", module: "Processing" },
  { id: 5, type: "critical", title: "Probiotics expiring soon", msg: "Probiotics stock (2kg) expires in April 2026. Reorder immediately.", time: "1 day ago", module: "Inventory" },
  { id: 6, type: "warning", title: "FCR above target", msg: "Pond P-7 FCR is 2.1 — above target of 1.8. Review feeding schedule.", time: "1 day ago", module: "Analytics" },
  { id: 7, type: "info", title: "New farmer onboarded", msg: "Priya Sharma has been added to the system with 6 ponds in Gujarat.", time: "2 days ago", module: "Farmer" },
  { id: 8, type: "success", title: "Batch transfer complete", msg: "NB-2399: 9,200 fry successfully transferred from Nursery N-A1 to Farm Pond P-3.", time: "2 days ago", module: "Nursery" },
  { id: 9, type: "info", title: "Processing batch completed", msg: "PB-499: 520kg processed with 76.9% yield — Grade A+.", time: "3 days ago", module: "Processing" },
  { id: 10, type: "success", title: "Payment processed", msg: "₹1,10,000 paid to Amit Singh for March production.", time: "3 days ago", module: "Finance" },
];

export const Alerts = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">Alerts & Notifications</h1>
      <p className="text-muted-foreground text-sm mt-1">System-wide alerts for feed, disease, harvest, and operations</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Critical", count: 2, color: "bg-destructive/10 text-destructive" },
        { label: "Warnings", count: 3, color: "bg-warning/10 text-warning" },
        { label: "Info", count: 3, color: "bg-info/10 text-info" },
        { label: "Resolved", count: 2, color: "bg-success/10 text-success" },
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
      <CardHeader className="pb-2"><CardTitle className="text-base font-heading">All Alerts</CardTitle></CardHeader>
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
