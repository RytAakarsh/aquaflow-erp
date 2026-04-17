import { useState } from "react";
import { useBreeding } from "@/contexts/BreedingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Egg, CheckCircle2, XCircle, Search, Truck, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const EggBatchManagement = () => {
  const { eggCollections, eggBatches, breedingCycles, addEggCollection, addEggBatch, updateBatchStatus, addHatcheryTransfer } = useBreeding();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [openCollect, setOpenCollect] = useState(false);
  const [openQC, setOpenQC] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  const myBatches = eggBatches.filter(b => b.farmerId === user?.id);
  const myCollections = eggCollections.filter(c => c.farmerId === user?.id);
  const myCycles = breedingCycles.filter(c => c.farmerId === user?.id);

  const [collectForm, setCollectForm] = useState({ cycleId: "", groupId: "", eggQuantity: 0, fertilizedEggs: 0, unfertilized: 0, collectedBy: "" });
  const [qcForm, setQCForm] = useState({ deadEggs: 0, remarks: "", grade: "A" as "A"|"B"|"C"|"D" });
  const [transferForm, setTransferForm] = useState({ toLocation: "", quantity: 0 });

  const handleCollect = () => {
    if (!collectForm.cycleId || collectForm.eggQuantity <= 0) {
      toast({ title: pt ? "Erro" : "Error", description: pt ? "Preencha campos obrigatórios" : "Fill required fields", variant: "destructive" });
      return;
    }
    const batchId = `EGG-2026-${String(eggBatches.length + 1).padStart(3, "0")}`;
    addEggCollection({ ...collectForm, batchId, collectionDate: new Date().toISOString().split("T")[0], farmerId: user?.id || "" });
    addEggBatch({ cycleId: collectForm.cycleId, eggQuantity: collectForm.eggQuantity, status: "Pending", currentStage: "Breeding", fertilizationRate: Math.round(collectForm.fertilizedEggs / collectForm.eggQuantity * 100), qualityGrade: "B", deadEggs: 0, remarks: "", farmerId: user?.id || "" });
    toast({ title: pt ? "✅ Ovos Coletados" : "✅ Eggs Collected", description: `${pt ? "Lote" : "Batch"}: ${batchId}` });
    setCollectForm({ cycleId: "", groupId: "", eggQuantity: 0, fertilizedEggs: 0, unfertilized: 0, collectedBy: "" });
    setOpenCollect(false);
  };

  const handleQC = () => {
    if (!selectedBatch) return;
    const action = qcForm.grade === "D" ? "Rejected" : "Approved";
    updateBatchStatus(selectedBatch, action, qcForm.grade);
    toast({ title: action === "Approved" ? (pt ? "✅ Aprovado" : "✅ Approved") : (pt ? "❌ Rejeitado" : "❌ Rejected") });
    setOpenQC(false);
    setQCForm({ deadEggs: 0, remarks: "", grade: "A" });
  };

  const handleTransfer = () => {
    if (!selectedBatch || !transferForm.toLocation || transferForm.quantity <= 0) return;
    addHatcheryTransfer({ batchId: selectedBatch, fromLocation: pt ? "Reprodução" : "Breeding", toLocation: transferForm.toLocation, quantity: transferForm.quantity, transferDate: new Date().toISOString().split("T")[0], farmerId: user?.id || "" });
    toast({ title: pt ? "🚚 Transferido para Incubatório" : "🚚 Transferred to Hatchery" });
    setOpenTransfer(false);
    setTransferForm({ toLocation: "", quantity: 0 });
  };

  const stageColor = (s: string) => s === "Hatchery" ? "text-success" : s === "QC" ? "text-warning" : "text-info";
  const statusVariant = (s: string) => s === "Approved" ? "default" as const : s === "Rejected" ? "destructive" as const : s === "Transferred" ? "default" as const : "secondary" as const;

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Egg className="w-5 h-5 text-primary" /> {pt ? "Coleta & Lotes de Ovos" : "Egg Collection & Batches"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{pt ? "Coleta, controle de qualidade e transferência" : "Collection, quality check and transfer"}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={openCollect} onOpenChange={setOpenCollect}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2" size="sm"><Plus className="w-4 h-4" />{pt ? "Coletar Ovos" : "Collect Eggs"}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle className="font-heading">{pt ? "Registrar Coleta de Ovos" : "Record Egg Collection"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>{pt ? "Ciclo de Reprodução" : "Breeding Cycle"}</Label>
                  <Select value={collectForm.cycleId} onValueChange={v => setCollectForm({...collectForm, cycleId: v})}>
                    <SelectTrigger><SelectValue placeholder={pt ? "Selecionar ciclo" : "Select cycle"} /></SelectTrigger>
                    <SelectContent>
                      {myCycles.map(c => <SelectItem key={c.id} value={c.id}>{c.id} — {c.groupId}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Total Ovos" : "Egg Qty"}</Label>
                    <Input type="number" value={collectForm.eggQuantity || ""} onChange={e => setCollectForm({...collectForm, eggQuantity: Number(e.target.value)})} placeholder="50000" className="text-lg font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Férteis" : "Fertilized"}</Label>
                    <Input type="number" value={collectForm.fertilizedEggs || ""} onChange={e => setCollectForm({...collectForm, fertilizedEggs: Number(e.target.value)})} placeholder="45000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Inférteis" : "Unfertilized"}</Label>
                    <Input type="number" value={collectForm.unfertilized || ""} onChange={e => setCollectForm({...collectForm, unfertilized: Number(e.target.value)})} placeholder="5000" />
                  </div>
                </div>
                {collectForm.eggQuantity > 0 && (
                  <div className="p-3 rounded-lg bg-info/10">
                    <p className="text-sm text-info font-medium">{pt ? "Taxa de Fertilização" : "Fertilization Rate"}: {Math.round(collectForm.fertilizedEggs / collectForm.eggQuantity * 100)}%</p>
                    <Progress value={collectForm.fertilizedEggs / collectForm.eggQuantity * 100} className="h-2 mt-2 [&>div]:bg-info" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>{pt ? "Coletado Por" : "Collected By"}</Label>
                  <Input value={collectForm.collectedBy} onChange={e => setCollectForm({...collectForm, collectedBy: e.target.value})} placeholder={user?.name || ""} />
                </div>
                <Button onClick={handleCollect} className="w-full gradient-primary text-primary-foreground gap-2"><Egg className="w-4 h-4" />{pt ? "Registrar Coleta" : "Record Collection"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: pt ? "Total Lotes" : "Total Batches", value: 470, color: "text-primary" },
          { label: pt ? "Pendentes" : "Pending", value: 120, color: "text-warning" },
          { label: pt ? "Aprovados" : "Approved", value: 250, color: "text-success" },
          { label: pt ? "Transferidos" : "Transferred", value: 100, color: "text-info" },
        ].map(s => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Batches List */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base font-heading">{pt ? "Lotes de Ovos" : "Egg Batches"}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myBatches.map(b => (
              <div key={b.id} className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary font-bold">{b.id}</span>
                    <Badge variant={statusVariant(b.status)} className="text-xs">
                      {pt ? (b.status === "Pending" ? "Pendente" : b.status === "Approved" ? "Aprovado" : b.status === "Rejected" ? "Rejeitado" : "Transferido") : b.status}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${stageColor(b.currentStage)}`}>
                      {pt ? (b.currentStage === "Breeding" ? "Reprodução" : b.currentStage === "QC" ? "Controle" : b.currentStage === "Hatchery" ? "Incubatório" : "Berçário") : b.currentStage}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {b.status === "Pending" && (
                      <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => { setSelectedBatch(b.id); setOpenQC(true); }}>
                        <ClipboardCheck className="w-3 h-3" />{pt ? "CQ" : "QC"}
                      </Button>
                    )}
                    {b.status === "Approved" && (
                      <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => { setSelectedBatch(b.id); setTransferForm({...transferForm, quantity: b.eggQuantity}); setOpenTransfer(true); }}>
                        <Truck className="w-3 h-3" />{pt ? "Transferir" : "Transfer"}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div><span className="text-muted-foreground">{pt ? "Qtd Ovos" : "Eggs"}: </span><span className="text-foreground font-medium">{b.eggQuantity.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">{pt ? "Fertilização" : "Fert. Rate"}: </span><span className="text-foreground font-medium">{b.fertilizationRate}%</span></div>
                  <div><span className="text-muted-foreground">{pt ? "Classe" : "Grade"}: </span><span className={`font-bold ${b.qualityGrade === "A" ? "text-success" : b.qualityGrade === "B" ? "text-info" : "text-warning"}`}>{b.qualityGrade}</span></div>
                  <div><span className="text-muted-foreground">{pt ? "Ciclo" : "Cycle"}: </span><span className="text-foreground font-medium">{b.cycleId}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QC Dialog */}
      <Dialog open={openQC} onOpenChange={setOpenQC}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{pt ? "Controle de Qualidade" : "Quality Check"} — {selectedBatch}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{pt ? "Ovos Mortos" : "Dead Eggs"}</Label>
              <Input type="number" value={qcForm.deadEggs || ""} onChange={e => setQCForm({...qcForm, deadEggs: Number(e.target.value)})} />
            </div>
            <div className="space-y-1.5">
              <Label>{pt ? "Classificação" : "Grade"}</Label>
              <Select value={qcForm.grade} onValueChange={v => setQCForm({...qcForm, grade: v as any})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A — {pt ? "Excelente" : "Excellent"}</SelectItem>
                  <SelectItem value="B">B — {pt ? "Bom" : "Good"}</SelectItem>
                  <SelectItem value="C">C — {pt ? "Regular" : "Fair"}</SelectItem>
                  <SelectItem value="D">D — {pt ? "Rejeitar" : "Reject"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{pt ? "Observações" : "Remarks"}</Label>
              <Textarea value={qcForm.remarks} onChange={e => setQCForm({...qcForm, remarks: e.target.value})} rows={2} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleQC} className="flex-1 gap-2" variant={qcForm.grade === "D" ? "destructive" : "default"}>
                {qcForm.grade === "D" ? <><XCircle className="w-4 h-4" />{pt ? "Rejeitar" : "Reject"}</> : <><CheckCircle2 className="w-4 h-4" />{pt ? "Aprovar" : "Approve"}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={openTransfer} onOpenChange={setOpenTransfer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{pt ? "Transferir para Incubatório" : "Transfer to Hatchery"} — {selectedBatch}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{pt ? "Destino" : "To Location"}</Label>
              <Select value={transferForm.toLocation} onValueChange={v => setTransferForm({...transferForm, toLocation: v})}>
                <SelectTrigger><SelectValue placeholder={pt ? "Selecionar destino" : "Select destination"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incubatório - Inc-01">{pt ? "Incubatório" : "Hatchery"} - Inc-01</SelectItem>
                  <SelectItem value="Incubatório - Inc-02">{pt ? "Incubatório" : "Hatchery"} - Inc-02</SelectItem>
                  <SelectItem value="Incubatório - Inc-03">{pt ? "Incubatório" : "Hatchery"} - Inc-03</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{pt ? "Quantidade" : "Quantity"}</Label>
              <Input type="number" value={transferForm.quantity || ""} onChange={e => setTransferForm({...transferForm, quantity: Number(e.target.value)})} />
            </div>
            <Button onClick={handleTransfer} className="w-full gradient-primary text-primary-foreground gap-2"><Truck className="w-4 h-4" />{pt ? "Transferir Agora" : "Transfer Now"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EggBatchManagement;
