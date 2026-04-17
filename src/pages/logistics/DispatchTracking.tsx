import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck, CheckCircle, ArrowRight } from "lucide-react";

const DispatchTracking = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const dispatches = [
    { id: "TR-002", vehicle: "VH-002", driver: "André Costa", from: pt ? "Incubatório - MG" : "Hatchery - MG", to: pt ? "Fazenda Santos" : "Santos Farm", item: pt ? "Alevinos - 500 kg" : "Fry - 500kg", status: "in_transit", departed: "08:30", eta: "14:00", progress: 65 },
    { id: "TR-005", vehicle: "VH-004", driver: "Paulo Mendes", from: pt ? "Processamento" : "Processing", to: pt ? "Armazém Central" : "Central Warehouse", item: pt ? "Embalados - 600 kg" : "Fish - 600kg", status: "in_transit", departed: "10:15", eta: "12:30", progress: 80 },
    { id: "TR-007", vehicle: "VH-001", driver: "Roberto Lima", from: pt ? "Fazenda Silva - SP" : "Silva Farm - SP", to: pt ? "Processamento Central" : "Central Processing", item: pt ? "Peixes - 1.500 kg" : "Fish - 1,500kg", status: "loading", departed: "—", eta: "16:00", progress: 10 },
    { id: "TR-008", vehicle: "VH-003", driver: "Marcos Silva", from: pt ? "Reprodução - BA" : "Breeding - BA", to: pt ? "Incubatório - MG" : "Hatchery - MG", item: pt ? "Ovos - 1000 kg" : "Fish - 1,000kg", status: "scheduled", departed: "—", eta: pt ? "Amanhã 07:00" : "Tomorrow 07:00", progress: 0 },
  ];

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    in_transit: { label: pt ? "Em Trânsito" : "In Transit", color: "bg-blue-100 text-blue-700", icon: Truck },
    loading: { label: pt ? "Carregando" : "Loading", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    scheduled: { label: pt ? "Agendado" : "Scheduled", color: "bg-muted text-muted-foreground", icon: Clock },
    delivered: { label: pt ? "Entregue" : "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Rastreamento de Despacho" : "Dispatch Tracking"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Acompanhe todas as entregas em tempo real" : "Track all deliveries in real-time"}</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: pt ? "Em Trânsito" : "In Transit", value: 2, color: "text-blue-500", icon: Truck },
          { label: pt ? "Carregando" : "Loading", value: 1, color: "text-yellow-500", icon: Clock },
          { label: pt ? "Agendados" : "Scheduled", value: 1, color: "text-muted-foreground", icon: Clock },
          { label: pt ? "Entregues Hoje" : "Delivered Today", value: 6, color: "text-green-500", icon: CheckCircle },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-3">
            <s.icon className={`w-6 h-6 ${s.color}`} />
            <div><p className="text-xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <div className="space-y-4">
        {dispatches.map(d => {
          const cfg = statusConfig[d.status];
          return (
            <Card key={d.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-bold text-foreground">{d.id}</span>
                      <Badge className={cfg.color} variant="secondary"><cfg.icon className="w-3 h-3 mr-1" />{cfg.label}</Badge>
                      <span className="text-xs text-muted-foreground">{d.vehicle} · {d.driver}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{d.from}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{d.to}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{d.item}</span>
                      <span>|</span>
                      <span>{pt ? "Saída" : "Departed"}: {d.departed}</span>
                      <span>|</span>
                      <span>ETA: {d.eta}</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{pt ? "Progresso" : "Progress"}</span>
                      <span>{d.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${d.progress}%`,
                          backgroundColor: d.progress > 70 ? "#10b981" : d.progress > 30 ? "#3b82f6" : "#f59e0b"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DispatchTracking;
