import { useState } from "react";
import { useBreeding } from "@/contexts/BreedingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, AlertTriangle, Play, Square, Activity, Egg, Fish, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["hsl(199,89%,32%)", "hsl(168,60%,42%)", "hsl(38,92%,50%)", "hsl(152,60%,40%)"];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const BreedingGroups = () => {
  const { breedingGroups, breedingCycles, addBreedingGroup, addBreedingCycle } = useBreeding();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [openGroup, setOpenGroup] = useState(false);
  const [openCycle, setOpenCycle] = useState(false);
  const pt = language === "pt";

  const myGroups = breedingGroups.filter(g => g.farmerId === user?.id);
  const myCycles = breedingCycles.filter(c => c.farmerId === user?.id);

  const [groupForm, setGroupForm] = useState({ maleCount: 0, femaleCount: 0, tankPond: "" });
  const [cycleForm, setCycleForm] = useState({ groupId: "", startDate: "", expectedEggDate: "", tankPond: "" });

  const totalMales = myGroups.reduce((a, g) => a + g.maleCount, 0);
  const totalFemales = myGroups.reduce((a, g) => a + g.femaleCount, 0);
  const totalEggs = myCycles.reduce((a, c) => a + c.totalEggs, 0);

  const handleAddGroup = () => {
    if (groupForm.maleCount <= 0 || groupForm.femaleCount <= 0 || !groupForm.tankPond) {
      toast({ title: pt ? "Erro" : "Error", description: pt ? "Preencha todos os campos" : "Fill all fields", variant: "destructive" });
      return;
    }
    const ratio = `1:${Math.round(groupForm.femaleCount / groupForm.maleCount)}`;
    addBreedingGroup({ ...groupForm, ratio, status: "Active", farmerId: user?.id || "" });
    toast({ title: pt ? "✅ Grupo Criado" : "✅ Group Created" });
    setGroupForm({ maleCount: 0, femaleCount: 0, tankPond: "" });
    setOpenGroup(false);
  };

  const handleStartCycle = () => {
    if (!cycleForm.groupId || !cycleForm.startDate) {
      toast({ title: pt ? "Erro" : "Error", description: pt ? "Selecione grupo e data" : "Select group and date", variant: "destructive" });
      return;
    }
    addBreedingCycle({ ...cycleForm, status: "Active", totalEggs: 0, fertilityPercent: 0, hatchRate: 0, farmerId: user?.id || "" });
    toast({ title: pt ? "✅ Ciclo Iniciado" : "✅ Cycle Started" });
    setCycleForm({ groupId: "", startDate: "", expectedEggDate: "", tankPond: "" });
    setOpenCycle(false);
  };

  const ratioValid = (m: number, f: number) => {
    if (m <= 0) return null;
    const r = f / m;
    return r >= 2 && r <= 4;
  };

  const groupStatusData = [
    { name: pt ? "Ativo" : "Active", value: myGroups.filter(g => g.status === "Active").length || 2 },
    { name: pt ? "Concluído" : "Completed", value: myGroups.filter(g => g.status === "Completed").length || 1 },
    { name: pt ? "Pendente" : "Pending", value: myGroups.filter(g => g.status === "Pending").length || 1 },
  ].filter(d => d.value > 0);

  const cycleData = myCycles.length > 0 ? myCycles.map(c => ({
    name: c.id,
    eggs: c.totalEggs / 1000,
    fertility: c.fertilityPercent,
    hatch: c.hatchRate,
  })) : [
    { name: "BC-001", eggs: 45, fertility: 90, hatch: 85 },
    { name: "BC-002", eggs: 52, fertility: 88, hatch: 82 },
    { name: "BC-003", eggs: 38, fertility: 92, hatch: 87 },
  ];

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> {pt ? "Grupos & Ciclos de Reprodução" : "Breeding Groups & Cycles"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{pt ? "Gerencie grupos, monitore ciclos e acompanhe produção" : "Manage groups, monitor cycles, and track production"}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openGroup} onOpenChange={setOpenGroup}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2" size="sm"><Plus className="w-4 h-4" />{pt ? "Novo Grupo" : "New Group"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle className="font-heading">{pt ? "Criar Grupo de Reprodução" : "Create Breeding Group"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Machos" : "Males"}</Label>
                    <Input type="number" value={groupForm.maleCount || ""} onChange={e => setGroupForm({...groupForm, maleCount: Number(e.target.value)})} placeholder="50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Fêmeas" : "Females"}</Label>
                    <Input type="number" value={groupForm.femaleCount || ""} onChange={e => setGroupForm({...groupForm, femaleCount: Number(e.target.value)})} placeholder="150" />
                  </div>
                </div>
                {groupForm.maleCount > 0 && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    ratioValid(groupForm.maleCount, groupForm.femaleCount) ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {ratioValid(groupForm.maleCount, groupForm.femaleCount) === false && <AlertTriangle className="w-4 h-4" />}
                    {pt ? "Proporção" : "Ratio"}: 1:{Math.round(groupForm.femaleCount / groupForm.maleCount)}
                    {ratioValid(groupForm.maleCount, groupForm.femaleCount) === false && ` — ${pt ? "Recomendado: 1:3" : "Recommended: 1:3"}`}
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>{pt ? "Tanque/Viveiro" : "Tank/Pond"}</Label>
                  <Input value={groupForm.tankPond} onChange={e => setGroupForm({...groupForm, tankPond: e.target.value})} placeholder="Tanque-R1" />
                </div>
                <Button onClick={handleAddGroup} className="w-full gradient-primary text-primary-foreground">{pt ? "Criar Grupo" : "Create Group"}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openCycle} onOpenChange={setOpenCycle}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" size="sm"><Play className="w-4 h-4" />{pt ? "Iniciar Ciclo" : "Start Cycle"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle className="font-heading">{pt ? "Iniciar Ciclo de Reprodução" : "Start Breeding Cycle"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>{pt ? "Grupo de Reprodução" : "Breeding Group"}</Label>
                  <Select value={cycleForm.groupId} onValueChange={v => setCycleForm({...cycleForm, groupId: v})}>
                    <SelectTrigger><SelectValue placeholder={pt ? "Selecionar grupo" : "Select group"} /></SelectTrigger>
                    <SelectContent>
                      {myGroups.filter(g => g.status === "Active").map(g => (
                        <SelectItem key={g.id} value={g.id}>{g.id} — {g.ratio} ({g.tankPond})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Data Início" : "Start Date"}</Label>
                    <Input type="date" value={cycleForm.startDate} onChange={e => setCycleForm({...cycleForm, startDate: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Previsão de Ovos" : "Expected Eggs"}</Label>
                    <Input type="date" value={cycleForm.expectedEggDate} onChange={e => setCycleForm({...cycleForm, expectedEggDate: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Tanque/Viveiro" : "Tank/Pond"}</Label>
                  <Input value={cycleForm.tankPond} onChange={e => setCycleForm({...cycleForm, tankPond: e.target.value})} placeholder="Tanque-R1" />
                </div>
                <Button onClick={handleStartCycle} className="w-full gradient-primary text-primary-foreground gap-2"><Play className="w-4 h-4" />{pt ? "Iniciar Ciclo" : "Start Cycle"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: pt ? "Total Grupos" : "Total Groups", value: 520, color: "text-primary", icon: Users },
          { label: pt ? "Ciclos Ativos" : "Active Cycles", value: 480, color: "text-accent", icon: Activity },
          { label: pt ? "Total Machos" : "Total Males", value: 240, color: "text-info", icon: Fish },
          { label: pt ? "Total Fêmeas" : "Total Females", value: 240, color: "text-pink-500", icon: Fish },
          { label: pt ? "Total Ovos" : "Total Eggs", value: "4,35,689", color: "text-warning", icon: Egg },
          { label: pt ? "Fertilidade Média" : "Avg Fertility", value: "90%", color: "text-success", icon: TrendingUp },
        ].map(s => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <s.icon className={`w-4 h-4 ${s.color} mb-1`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Status dos Grupos" : "Group Status"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={groupStatusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel}>
                  {groupStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {groupStatusData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground">{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Produção por Ciclo (K ovos)" : "Eggs per Cycle (K)"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="eggs" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.15} name={pt ? "Ovos (K)" : "Eggs (K)"} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Grupos de Reprodução" : "Breeding Groups"}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2.5 px-2 font-medium">ID</th>
                <th className="text-right py-2.5 px-2 font-medium">{pt ? "Machos" : "Males"}</th>
                <th className="text-right py-2.5 px-2 font-medium">{pt ? "Fêmeas" : "Females"}</th>
                <th className="text-center py-2.5 px-2 font-medium">{pt ? "Proporção" : "Ratio"}</th>
                <th className="text-left py-2.5 px-2 font-medium">{pt ? "Tanque" : "Tank"}</th>
                <th className="text-left py-2.5 px-2 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {myGroups.map(g => (
                  <tr key={g.id} className="border-b border-border/50">
                    <td className="py-2.5 px-2 font-mono text-xs text-primary">{g.id}</td>
                    <td className="py-2.5 px-2 text-right text-foreground">{g.maleCount}</td>
                    <td className="py-2.5 px-2 text-right text-foreground">{g.femaleCount}</td>
                    <td className="py-2.5 px-2 text-center"><Badge variant="secondary" className="text-xs">{g.ratio}</Badge></td>
                    <td className="py-2.5 px-2 text-muted-foreground">{g.tankPond}</td>
                    <td className="py-2.5 px-2"><Badge variant={g.status === "Active" ? "default" : "secondary"} className="text-xs">{pt ? (g.status === "Active" ? "Ativo" : g.status === "Completed" ? "Concluído" : "Pendente") : g.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cycles Dashboard */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> {pt ? "Ciclos de Reprodução" : "Breeding Cycles"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCycles.map(c => (
              <div key={c.id} className={`p-4 rounded-lg border ${c.status === "Active" ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary font-bold">{c.id}</span>
                    <Badge variant={c.status === "Active" ? "default" : "secondary"} className="text-xs">
                      {c.status === "Active" && <Play className="w-3 h-3 mr-1" />}
                      {c.status === "Completed" && <Square className="w-3 h-3 mr-1" />}
                      {pt ? (c.status === "Active" ? "Ativo" : "Concluído") : c.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{pt ? "Grupo" : "Group"}: {c.groupId}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div><span className="text-muted-foreground">{pt ? "Início" : "Start"}: </span><span className="text-foreground font-medium">{c.startDate}</span></div>
                  <div><span className="text-muted-foreground">{pt ? "Prev. Ovos" : "Exp. Eggs"}: </span><span className="text-foreground font-medium">{c.expectedEggDate}</span></div>
                  <div><span className="text-muted-foreground">{pt ? "Total Ovos" : "Total Eggs"}: </span><span className="text-foreground font-medium">{c.totalEggs.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">{pt ? "Fertilidade" : "Fertility"}: </span><span className="text-foreground font-medium">{c.fertilityPercent}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreedingGroups;
