import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransportRequest {
  id: string;
  source: string;
  destination: string;
  itemType: string;
  quantity: string;
  priority: string;
  status: string;
  createdAt: string;
  requestedBy: string;
}

const TransportRequests = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [requests, setRequests] = useState<TransportRequest[]>([
    { id: "TR-001", source: pt ? "Fazenda Silva - São Paulo" : "Silva Farm - São Paulo", destination: pt ? "Processamento Central" : "Central Processing", itemType: pt ? "Peixes" : "Fish", quantity: "1200 kg", priority: pt ? "Normal" : "Normal", status: pt ? "Entregue" : "Delivered", createdAt: "2026-04-07", requestedBy: "Carlos Silva" },
    { id: "TR-002", source: pt ? "Incubatório - Minas Gerais" : "Hatchery - Minas Gerais", destination: pt ? "Fazenda Santos" : "Santos Farm", itemType: pt ? "Alevinos" : "Fry", quantity: "1000 kg", priority: pt ? "Urgente" : "Urgent", status: pt ? "Em Trânsito" : "In Transit", createdAt: "2026-04-08", requestedBy: "Admin" },
    { id: "TR-003", source: pt ? "Fazenda Oliveira - Goiás" : "Oliveira Farm - Goiás", destination: pt ? "Processamento Central" : "Central Processing", itemType: pt ? "Peixes" : "Fish", quantity: "800 kg", priority: pt ? "Normal" : "Normal", status: pt ? "Pendente" : "Pending", createdAt: "2026-04-08", requestedBy: "Pedro Oliveira" },
    { id: "TR-004", source: pt ? "Reprodução - Bahia" : "Breeding - Bahia", destination: pt ? "Incubatório - MG" : "Hatchery - MG", itemType: pt ? "Ovos" : "Eggs", quantity: "500kg", priority: pt ? "Urgente" : "Urgent", status: pt ? "Entregue" : "Delivered", createdAt: "2026-04-06", requestedBy: "Rafael Costa" },
    { id: "TR-005", source: pt ? "Processamento" : "Processing", destination: pt ? "Armazém Central" : "Central Warehouse", itemType: pt ? "Embalados" : "Packaged Goods", quantity: "600 kg", priority: pt ? "Normal" : "Normal", status: pt ? "Em Trânsito" : "In Transit", createdAt: "2026-04-08", requestedBy: "Admin" },
    { id: "TR-006", source: pt ? "Fazenda Santos - MG" : "Santos Farm - MG", destination: pt ? "Processamento Central" : "Central Processing", itemType: pt ? "Peixes" : "Fish", quantity: "950 kg", priority: pt ? "Normal" : "Normal", status: pt ? "Pendente" : "Pending", createdAt: "2026-04-08", requestedBy: "João Santos" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ source: "", destination: "", itemType: "", quantity: "", priority: "Normal" });

  const handleCreate = () => {
    if (!form.source || !form.destination || !form.quantity) return;
    const newReq: TransportRequest = {
      id: `TR-${String(requests.length + 1).padStart(3, "0")}`,
      ...form,
      status: pt ? "Pendente" : "Pending",
      createdAt: new Date().toISOString().split("T")[0],
      requestedBy: "Logistics",
    };
    setRequests([newReq, ...requests]);
    setForm({ source: "", destination: "", itemType: "", quantity: "", priority: "Normal" });
    setDialogOpen(false);
    toast({ title: pt ? "Solicitação Criada" : "Request Created", description: `${newReq.id}` });
  };

  const filtered = filter === "all" ? requests : requests.filter(r => {
    if (filter === "pending") return r.status.includes("Pendente") || r.status.includes("Pending");
    if (filter === "transit") return r.status.includes("Trânsito") || r.status.includes("Transit");
    if (filter === "delivered") return r.status.includes("Entregue") || r.status.includes("Delivered");
    return true;
  });

  const statusColor = (s: string) => {
    if (s.includes("Entregue") || s.includes("Delivered")) return "bg-green-100 text-green-700";
    if (s.includes("Trânsito") || s.includes("Transit")) return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const priorityColor = (p: string) => p.includes("Urgente") || p.includes("Urgent") ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Solicitações de Transporte" : "Transport Requests"}</h1>
          <p className="text-muted-foreground text-sm">{pt ? "Gerencie todas as solicitações de movimentação" : "Manage all transport requests"}</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]"><Filter className="w-4 h-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{pt ? "Todos" : "All"}</SelectItem>
              <SelectItem value="pending">{pt ? "Pendentes" : "Pending"}</SelectItem>
              <SelectItem value="transit">{pt ? "Em Trânsito" : "In Transit"}</SelectItem>
              <SelectItem value="delivered">{pt ? "Entregues" : "Delivered"}</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1" />{pt ? "Nova Solicitação" : "New Request"}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{pt ? "Nova Solicitação de Transporte" : "New Transport Request"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder={pt ? "Origem (ex: Fazenda Silva - SP)" : "Source (e.g. Silva Farm - SP)"} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
                <Input placeholder={pt ? "Destino (ex: Processamento Central)" : "Destination (e.g. Central Processing)"} value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
                <Select value={form.itemType} onValueChange={v => setForm({ ...form, itemType: v })}>
                  <SelectTrigger><SelectValue placeholder={pt ? "Tipo de Item" : "Item Type"} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={pt ? "Peixes" : "Fish"}>{pt ? "Peixes" : "Fish"}</SelectItem>
                    <SelectItem value={pt ? "Ovos" : "Eggs"}>{pt ? "Ovos" : "Eggs"}</SelectItem>
                    <SelectItem value={pt ? "Alevinos" : "Fry"}>{pt ? "Alevinos" : "Fry"}</SelectItem>
                    <SelectItem value={pt ? "Embalados" : "Packaged Goods"}>{pt ? "Embalados" : "Packaged Goods"}</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder={pt ? "Quantidade (ex: 1.200 kg)" : "Quantity (e.g. 1,200 kg)"} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value={pt ? "Urgente" : "Urgent"}>{pt ? "Urgente" : "Urgent"}</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreate} className="w-full">{pt ? "Criar Solicitação" : "Create Request"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">{pt ? "Origem" : "Source"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Destino" : "Destination"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Item" : "Item"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Qtd" : "Qty"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Prioridade" : "Priority"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Solicitante" : "Requested By"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Data" : "Date"}</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{r.id}</td>
                  <td className="p-3">{r.source}</td>
                  <td className="p-3">{r.destination}</td>
                  <td className="p-3">{r.itemType}</td>
                  <td className="p-3">{r.quantity}</td>
                  <td className="p-3"><Badge className={priorityColor(r.priority)} variant="secondary">{r.priority}</Badge></td>
                  <td className="p-3">{r.requestedBy}</td>
                  <td className="p-3 text-muted-foreground">{r.createdAt}</td>
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

export default TransportRequests;
