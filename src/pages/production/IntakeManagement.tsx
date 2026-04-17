import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const IntakeManagement = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [intakes, setIntakes] = useState([
    { id: "INT-001", batchId: "PB-601", source: "Carlos Silva - São Paulo", qty: "850 kg", grade: "A", fishType: pt ? "Tilápia Nilo" : "Nile Tilapia", receivedAt: "2026-04-07 08:30", transportId: "TR-001", status: pt ? "Processando" : "Processing" },
    { id: "INT-002", batchId: "PB-602", source: "João Santos - Minas Gerais", qty: "620 kg", grade: "A+", fishType: pt ? "Tilápia GIFT" : "GIFT Tilapia", receivedAt: "2026-04-07 10:15", transportId: "TR-006", status: pt ? "Concluído" : "Completed" },
    { id: "INT-003", batchId: "PB-603", source: "Pedro Oliveira - Goiás", qty: "1200 kg", grade: "B", fishType: "Tambaqui", receivedAt: "2026-04-08 07:45", transportId: "TR-003", status: pt ? "QC Pendente" : "QC Pending" },
    { id: "INT-004", batchId: "PB-604", source: "Rafael Costa - Bahia", qty: "580 kg", grade: "—", fishType: "Pintado", receivedAt: "2026-04-08 11:00", transportId: "TR-008", status: pt ? "Recebido" : "Received" },
    { id: "INT-005", batchId: "PB-605", source: "Marcos Lima - Paraná", qty: "940 kg", grade: "A", fishType: pt ? "Tilápia Nilo" : "Nile Tilapia", receivedAt: "2026-04-08 14:30", transportId: "TR-012", status: pt ? "Processando" : "Processing" },
     { id: "INT-003", batchId: "PB-603", source: "Pedro Oliveira - Goiás", qty: "1200 kg", grade: "B", fishType: "Tambaqui", receivedAt: "2026-04-08 07:45", transportId: "TR-003", status: pt ? "QC Pendente" : "QC Pending" },
    { id: "INT-004", batchId: "PB-604", source: "Rafael Costa - Bahia", qty: "580 kg", grade: "—", fishType: "Pintado", receivedAt: "2026-04-08 11:00", transportId: "TR-008", status: pt ? "Recebido" : "Received" },
     { id: "INT-001", batchId: "PB-601", source: "Carlos Silva - São Paulo", qty: "850 kg", grade: "A", fishType: pt ? "Tilápia Nilo" : "Nile Tilapia", receivedAt: "2026-04-07 08:30", transportId: "TR-001", status: pt ? "Processando" : "Processing" },
    { id: "INT-002", batchId: "PB-602", source: "João Santos - Minas Gerais", qty: "620 kg", grade: "A+", fishType: pt ? "Tilápia GIFT" : "GIFT Tilapia", receivedAt: "2026-04-07 10:15", transportId: "TR-006", status: pt ? "Concluído" : "Completed" },
   
    { id: "INT-005", batchId: "PB-605", source: "Marcos Lima - Paraná", qty: "940 kg", grade: "A", fishType: pt ? "Tilápia Nilo" : "Nile Tilapia", receivedAt: "2026-04-08 14:30", transportId: "TR-012", status: pt ? "Processando" : "Processing" },
  ]);


  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ source: "", qty: "", grade: "A", transportId: "", fishType: "Tilápia Nilo" });

  const handleAdd = () => {
    if (!form.source || !form.qty) return;
    const newIntake = {
      id: `INT-${String(intakes.length + 1).padStart(3, "0")}`,
      batchId: `PB-${600 + intakes.length + 1}`,
      source: form.source,
      qty: form.qty,
      grade: form.grade,
      fishType: form.fishType,
      receivedAt: new Date().toLocaleString(),
      transportId: form.transportId || "—",
      status: pt ? "Recebido" : "Received",
    };
    setIntakes([newIntake, ...intakes]);
    setForm({ source: "", qty: "", grade: "A", transportId: "", fishType: "Tilápia Nilo" });
    setDialogOpen(false);
    toast({ title: pt ? "Recebimento Registrado" : "Intake Recorded", description: `${newIntake.batchId}` });
  };

  const statusColor = (s: string) => {
    if (s.includes("Concluído") || s.includes("Completed")) return "bg-green-100 text-green-700";
    if (s.includes("Processando") || s.includes("Processing")) return "bg-blue-100 text-blue-700";
    if (s.includes("QC")) return "bg-orange-100 text-orange-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Recebimento de Peixes" : "Fish Intake"}</h1>
          <p className="text-muted-foreground text-sm">{pt ? "Registre e gerencie recebimentos das fazendas" : "Record and manage farm deliveries"}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />{pt ? "Novo Recebimento" : "New Intake"}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{pt ? "Registrar Recebimento" : "Record Intake"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder={pt ? "Origem (ex: Carlos Silva - SP)" : "Source (e.g. Carlos Silva - SP)"} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
              <Input placeholder={pt ? "Quantidade (ex: 8.500 kg)" : "Quantity (e.g. 8,500 kg)"} value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
              <Select value={form.fishType} onValueChange={v => setForm({ ...form, fishType: v })}>
                <SelectTrigger><SelectValue placeholder={pt ? "Espécie" : "Fish Species"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tilápia Nilo">{pt ? "Tilápia Nilo" : "Nile Tilapia"}</SelectItem>
                  <SelectItem value="Tilápia GIFT">{pt ? "Tilápia GIFT" : "GIFT Tilapia"}</SelectItem>
                  <SelectItem value="Tambaqui">Tambaqui</SelectItem>
                  <SelectItem value="Pintado">Pintado</SelectItem>
                  <SelectItem value="Pacu">Pacu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.grade} onValueChange={v => setForm({ ...form, grade: v })}>
                <SelectTrigger><SelectValue placeholder={pt ? "Classe" : "Grade"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder={pt ? "ID Transporte (opcional)" : "Transport ID (optional)"} value={form.transportId} onChange={e => setForm({ ...form, transportId: e.target.value })} />
              <Button onClick={handleAdd} className="w-full">{pt ? "Registrar" : "Record"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">20</p><p className="text-xs text-muted-foreground">{pt ? "Total de Lotes" : "Total Batches"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">9,900 kg</p><p className="text-xs text-muted-foreground">{pt ? "Total Recebido" : "Total Received"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">A</p><p className="text-xs text-muted-foreground">{pt ? "Classe Média" : "Avg Grade"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">5</p><p className="text-xs text-muted-foreground">{pt ? "Fazendas" : "Farms"}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">ID</th>
              <th className="text-left p-3 font-medium">{pt ? "Lote" : "Batch"}</th>
              <th className="text-left p-3 font-medium">{pt ? "Origem" : "Source"}</th>
              <th className="text-left p-3 font-medium">{pt ? "Espécie" : "Species"}</th>
              <th className="text-left p-3 font-medium">{pt ? "Quantidade" : "Quantity"}</th>
              <th className="text-left p-3 font-medium">{pt ? "Classe" : "Grade"}</th>
              <th className="text-left p-3 font-medium">{pt ? "Transporte" : "Transport"}</th>
              <th className="text-left p-3 font-medium">{pt ? "Recebido em" : "Received At"}</th>
              <th className="text-left p-3 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {intakes.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{r.id}</td>
                  <td className="p-3 font-mono text-xs">{r.batchId}</td>
                  <td className="p-3">{r.source}</td>
                  <td className="p-3"><Badge variant="secondary" className="text-xs">{r.fishType}</Badge></td>
                  <td className="p-3">{r.qty}</td>
                  <td className="p-3"><Badge variant="secondary">{r.grade}</Badge></td>
                  <td className="p-3 font-mono text-xs">{r.transportId}</td>
                  <td className="p-3 text-muted-foreground text-xs">{r.receivedAt}</td>
                  <td className="p-3"><Badge className={statusColor(r.status)} variant="secondary">{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntakeManagement;
