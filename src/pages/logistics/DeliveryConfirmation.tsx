import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DeliveryConfirmation = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [deliveries, setDeliveries] = useState([
    { id: "TR-001", from: pt ? "Fazenda Silva - SP" : "Silva Farm - SP", to: pt ? "Processamento Central" : "Central Processing", item: pt ? "Peixes" : "Fish", sentQty: "1.200 kg", receivedQty: "1.195 kg", loss: "5 kg (0.4%)", status: "confirmed", notes: pt ? "Entrega em boas condições" : "Good condition delivery", confirmedAt: "2026-04-07 14:30" },
    { id: "TR-004", from: pt ? "Reprodução - BA" : "Breeding - BA", to: pt ? "Incubatório - MG" : "Hatchery - MG", item: pt ? "Ovos" : "Eggs", sentQty: "50.000 un", receivedQty: "49.800 un", loss: "200 un (0.4%)", status: "confirmed", notes: pt ? "Alguns ovos danificados no transporte" : "Some eggs damaged in transit", confirmedAt: "2026-04-06 16:45" },
    { id: "TR-002", from: pt ? "Incubatório - MG" : "Hatchery - MG", to: pt ? "Fazenda Santos" : "Santos Farm", item: pt ? "Alevinos" : "Fry", sentQty: "5.000 un", receivedQty: "", loss: "", status: "pending", notes: "", confirmedAt: "" },
    { id: "TR-005", from: pt ? "Processamento" : "Processing", to: pt ? "Armazém Central" : "Central Warehouse", item: pt ? "Embalados" : "Packaged", sentQty: "600 kg", receivedQty: "", loss: "", status: "pending", notes: "", confirmedAt: "" },
  ]);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [receivedQty, setReceivedQty] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = (id: string) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id !== id) return d;
      return { ...d, receivedQty: receivedQty || d.sentQty, status: "confirmed", notes, confirmedAt: new Date().toLocaleString(), loss: receivedQty ? `${pt ? "Verificado" : "Verified"}` : "0%" };
    }));
    setConfirmingId(null);
    setReceivedQty("");
    setNotes("");
    toast({ title: pt ? "Entrega Confirmada" : "Delivery Confirmed", description: id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Confirmação de Entregas" : "Delivery Confirmation"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Verifique e confirme entregas recebidas" : "Verify and confirm received deliveries"}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-500" /><div><p className="text-xl font-bold">{deliveries.filter(d => d.status === "confirmed").length}</p><p className="text-xs text-muted-foreground">{pt ? "Confirmadas" : "Confirmed"}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-yellow-500" /><div><p className="text-xl font-bold">{deliveries.filter(d => d.status === "pending").length}</p><p className="text-xs text-muted-foreground">{pt ? "Aguardando" : "Awaiting"}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><XCircle className="w-6 h-6 text-red-500" /><div><p className="text-xl font-bold">0.4%</p><p className="text-xs text-muted-foreground">{pt ? "Perda Média" : "Avg Loss"}</p></div></CardContent></Card>
      </div>

      <div className="space-y-3">
        {deliveries.map(d => (
          <Card key={d.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold">{d.id}</span>
                    <Badge variant="secondary" className={d.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {d.status === "confirmed" ? (pt ? "Confirmada" : "Confirmed") : (pt ? "Pendente" : "Pending")}
                    </Badge>
                  </div>
                  <p className="text-sm">{d.from} → {d.to}</p>
                  <p className="text-sm text-muted-foreground">{d.item} · {pt ? "Enviado" : "Sent"}: {d.sentQty}</p>
                  {d.status === "confirmed" && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{pt ? "Recebido" : "Received"}: {d.receivedQty} | {pt ? "Perda" : "Loss"}: {d.loss}</p>
                      <p>{pt ? "Notas" : "Notes"}: {d.notes}</p>
                      <p>{pt ? "Confirmado em" : "Confirmed at"}: {d.confirmedAt}</p>
                    </div>
                  )}
                </div>
                {d.status === "pending" && (
                  <div className="w-full sm:w-auto">
                    {confirmingId === d.id ? (
                      <div className="space-y-2 w-full sm:w-64">
                        <Input placeholder={pt ? "Qtd Recebida" : "Received Qty"} value={receivedQty} onChange={e => setReceivedQty(e.target.value)} />
                        <Textarea placeholder={pt ? "Observações (danos, perdas...)" : "Notes (damage, losses...)"} value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleConfirm(d.id)} className="flex-1">{pt ? "Confirmar" : "Confirm"}</Button>
                          <Button size="sm" variant="outline" onClick={() => setConfirmingId(null)}>{pt ? "Cancelar" : "Cancel"}</Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setConfirmingId(d.id)}><CheckCircle className="w-4 h-4 mr-1" />{pt ? "Confirmar Entrega" : "Confirm Delivery"}</Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeliveryConfirmation;
