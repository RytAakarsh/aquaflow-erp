import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, User } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const ADMIN_RESPONSES_EN: Record<string, string> = {
  profit: "**Profit Analysis Summary:**\n\n💰 Current month profit: **R$8.4M** (+26.1%)\n\n📊 Key insights:\n1. Revenue grew 23.2% to R$13.8M\n2. Processing costs at R$2.98M (21.6% of revenue)\n3. Best margin product: Premium Fillet (68% margin)\n4. Recommendation: Increase fillet production by 15%",
  logistics: "**Logistics Optimization Report:**\n\n🚛 Current performance:\n- 1,560 deliveries this month\n- Transport cost: R$2.85M (-5%)\n- Loss rate: 0.2% (excellent)\n\n✅ Suggestions:\n1. Consolidate SP/RJ routes — save ~R$180K/month\n2. Add 2 refrigerated trucks for peak season\n3. Switch to night deliveries for fish — better quality",
  production: "**Production Efficiency Report:**\n\n🏭 This month:\n- Processed: 385,000 kg\n- Yield rate: 75% (above target)\n- Top grade: 82% A or A+\n\n📈 Recommendations:\n1. Increase filleting line capacity by 20%\n2. Invest in automated sorting — reduce waste 8%\n3. Add frozen pack line for export market",
  farmer: "**Farmer Performance Overview:**\n\n👥 186 active farmers\n- Top performer: Pedro Oliveira (97 score)\n- Average score: 88.5\n- 12 farmers need attention (score < 75)\n\n🎯 Actions:\n1. Schedule training for bottom 12 farmers\n2. Bonus program for top 20 — increases retention\n3. Deploy water quality sensors to 45 more ponds",
  forecast: "**Q2 2026 Forecast:**\n\n📈 Projections:\n- Revenue: R$42M (+18% QoQ)\n- Production: 1.2M kg\n- New farmers: +25\n- Export opportunity: R$8M (BRF partnership)\n\n⚠️ Risks:\n1. Summer heat — increase aeration budget 15%\n2. Feed prices rising — lock contracts now\n3. Labor shortage in processing — hire 30 workers",
  default: "I can help with:\n\n💰 Profit & Revenue Analysis\n🚛 Logistics Optimization\n🏭 Production Efficiency\n👥 Farmer Performance\n📈 Forecasting & Planning\n⚠️ Risk Assessment\n\nAsk me anything about your operation!",
};

const ADMIN_RESPONSES_PT: Record<string, string> = {
  profit: "**Resumo da Análise de Lucro:**\n\n💰 Lucro do mês atual: **R$8,4M** (+26,1%)\n\n📊 Insights principais:\n1. Receita cresceu 23,2% para R$13,8M\n2. Custos de processamento em R$2,98M (21,6% da receita)\n3. Melhor margem: Filé Premium (68% de margem)\n4. Recomendação: Aumentar produção de filé em 15%",
  logistics: "**Relatório de Otimização Logística:**\n\n🚛 Performance atual:\n- 1.560 entregas este mês\n- Custo de transporte: R$2,85M (-5%)\n- Taxa de perda: 0,2% (excelente)\n\n✅ Sugestões:\n1. Consolidar rotas SP/RJ — economizar ~R$180K/mês\n2. Adicionar 2 caminhões refrigerados para alta temporada\n3. Mudar para entregas noturnas — melhor qualidade",
  production: "**Relatório de Eficiência de Produção:**\n\n🏭 Este mês:\n- Processado: 385.000 kg\n- Taxa de rendimento: 75% (acima da meta)\n- Classe principal: 82% A ou A+\n\n📈 Recomendações:\n1. Aumentar capacidade da linha de filetagem em 20%\n2. Investir em classificação automatizada — reduzir resíduo 8%\n3. Adicionar linha de congelados para exportação",
  farmer: "**Visão Geral de Desempenho dos Produtores:**\n\n👥 186 produtores ativos\n- Melhor: Pedro Oliveira (pontuação 97)\n- Média: 88,5\n- 12 produtores precisam de atenção (< 75)\n\n🎯 Ações:\n1. Agendar treinamento para os 12 produtores\n2. Programa de bônus para top 20 — aumenta retenção\n3. Instalar sensores de água em mais 45 tanques",
  forecast: "**Previsão Q2 2026:**\n\n📈 Projeções:\n- Receita: R$42M (+18% trimestral)\n- Produção: 1,2M kg\n- Novos produtores: +25\n- Oportunidade de exportação: R$8M (parceria BRF)\n\n⚠️ Riscos:\n1. Calor no verão — aumentar orçamento de aeração 15%\n2. Preços de ração subindo — fechar contratos agora\n3. Falta de mão de obra — contratar 30 funcionários",
  default: "Posso ajudar com:\n\n💰 Análise de Lucro & Receita\n🚛 Otimização Logística\n🏭 Eficiência de Produção\n👥 Desempenho dos Produtores\n📈 Previsões & Planejamento\n⚠️ Avaliação de Riscos\n\nPergunte qualquer coisa sobre sua operação!",
};

function getAdminResponse(msg: string, lang: string): string {
  const lower = msg.toLowerCase();
  const r = lang === "pt" ? ADMIN_RESPONSES_PT : ADMIN_RESPONSES_EN;
  if (lower.includes("lucro") || lower.includes("profit") || lower.includes("receita") || lower.includes("revenue")) return r.profit;
  if (lower.includes("logistic") || lower.includes("logíst") || lower.includes("transport") || lower.includes("entrega")) return r.logistics;
  if (lower.includes("produção") || lower.includes("production") || lower.includes("process") || lower.includes("fábrica")) return r.production;
  if (lower.includes("produtor") || lower.includes("farmer") || lower.includes("fazend")) return r.farmer;
  if (lower.includes("previsão") || lower.includes("forecast") || lower.includes("futuro") || lower.includes("plan")) return r.forecast;
  if (lower.includes("olá") || lower.includes("oi") || lower.includes("hello") || lower.includes("hi")) {
    return lang === "pt"
      ? "Olá! 👋 Sou o **AquaFlow AI**, seu assistente executivo.\n\nPosso analisar lucros, otimizar logística, avaliar produção e prever tendências.\n\nComo posso ajudar?"
      : "Hello! 👋 I'm **AquaFlow AI**, your executive assistant.\n\nI can analyze profits, optimize logistics, evaluate production, and forecast trends.\n\nHow can I help?";
  }
  return r.default;
}

const AdminAI = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const getWelcome = () => pt
    ? "Olá! 👋 Sou o **AquaFlow AI**, seu assistente executivo de gestão.\n\nPosso ajudar com análise de lucro, otimização logística, eficiência de produção e muito mais.\n\nExperimente as perguntas rápidas abaixo!"
    : "Hello! 👋 I'm **AquaFlow AI**, your executive management assistant.\n\nI can help with profit analysis, logistics optimization, production efficiency, and more.\n\nTry the quick questions below!";

  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: getWelcome() }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMessages([{ role: "assistant", content: getWelcome() }]); }, [language]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: text.trim() }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: getAdminResponse(text, language) }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const quickQs = pt
    ? ["Análise de lucro do mês", "Otimizar logística", "Eficiência de produção", "Previsão Q2 2026"]
    : ["Monthly profit analysis", "Optimize logistics", "Production efficiency", "Q2 2026 forecast"];

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> {pt ? "AquaFlow AI — Assistente Executivo" : "AquaFlow AI — Executive Assistant"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{pt ? "Análises inteligentes, otimização e previsões para sua operação" : "Smart analytics, optimization, and forecasting for your operation"}</p>
      </div>

      <Card className="shadow-card border-border/50 flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm ${m.role === "user" ? "gradient-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                {m.content.split('\n').map((line, li) => (
                  <p key={li} className={li > 0 ? "mt-1.5" : ""}>
                    {line.split('**').map((part, pi) => pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part)}
                  </p>
                ))}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary-foreground" /></div>
              <div className="bg-muted rounded-2xl rounded-bl-md p-3.5">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </CardContent>

        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickQs.map(q => (
              <button key={q} onClick={() => sendMessage(q)} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">{q}</button>
            ))}
          </div>
        )}

        <div className="p-3 border-t border-border flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)} placeholder={pt ? "Pergunte sobre lucro, logística, produção..." : "Ask about profit, logistics, production..."} className="flex-1" disabled={isTyping} />
          <Button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping} size="icon" className="gradient-primary text-primary-foreground shrink-0"><Send className="w-4 h-4" /></Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminAI;
