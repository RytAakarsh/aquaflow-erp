import { useBreeding } from "@/contexts/BreedingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fish, Users, Egg, Truck, Activity, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const COLORS = ["hsl(199,89%,32%)", "hsl(168,60%,42%)", "hsl(38,92%,50%)", "hsl(152,60%,40%)", "hsl(0,72%,51%)"];
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="hsl(210,10%,45%)" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const AdminBreedingOverview = () => {
  const { broodstock, breedingGroups, breedingCycles, eggBatches, eggCollections, hatcheryTransfers } = useBreeding();
  const { language } = useLanguage();
  const pt = language === "pt";

  const totalEggs = eggCollections.reduce((a, c) => a + c.eggQuantity, 0);
  const totalFertilized = eggCollections.reduce((a, c) => a + c.fertilizedEggs, 0);
  const avgFertility = totalEggs > 0 ? Math.round(totalFertilized / totalEggs * 100) : 0;
  const activeCycles = breedingCycles.filter(c => c.status === "Active").length;

  const stats = [
    { label: pt ? "Total Reprodutores" : "Total Broodstock", value: broodstock.length, icon: Fish, color: "text-primary", sub: `${broodstock.filter(b => b.gender === "Male").length}M / ${broodstock.filter(b => b.gender === "Female").length}F` },
    { label: pt ? "Grupos Ativos" : "Active Groups", value: breedingGroups.filter(g => g.status === "Active").length, icon: Users, color: "text-accent", sub: `${breedingGroups.length} ${pt ? "total" : "total"}` },
    { label: pt ? "Ciclos Ativos" : "Active Cycles", value: activeCycles, icon: Activity, color: "text-info", sub: `${breedingCycles.length} ${pt ? "total" : "total"}` },
    { label: pt ? "Total Ovos Produzidos" : "Total Eggs Produced", value: `${(totalEggs/1000).toFixed(0)}K`, icon: Egg, color: "text-warning", sub: `${avgFertility}% ${pt ? "fertilidade" : "fertility"}` },
    { label: pt ? "Lotes Ativos" : "Active Batches", value: eggBatches.filter(b => b.status !== "Rejected").length, icon: CheckCircle2, color: "text-success", sub: `${eggBatches.filter(b => b.status === "Pending").length} ${pt ? "pendentes" : "pending"}` },
    { label: pt ? "Transferências" : "Transfers", value: hatcheryTransfers.length, icon: Truck, color: "text-primary", sub: `${hatcheryTransfers.reduce((a,t) => a+t.quantity, 0).toLocaleString()} ${pt ? "ovos" : "eggs"}` },
  ];

  const speciesData = [
    { name: "Nilo", value: broodstock.filter(b => b.breedType === "Nilo").length },
    { name: "GIFT", value: broodstock.filter(b => b.breedType === "GIFT").length },
    { name: "Chitralada", value: broodstock.filter(b => b.breedType === "Chitralada").length },
  ].filter(d => d.value > 0);

  const batchStatusData = [
    { name: pt ? "Pendente" : "Pending", value: eggBatches.filter(b => b.status === "Pending").length },
    { name: pt ? "Aprovado" : "Approved", value: eggBatches.filter(b => b.status === "Approved").length },
    { name: pt ? "Transferido" : "Transferred", value: eggBatches.filter(b => b.status === "Transferred").length },
    { name: pt ? "Rejeitado" : "Rejected", value: eggBatches.filter(b => b.status === "Rejected").length },
  ].filter(d => d.value > 0);

  const eggProductionData = eggCollections.map(c => ({
    date: c.collectionDate,
    total: c.eggQuantity / 1000,
    fertilized: c.fertilizedEggs / 1000,
  }));

  const farmerBreedingData = [
    { name: "Carlos S.", broodstock: broodstock.filter(b => b.farmerId === "f1").length, groups: breedingGroups.filter(g => g.farmerId === "f1").length, eggs: eggCollections.filter(c => c.farmerId === "f1").reduce((a,c)=>a+c.eggQuantity,0)/1000 },
    { name: "Pedro O.", broodstock: broodstock.filter(b => b.farmerId === "f3").length, groups: breedingGroups.filter(g => g.farmerId === "f3").length, eggs: eggCollections.filter(c => c.farmerId === "f3").reduce((a,c)=>a+c.eggQuantity,0)/1000 },
    { name: "João S.", broodstock: broodstock.filter(b => b.farmerId === "f2").length, groups: breedingGroups.filter(g => g.farmerId === "f2").length, eggs: eggCollections.filter(c => c.farmerId === "f2").reduce((a,c)=>a+c.eggQuantity,0)/1000 },
  ];

  const healthData = [
    { name: pt ? "Saudável" : "Healthy", value: broodstock.filter(b => b.healthStatus === "Healthy").length },
    { name: pt ? "Descanso" : "Resting", value: broodstock.filter(b => b.healthStatus === "Resting").length },
    { name: pt ? "Quarentena" : "Quarantine", value: broodstock.filter(b => b.healthStatus === "Quarantine").length },
    { name: pt ? "Doente" : "Sick", value: broodstock.filter(b => b.healthStatus === "Sick").length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading flex items-center gap-2">
          <Egg className="w-6 h-6 text-primary" /> {pt ? "Visão Geral da Reprodução" : "Breeding Overview"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{pt ? "Acompanhe todo o fluxo de reprodução dos produtores" : "Track the entire breeding flow from all farmers"}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{pt ? "Visão Geral" : "Overview"}</TabsTrigger>
          <TabsTrigger value="broodstock">{pt ? "Reprodutores" : "Broodstock"}</TabsTrigger>
          <TabsTrigger value="batches">{pt ? "Lotes" : "Batches"}</TabsTrigger>
          <TabsTrigger value="transfers">{pt ? "Transferências" : "Transfers"}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Distribuição por Linhagem" : "Breed Distribution"}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={speciesData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel}>
                    {speciesData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Status dos Lotes" : "Batch Status"}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={batchStatusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel}>
                    {batchStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Saúde dos Reprodutores" : "Broodstock Health"}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={healthData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel}>
                    {healthData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Produção de Ovos (K)" : "Egg Production (K)"}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={eggProductionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                    <XAxis dataKey="date" fontSize={10} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke="hsl(199,89%,32%)" fill="hsl(199,89%,32%)" fillOpacity={0.15} name={pt ? "Total" : "Total"} />
                    <Area type="monotone" dataKey="fertilized" stroke="hsl(168,60%,42%)" fill="hsl(168,60%,42%)" fillOpacity={0.15} name={pt ? "Férteis" : "Fertilized"} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Desempenho por Produtor" : "Farmer Performance"}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={farmerBreedingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,18%,90%)" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="broodstock" fill="hsl(199,89%,32%)" radius={[4,4,0,0]} name={pt ? "Reprodutores" : "Broodstock"} />
                    <Bar dataKey="eggs" fill="hsl(168,60%,42%)" radius={[4,4,0,0]} name={pt ? "Ovos (K)" : "Eggs (K)"} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="broodstock">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Todos os Reprodutores" : "All Broodstock"}</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2.5 px-2 font-medium">ID</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Produtor" : "Farmer"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Espécie" : "Species"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Linhagem" : "Breed"}</th>
                    <th className="text-center py-2.5 px-2 font-medium">{pt ? "Sexo" : "Gender"}</th>
                    <th className="text-right py-2.5 px-2 font-medium">{pt ? "Idade" : "Age"}</th>
                    <th className="text-right py-2.5 px-2 font-medium">{pt ? "Peso" : "Weight"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Tanque" : "Tank"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Saúde" : "Health"}</th>
                  </tr></thead>
                  <tbody>
                    {broodstock.map(b => (
                      <tr key={b.id} className="border-b border-border/50">
                        <td className="py-2 px-2 font-mono text-xs text-primary">{b.id}</td>
                        <td className="py-2 px-2 text-foreground text-xs">{b.farmerId === "f1" ? "Carlos S." : b.farmerId === "f3" ? "Pedro O." : b.farmerId === "f2" ? "João S." : "Rafael C."}</td>
                        <td className="py-2 px-2 text-muted-foreground">{b.species}</td>
                        <td className="py-2 px-2 text-muted-foreground">{b.breedType}</td>
                        <td className="py-2 px-2 text-center"><Badge variant={b.gender === "Male" ? "secondary" : "default"} className="text-xs">{pt ? (b.gender === "Male" ? "M" : "F") : b.gender[0]}</Badge></td>
                        <td className="py-2 px-2 text-right text-muted-foreground">{b.age}m</td>
                        <td className="py-2 px-2 text-right text-muted-foreground">{b.weight}kg</td>
                        <td className="py-2 px-2 text-muted-foreground">{b.tankPond}</td>
                        <td className="py-2 px-2"><Badge variant={b.healthStatus === "Healthy" ? "default" : b.healthStatus === "Resting" ? "secondary" : "destructive"} className="text-xs">{pt ? (b.healthStatus === "Healthy" ? "Saudável" : b.healthStatus === "Resting" ? "Descanso" : b.healthStatus === "Quarantine" ? "Quarentena" : "Doente") : b.healthStatus}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Todos os Lotes de Ovos" : "All Egg Batches"}</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Lote" : "Batch"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Ciclo" : "Cycle"}</th>
                    <th className="text-right py-2.5 px-2 font-medium">{pt ? "Ovos" : "Eggs"}</th>
                    <th className="text-right py-2.5 px-2 font-medium">{pt ? "Fertilização" : "Fert. %"}</th>
                    <th className="text-center py-2.5 px-2 font-medium">{pt ? "Classe" : "Grade"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Estágio" : "Stage"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">Status</th>
                  </tr></thead>
                  <tbody>
                    {eggBatches.map(b => (
                      <tr key={b.id} className="border-b border-border/50">
                        <td className="py-2.5 px-2 font-mono text-xs text-primary">{b.id}</td>
                        <td className="py-2.5 px-2 text-muted-foreground text-xs">{b.cycleId}</td>
                        <td className="py-2.5 px-2 text-right text-foreground">{b.eggQuantity.toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-right">
                          <span className={b.fertilizationRate >= 85 ? "text-success" : b.fertilizationRate >= 70 ? "text-warning" : "text-destructive"}>{b.fertilizationRate}%</span>
                        </td>
                        <td className="py-2.5 px-2 text-center"><Badge variant="outline" className={`text-xs ${b.qualityGrade === "A" ? "text-success" : b.qualityGrade === "B" ? "text-info" : "text-warning"}`}>{b.qualityGrade}</Badge></td>
                        <td className="py-2.5 px-2 text-xs text-muted-foreground">{pt ? (b.currentStage === "Breeding" ? "Reprodução" : b.currentStage === "QC" ? "Controle" : b.currentStage === "Hatchery" ? "Incubatório" : "Berçário") : b.currentStage}</td>
                        <td className="py-2.5 px-2"><Badge variant={b.status === "Approved" ? "default" : b.status === "Rejected" ? "destructive" : b.status === "Transferred" ? "default" : "secondary"} className="text-xs">{pt ? (b.status === "Pending" ? "Pendente" : b.status === "Approved" ? "Aprovado" : b.status === "Rejected" ? "Rejeitado" : "Transferido") : b.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Transferências para Incubatório" : "Hatchery Transfers"}</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2.5 px-2 font-medium">ID</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Lote" : "Batch"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "De" : "From"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Para" : "To"}</th>
                    <th className="text-right py-2.5 px-2 font-medium">{pt ? "Qtd" : "Qty"}</th>
                    <th className="text-left py-2.5 px-2 font-medium">{pt ? "Data" : "Date"}</th>
                  </tr></thead>
                  <tbody>
                    {hatcheryTransfers.map(t => (
                      <tr key={t.id} className="border-b border-border/50">
                        <td className="py-2.5 px-2 font-mono text-xs text-primary">{t.id}</td>
                        <td className="py-2.5 px-2 font-mono text-xs">{t.batchId}</td>
                        <td className="py-2.5 px-2 text-muted-foreground">{t.fromLocation}</td>
                        <td className="py-2.5 px-2 text-muted-foreground">{t.toLocation}</td>
                        <td className="py-2.5 px-2 text-right text-foreground font-medium">{t.quantity.toLocaleString()}</td>
                        <td className="py-2.5 px-2 text-muted-foreground">{t.transferDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Section */}
          <Card className="shadow-card border-border/50 mt-4">
            <CardHeader className="pb-2"><CardTitle className="text-base font-heading flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" />{pt ? "Alertas de Reprodução" : "Breeding Alerts"}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { msg: pt ? "Baixa fertilização no Lote EGG-2026-003 — ciclo BC-002 precisa de atenção" : "Low fertilization in Batch EGG-2026-003 — cycle BC-002 needs attention", type: "warning" },
                { msg: pt ? "Reprodutor BS-008 em quarentena — João Santos, Minas Gerais" : "Broodstock BS-008 in quarantine — João Santos, Minas Gerais", type: "warning" },
                { msg: pt ? "Grupo BG-01 com performance excelente — 90% fertilidade" : "Group BG-01 excellent performance — 90% fertility", type: "success" },
                { msg: pt ? "3 ciclos ativos — produção estimada de 127K ovos" : "3 active cycles — estimated 127K egg production", type: "info" },
              ].map((a, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${a.type === "warning" ? "bg-warning/10" : a.type === "success" ? "bg-success/10" : "bg-info/10"}`}>
                  <p className="text-foreground">{a.msg}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBreedingOverview;
