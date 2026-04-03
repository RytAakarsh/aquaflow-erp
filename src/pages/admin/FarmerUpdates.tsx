import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Video, User, MapPin, Calendar, Clock, Eye, CheckCircle2, Fish } from "lucide-react";
import { useState } from "react";

const FarmerUpdates = () => {
  const { t, language } = useLanguage();
  const [selectedFarmer, setSelectedFarmer] = useState<string>("all");

  const farmersList = [
    { id: "f1", name: "Carlos Silva", location: "São Paulo", avatar: "CS" },
    { id: "f2", name: "João Santos", location: "Minas Gerais", avatar: "JS" },
    { id: "f3", name: "Pedro Oliveira", location: "Goiás", avatar: "PO" },
    { id: "f4", name: "Rafael Costa", location: "Bahia", avatar: "RC" },
  ];

  const updates = [
    {
      id: 1, farmerId: "f1", farmerName: "Carlos Silva", location: "São Paulo",
      date: "2026-04-03", time: "07:30",
      type: "photo" as const,
      title_en: "Morning pond condition — Pond A1", title_pt: "Condição matinal do tanque — Tanque A1",
      desc_en: "Water clear, fish active. Fed 25kg floating pellets. No mortality observed.",
      desc_pt: "Água limpa, peixes ativos. Alimentou com 25kg de ração flutuante. Nenhuma mortalidade observada.",
      thumbnail: "🐟", status: "reviewed" as const,
    },
    {
      id: 2, farmerId: "f1", farmerName: "Carlos Silva", location: "São Paulo",
      date: "2026-04-03", time: "08:15",
      type: "video" as const,
      title_en: "Feeding video — Pond A1 & A2", title_pt: "Vídeo de alimentação — Tanque A1 e A2",
      desc_en: "Morning feeding session. Fish responding well. Duration: 2min 30s.",
      desc_pt: "Sessão de alimentação matinal. Peixes respondendo bem. Duração: 2min 30s.",
      thumbnail: "🎬", status: "reviewed" as const, duration: "2:30",
    },
    {
      id: 3, farmerId: "f3", farmerName: "Pedro Oliveira", location: "Goiás",
      date: "2026-04-03", time: "06:45",
      type: "photo" as const,
      title_en: "Water quality check — Pond B1", title_pt: "Verificação de qualidade da água — Tanque B1",
      desc_en: "pH 7.1, Temperature 28.5°C, DO 6.8 mg/L. All parameters normal.",
      desc_pt: "pH 7,1, Temperatura 28,5°C, OD 6,8 mg/L. Todos os parâmetros normais.",
      thumbnail: "💧", status: "approved" as const,
    },
    {
      id: 4, farmerId: "f3", farmerName: "Pedro Oliveira", location: "Goiás",
      date: "2026-04-03", time: "09:00",
      type: "video" as const,
      title_en: "Medicine application — Pond B3", title_pt: "Aplicação de medicamento — Tanque B3",
      desc_en: "Applied Oxytetracycline treatment as prescribed. Video evidence for record.",
      desc_pt: "Aplicou tratamento com Oxitetraciclina conforme prescrito. Vídeo como evidência.",
      thumbnail: "💊", status: "pending" as const, duration: "1:45",
    },
    {
      id: 5, farmerId: "f2", farmerName: "João Santos", location: "Minas Gerais",
      date: "2026-04-02", time: "17:30",
      type: "photo" as const,
      title_en: "Evening harvest preparation — Pond C2", title_pt: "Preparação para colheita vespertina — Tanque C2",
      desc_en: "Fish ready for harvest. Estimated weight: 800g avg. Stopped feeding 24h ago.",
      desc_pt: "Peixes prontos para colheita. Peso estimado: 800g médio. Alimentação parada há 24h.",
      thumbnail: "🎣", status: "approved" as const,
    },
    {
      id: 6, farmerId: "f2", farmerName: "João Santos", location: "Minas Gerais",
      date: "2026-04-02", time: "07:00",
      type: "video" as const,
      title_en: "Morning feeding routine", title_pt: "Rotina de alimentação matinal",
      desc_en: "Standard feeding across 3 ponds. 45kg total distributed. Fish behavior normal.",
      desc_pt: "Alimentação padrão em 3 tanques. 45kg total distribuídos. Comportamento dos peixes normal.",
      thumbnail: "🐠", status: "reviewed" as const, duration: "3:15",
    },
    {
      id: 7, farmerId: "f4", farmerName: "Rafael Costa", location: "Bahia",
      date: "2026-04-02", time: "08:30",
      type: "photo" as const,
      title_en: "Mortality report — Pond D1", title_pt: "Relatório de mortalidade — Tanque D1",
      desc_en: "Found 12 dead fish near aerator. Possible oxygen depletion overnight. Reported to admin.",
      desc_pt: "Encontrados 12 peixes mortos perto do aerador. Possível depleção de oxigênio durante a noite. Reportado ao admin.",
      thumbnail: "⚠️", status: "reviewed" as const,
    },
    {
      id: 8, farmerId: "f1", farmerName: "Carlos Silva", location: "São Paulo",
      date: "2026-04-01", time: "16:00",
      type: "photo" as const,
      title_en: "Pond cleaning completed — Pond A3", title_pt: "Limpeza do tanque concluída — Tanque A3",
      desc_en: "Removed algae and debris. Water exchange 30%. Ready for new batch.",
      desc_pt: "Removeu algas e detritos. Troca de água 30%. Pronto para novo lote.",
      thumbnail: "✨", status: "approved" as const,
    },
    {
      id: 9, farmerId: "f3", farmerName: "Pedro Oliveira", location: "Goiás",
      date: "2026-04-01", time: "07:15",
      type: "video" as const,
      title_en: "Aerator check and maintenance", title_pt: "Verificação e manutenção do aerador",
      desc_en: "Routine aerator maintenance. All 8 ponds operating normally. Replaced paddle on B2.",
      desc_pt: "Manutenção rotineira do aerador. Todos os 8 tanques operando normalmente. Substituiu pá no B2.",
      thumbnail: "⚙️", status: "approved" as const, duration: "4:10",
    },
  ];

  const filteredUpdates = selectedFarmer === "all" ? updates : updates.filter(u => u.farmerId === selectedFarmer);

  const stats = [
    { label: language === "pt" ? "Atualizações Hoje" : "Updates Today", value: "6", icon: Camera, color: "text-primary" },
    { label: language === "pt" ? "Fotos Recebidas" : "Photos Received", value: "12", icon: Camera, color: "text-accent" },
    { label: language === "pt" ? "Vídeos Recebidos" : "Videos Received", value: "8", icon: Video, color: "text-info" },
    { label: language === "pt" ? "Pendentes de Revisão" : "Pending Review", value: "3", icon: Eye, color: "text-warning" },
  ];

  const statusLabel = (s: string) => {
    if (s === "approved") return language === "pt" ? "Aprovado" : "Approved";
    if (s === "reviewed") return language === "pt" ? "Revisado" : "Reviewed";
    return language === "pt" ? "Pendente" : "Pending";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">
          {language === "pt" ? "Atualizações dos Produtores" : "Farmer Updates"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {language === "pt" ? "Fotos e vídeos diários recebidos dos produtores" : "Daily photos and videos received from farmers"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Farmer filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedFarmer("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedFarmer === "all" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {language === "pt" ? "Todos os Produtores" : "All Farmers"}
        </button>
        {farmersList.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFarmer(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              selectedFarmer === f.id ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      {/* Updates grid by farmer */}
      {selectedFarmer === "all" ? (
        farmersList.map((farmer) => {
          const farmerUpdates = updates.filter(u => u.farmerId === farmer.id);
          if (farmerUpdates.length === 0) return null;
          return (
            <Card key={farmer.id} className="shadow-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {farmer.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading">{farmer.name}</CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{farmer.location}, Brasil</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {farmerUpdates.length} {language === "pt" ? "atualizações" : "updates"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {farmerUpdates.map((u) => (
                    <div key={u.id} className="border border-border rounded-lg overflow-hidden hover:shadow-card transition-shadow">
                      <div className={`h-32 flex items-center justify-center text-4xl ${
                        u.type === "video" ? "bg-info/10" : "bg-primary/10"
                      }`}>
                        <div className="flex flex-col items-center gap-1">
                          <span>{u.thumbnail}</span>
                          {u.type === "video" && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              <Video className="w-3 h-3" /> {u.duration}
                            </Badge>
                          )}
                          {u.type === "photo" && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              <Camera className="w-3 h-3" /> {language === "pt" ? "Foto" : "Photo"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {language === "pt" ? u.title_pt : u.title_en}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {language === "pt" ? u.desc_pt : u.desc_en}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{u.date} · {u.time}
                          </span>
                          <Badge
                            variant={u.status === "approved" ? "default" : u.status === "reviewed" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {statusLabel(u.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredUpdates.map((u) => (
                <div key={u.id} className="border border-border rounded-lg overflow-hidden hover:shadow-card transition-shadow">
                  <div className={`h-32 flex items-center justify-center text-4xl ${
                    u.type === "video" ? "bg-info/10" : "bg-primary/10"
                  }`}>
                    <div className="flex flex-col items-center gap-1">
                      <span>{u.thumbnail}</span>
                      {u.type === "video" && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Video className="w-3 h-3" /> {u.duration}
                        </Badge>
                      )}
                      {u.type === "photo" && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Camera className="w-3 h-3" /> {language === "pt" ? "Foto" : "Photo"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {language === "pt" ? u.title_pt : u.title_en}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {language === "pt" ? u.desc_pt : u.desc_en}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{u.date} · {u.time}
                      </span>
                      <Badge
                        variant={u.status === "approved" ? "default" : u.status === "reviewed" ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {statusLabel(u.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FarmerUpdates;
