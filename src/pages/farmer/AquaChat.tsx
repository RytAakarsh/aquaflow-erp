import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const AI_RESPONSES_EN: Record<string, string> = {
  temperature: "**Ideal Water Temperature for Tilapia:**\n\n🌡️ The optimal range is **25-30°C** (77-86°F).\n\n- Below 20°C: Fish stop eating and growth halts\n- 25-28°C: Good growth\n- 28-30°C: Optimal growth rate\n- Above 32°C: Stress increases, dissolved oxygen drops\n\n**Tip:** Monitor temperature twice daily.",
  fcr: "**How to Reduce Feed Conversion Ratio (FCR):**\n\n📉 Target FCR for tilapia: **1.4-1.6**\n\n1. **Feed quality**: Use high-protein pellets (32-36% protein)\n2. **Feeding frequency**: 3-4 times/day for juveniles, 2-3 for adults\n3. **Avoid overfeeding**: Fish should finish feed within 15-20 minutes\n4. **Water quality**: Good oxygen (>5 mg/L)\n5. **Remove dead fish**: Prevents pollution",
  disease: "**Common Signs of Fish Disease:**\n\n🐟 Watch for:\n\n1. Swimming erratically, gasping at surface\n2. Red spots/lesions, fin rot, cloudy eyes\n3. Darkening or pale patches\n4. Mortality spike >1-2%/day\n\n**Actions:** Isolate pond, check water, reduce feeding 50%, report to admin.\n\n⚠️ **Never medicate without admin approval.**",
  feeding: "**Best Feeding Schedule for Tilapia:**\n\n🕐 **Juvenile (1-50g):** 4x/day — 8-10% body weight\n🕐 **Growing (50-200g):** 3x/day — 3-5% body weight\n🕐 **Market size (200g+):** 2x/day — 1.5-2.5% body weight\n\n**Tips:** Adjust for temperature, reduce in cloudy weather.",
  default: "I can help with:\n\n🐟 Fish Health\n🌡️ Water Quality\n🍽️ Feeding & FCR\n📊 Best Practices\n💊 Medicine\n📈 Growth optimization",
};

const AI_RESPONSES_PT: Record<string, string> = {
  temperature: "**Temperatura Ideal da Água para Tilápia:**\n\n🌡️ A faixa ideal é **25-30°C**.\n\n- Abaixo de 20°C: Peixes param de comer\n- 25-28°C: Bom crescimento\n- 28-30°C: Taxa ótima de crescimento\n- Acima de 32°C: Estresse aumenta, oxigênio diminui\n\n**Dica:** Monitore a temperatura duas vezes ao dia.",
  fcr: "**Como Reduzir a Taxa de Conversão Alimentar (TCA):**\n\n📉 TCA alvo para tilápia: **1,4-1,6**\n\n1. **Qualidade da ração**: Pellets com alta proteína (32-36%)\n2. **Frequência**: 3-4x/dia para juvenis, 2-3 para adultos\n3. **Evite excesso**: Peixes devem consumir em 15-20 min\n4. **Qualidade da água**: Oxigênio >5 mg/L\n5. **Remova peixes mortos**: Evita poluição",
  disease: "**Sinais Comuns de Doenças em Peixes:**\n\n🐟 Observe:\n\n1. Nado errático, buscando ar na superfície\n2. Manchas vermelhas, apodrecimento de nadadeiras\n3. Escurecimento ou manchas pálidas\n4. Pico de mortalidade >1-2%/dia\n\n**Ações:** Isole o tanque, verifique água, reduza ração 50%, reporte ao admin.\n\n⚠️ **Nunca medique sem aprovação do admin.**",
  feeding: "**Melhor Cronograma de Alimentação para Tilápia:**\n\n🕐 **Juvenil (1-50g):** 4x/dia — 8-10% do peso\n🕐 **Crescimento (50-200g):** 3x/dia — 3-5% do peso\n🕐 **Tamanho mercado (200g+):** 2x/dia — 1,5-2,5% do peso\n\n**Dicas:** Ajuste conforme temperatura, reduza em dias nublados.",
  default: "Posso ajudar com:\n\n🐟 Saúde dos Peixes\n🌡️ Qualidade da Água\n🍽️ Alimentação & TCA\n📊 Melhores Práticas\n💊 Medicamentos\n📈 Otimização de Crescimento",
};

function getResponse(msg: string, lang: string): string {
  const lower = msg.toLowerCase();
  const responses = lang === "pt" ? AI_RESPONSES_PT : AI_RESPONSES_EN;
  if (lower.includes("temp") || lower.includes("água") || lower.includes("water")) return responses.temperature;
  if (lower.includes("fcr") || lower.includes("tca") || lower.includes("conversão") || lower.includes("feed conversion")) return responses.fcr;
  if (lower.includes("doença") || lower.includes("disease") || lower.includes("doente") || lower.includes("sick")) return responses.disease;
  if (lower.includes("alimentação") || lower.includes("ração") || lower.includes("feed") || lower.includes("schedule")) return responses.feeding;
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("olá") || lower.includes("oi")) {
    return lang === "pt"
      ? "Olá! 👋 Sou o **AquaBot**, seu assistente de aquicultura.\n\nPergunte-me sobre qualidade da água, alimentação, doenças ou melhores práticas."
      : "Hello! 👋 I'm **AquaBot**, your aquaculture assistant.\n\nAsk me about water quality, feeding, diseases, or best practices.";
  }
  return responses.default;
}

const AquaChat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("aquaBotWelcome") }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text, language);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className="space-y-4 sm:pt-14 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] flex flex-col">
      <div>
        <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> {t("aquaBotTitle")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t("aquaBotDesc")}</p>
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
              <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm ${
                m.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}>
                {m.content.split('\n').map((line, li) => (
                  <p key={li} className={li > 0 ? "mt-1.5" : ""}>
                    {line.split('**').map((part, pi) =>
                      pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                    )}
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
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
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
            {[t("quickQ1"), t("quickQ2"), t("quickQ3"), t("quickQ4")].map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 border-t border-border flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={t("askPlaceholder")}
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="gradient-primary text-primary-foreground shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AquaChat;
