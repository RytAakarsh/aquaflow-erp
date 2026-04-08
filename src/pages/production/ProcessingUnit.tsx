import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Scissors, ArrowRight } from "lucide-react";

const ProcessingUnit = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const stages = [
    { name: pt ? "Limpeza" : "Cleaning", icon: "🧼", batches: 1, throughput: "400 kg/h" },
    { name: pt ? "Corte" : "Cutting", icon: "🔪", batches: 2, throughput: "300 kg/h" },
    { name: pt ? "Classificação" : "Sorting", icon: "📊", batches: 1, throughput: "500 kg/h" },
    { name: pt ? "Filetagem" : "Filleting", icon: "🐟", batches: 1, throughput: "250 kg/h" },
  ];

  const activeBatches = [
    { id: "PB-603", stage: pt ? "Limpeza" : "Cleaning", input: "1.000 kg", output: "—", waste: "—", progress: 35, worker: "Maria Souza", startedAt: "07:45" },
    { id: "PB-601", stage: pt ? "Filetagem" : "Filleting", input: "800 kg", output: "520 kg", waste: "120 kg", progress: 85, worker: "Ana Rodrigues", startedAt: "08:30" },
    { id: "PB-602", stage: pt ? "Classificação" : "Sorting", input: "600 kg", output: "540 kg", waste: "30 kg", progress: 100, worker: "José Ferreira", startedAt: "10:15" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Unidade de Processamento" : "Processing Unit"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Acompanhe cada etapa do processamento" : "Track each processing stage"}</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <Card className="min-w-[140px]">
              <CardContent className="p-3 text-center">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.batches} {pt ? "lote(s)" : "batch(es)"}</p>
                <p className="text-xs text-muted-foreground">{s.throughput}</p>
              </CardContent>
            </Card>
            {i < stages.length - 1 && <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Lotes em Processamento" : "Active Processing Batches"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {activeBatches.map(b => (
            <div key={b.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">{b.id}</span>
                  <Badge variant="secondary" className={b.progress === 100 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                    {b.stage}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{pt ? "Início" : "Started"}: {b.startedAt} · {b.worker}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">{pt ? "Entrada" : "Input"}</p><p className="font-medium">{b.input}</p></div>
                <div><p className="text-xs text-muted-foreground">{pt ? "Saída" : "Output"}</p><p className="font-medium">{b.output}</p></div>
                <div><p className="text-xs text-muted-foreground">{pt ? "Resíduo" : "Waste"}</p><p className="font-medium">{b.waste}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={b.progress} className="flex-1 h-2" />
                <span className="text-sm font-medium">{b.progress}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingUnit;
