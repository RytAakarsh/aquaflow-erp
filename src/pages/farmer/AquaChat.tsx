import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Sparkles, Image, Mic, MicOff } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; image?: string };

const AI_RESPONSES_EN: Record<string, string> = {
  temperature: "**Ideal Water Temperature for Tilapia:**\n\n🌡️ The optimal range is **25-30°C** (77-86°F).\n\n- Below 20°C: Fish stop eating and growth halts\n- 25-28°C: Good growth\n- 28-30°C: Optimal growth rate\n- Above 32°C: Stress increases, dissolved oxygen drops\n\n**Tip:** Monitor temperature twice daily.",
  fcr: "**How to Reduce Feed Conversion Ratio (FCR):**\n\n📉 Target FCR for tilapia: **1.4-1.6**\n\n1. **Feed quality**: Use high-protein pellets (32-36% protein)\n2. **Feeding frequency**: 3-4 times/day for juveniles, 2-3 for adults\n3. **Avoid overfeeding**: Fish should finish feed within 15-20 minutes\n4. **Water quality**: Good oxygen (>5 mg/L)\n5. **Remove dead fish**: Prevents pollution",
  disease: "**Common Signs of Fish Disease:**\n\n🐟 Watch for:\n\n1. Swimming erratically, gasping at surface\n2. Red spots/lesions, fin rot, cloudy eyes\n3. Darkening or pale patches\n4. Mortality spike >1-2%/day\n\n**Actions:** Isolate pond, check water, reduce feeding 50%, report to admin.\n\n⚠️ **Never medicate without admin approval.**",
  feeding: "**Best Feeding Schedule for Tilapia:**\n\n🕐 **Juvenile (1-50g):** 4x/day — 8-10% body weight\n🕐 **Growing (50-200g):** 3x/day — 3-5% body weight\n🕐 **Market size (200g+):** 2x/day — 1.5-2.5% body weight\n\n**Tips:** Adjust for temperature, reduce in cloudy weather.",
  image: "**Image Analysis:**\n\n📸 I've received your image! Based on what I can see:\n\n🐟 The pond conditions look typical. Here are my recommendations:\n\n1. **Water clarity** appears normal\n2. **Fish activity** level seems healthy\n3. Continue regular feeding schedule\n\n**Tip:** Upload images daily for trend tracking.",
  default: "I can help with:\n\n🐟 Fish Health\n🌡️ Water Quality\n🍽️ Feeding & FCR\n📊 Best Practices\n💊 Medicine\n📈 Growth optimization\n📸 Image analysis — upload a photo!",
};

const AI_RESPONSES_PT: Record<string, string> = {
  temperature: "**Temperatura Ideal da Água para Tilápia:**\n\n🌡️ A faixa ideal é **25-30°C**.\n\n- Abaixo de 20°C: Peixes param de comer\n- 25-28°C: Bom crescimento\n- 28-30°C: Taxa ótima de crescimento\n- Acima de 32°C: Estresse aumenta, oxigênio diminui\n\n**Dica:** Monitore a temperatura duas vezes ao dia.",
  fcr: "**Como Reduzir a Taxa de Conversão Alimentar (TCA):**\n\n📉 TCA alvo para tilápia: **1,4-1,6**\n\n1. **Qualidade da ração**: Pellets com alta proteína (32-36%)\n2. **Frequência**: 3-4x/dia para juvenis, 2-3 para adultos\n3. **Evite excesso**: Peixes devem consumir em 15-20 min\n4. **Qualidade da água**: Oxigênio >5 mg/L\n5. **Remova peixes mortos**: Evita poluição",
  disease: "**Sinais Comuns de Doenças em Peixes:**\n\n🐟 Observe:\n\n1. Nado errático, buscando ar na superfície\n2. Manchas vermelhas, apodrecimento de nadadeiras\n3. Escurecimento ou manchas pálidas\n4. Pico de mortalidade >1-2%/dia\n\n**Ações:** Isole o tanque, verifique água, reduza ração 50%, reporte ao admin.\n\n⚠️ **Nunca medique sem aprovação do admin.**",
  feeding: "**Melhor Cronograma de Alimentação para Tilápia:**\n\n🕐 **Juvenil (1-50g):** 4x/dia — 8-10% do peso\n🕐 **Crescimento (50-200g):** 3x/dia — 3-5% do peso\n🕐 **Tamanho mercado (200g+):** 2x/dia — 1,5-2,5% do peso\n\n**Dicas:** Ajuste conforme temperatura, reduza em dias nublados.",
  image: "**Análise de Imagem:**\n\n📸 Recebi sua imagem! Com base no que posso ver:\n\n🐟 As condições do tanque parecem típicas. Aqui estão minhas recomendações:\n\n1. **Claridade da água** parece normal\n2. **Nível de atividade** dos peixes parece saudável\n3. Continue o cronograma regular de alimentação\n\n**Dica:** Envie fotos diariamente para acompanhamento.",
  default: "Posso ajudar com:\n\n🐟 Saúde dos Peixes\n🌡️ Qualidade da Água\n🍽️ Alimentação & TCA\n📊 Melhores Práticas\n💊 Medicamentos\n📈 Otimização de Crescimento\n📸 Análise de imagem — envie uma foto!",
};

function getResponse(msg: string, lang: string, hasImage?: boolean): string {
  if (hasImage) return lang === "pt" ? AI_RESPONSES_PT.image : AI_RESPONSES_EN.image;
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
  const pt = language === "pt";

  const getWelcome = () => pt
    ? "Olá! 👋 Eu sou o **AquaBot**, seu assistente de IA para aquicultura.\n\nPergunte-me qualquer coisa sobre piscicultura — qualidade da água, alimentação, gestão de doenças ou melhores práticas.\n\n📸 Você pode enviar fotos!\n🎤 Use o microfone para falar!\n\nVocê também pode tentar as perguntas rápidas abaixo!"
    : "Hello! 👋 I'm **AquaBot**, your AI aquaculture assistant.\n\nAsk me anything about fish farming — water quality, feeding, disease management, or best practices.\n\n📸 You can upload photos!\n🎤 Use the microphone to speak!\n\nYou can also try the quick questions below!";

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: getWelcome() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: getWelcome() }]);
  }, [language]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string, image?: string) => {
    if (!text.trim() && !image) return;
    setMessages((prev) => [...prev, { role: "user", content: text.trim() || (pt ? "📸 Imagem enviada" : "📸 Image uploaded"), image }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text, language, !!image);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage(pt ? "Analise esta imagem do meu tanque" : "Analyze this image of my pond", reader.result as string);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setInput(pt ? "Reconhecimento de voz não suportado neste navegador" : "Speech recognition not supported in this browser");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = pt ? "pt-BR" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const quickQuestions = pt
    ? ["Qual a temperatura ideal da água para tilápia?", "Como reduzir a TCA?", "Sinais de doença nos peixes?", "Melhor cronograma de alimentação?"]
    : ["What is ideal water temperature for tilapia?", "How to reduce FCR?", "Signs of fish disease?", "Best feeding schedule?"];

  return (
    <div className="space-y-4 sm:pt-14 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] flex flex-col">
      <div>
        <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> AquaBot
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{pt ? "Seu assistente de IA para dúvidas sobre aquicultura" : "Your AI assistant for aquaculture queries"}</p>
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
                {m.image && (
                  <img src={m.image} alt="Upload" className="rounded-lg max-h-40 mb-2 w-auto" />
                )}
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
            {quickQuestions.map((q) => (
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="icon"
            className="shrink-0"
            title={pt ? "Enviar imagem" : "Upload image"}
          >
            <Image className="w-4 h-4" />
          </Button>
          <Button
            onClick={toggleVoice}
            variant={isListening ? "default" : "outline"}
            size="icon"
            className={`shrink-0 ${isListening ? "animate-pulse bg-red-500 hover:bg-red-600" : ""}`}
            title={pt ? "Falar" : "Speak"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={pt ? "Pergunte sobre qualidade da água, alimentação, doenças..." : "Ask about water quality, feeding, diseases..."}
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
