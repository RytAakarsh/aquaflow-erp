import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "What is ideal water temperature for tilapia?",
  "How to reduce FCR?",
  "Signs of fish disease?",
  "Best feeding schedule?",
];

const AI_RESPONSES: Record<string, string> = {
  "temperature": "**Ideal Water Temperature for Tilapia:**\n\n🌡️ The optimal range is **25-30°C** (77-86°F).\n\n- Below 20°C: Fish stop eating and growth halts\n- 25-28°C: Good growth\n- 28-30°C: Optimal growth rate\n- Above 32°C: Stress increases, dissolved oxygen drops\n\n**Tip:** Monitor temperature twice daily — early morning and mid-afternoon. Use shade nets during summer to prevent overheating.",
  "fcr": "**How to Reduce Feed Conversion Ratio (FCR):**\n\n📉 Target FCR for tilapia: **1.4-1.6**\n\n1. **Feed quality**: Use high-protein pellets (32-36% protein)\n2. **Feeding frequency**: 3-4 times/day for juveniles, 2-3 for adults\n3. **Avoid overfeeding**: Fish should finish feed within 15-20 minutes\n4. **Water quality**: Good oxygen (>5 mg/L) improves feed utilization\n5. **Remove dead fish**: Prevents pollution and disease spread\n6. **Optimal stocking density**: Don't overstock ponds\n\n**Tip:** Record daily feed amounts and compare with growth — adjust every 2 weeks.",
  "disease": "**Common Signs of Fish Disease:**\n\n🐟 Watch for these warning signs:\n\n1. **Behavioral**: Swimming erratically, gasping at surface, loss of appetite\n2. **Physical**: Red spots/lesions, fin rot, cloudy eyes, swollen belly\n3. **Color changes**: Darkening or pale patches\n4. **Mortality spike**: More than 1-2% in a day is alarming\n\n**Immediate Actions:**\n- Isolate affected pond\n- Check water quality (temp, pH, dissolved oxygen)\n- Reduce feeding by 50%\n- Report to admin immediately\n- Take photos for veterinary diagnosis\n\n⚠️ **Never medicate without admin approval.**",
  "feeding": "**Best Feeding Schedule for Tilapia:**\n\n🕐 **Juvenile (1-50g):** 4 times/day\n- 7:00 AM, 11:00 AM, 3:00 PM, 6:00 PM\n- Feed rate: 8-10% of body weight/day\n\n🕐 **Growing (50-200g):** 3 times/day\n- 7:00 AM, 12:00 PM, 5:00 PM\n- Feed rate: 3-5% of body weight/day\n\n🕐 **Market size (200g+):** 2 times/day\n- 8:00 AM, 4:00 PM\n- Feed rate: 1.5-2.5% of body weight/day\n\n**Tips:**\n- Adjust based on water temperature\n- Reduce feeding in cloudy/rainy weather\n- Fish eat less when DO is low — check before morning feeding",
  "default": "Great question! Here's what I can help you with regarding aquaculture:\n\n🐟 **Fish Health**: Disease identification, treatment protocols\n🌡️ **Water Quality**: Temperature, pH, dissolved oxygen management\n🍽️ **Feeding**: Schedules, FCR optimization, feed types\n📊 **Best Practices**: Stocking density, harvest timing, pond preparation\n💊 **Medicine**: When and how to treat common diseases\n📈 **Growth**: Expected growth rates and how to improve them\n\nTry asking me specific questions like:\n- \"What is ideal water temperature for tilapia?\"\n- \"How to reduce FCR?\"\n- \"Signs of fish disease?\"\n- \"Best feeding schedule?\""
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("temp") || lower.includes("water temp")) return AI_RESPONSES.temperature;
  if (lower.includes("fcr") || lower.includes("feed conversion") || lower.includes("reduce fcr")) return AI_RESPONSES.fcr;
  if (lower.includes("disease") || lower.includes("sick") || lower.includes("illness") || lower.includes("signs")) return AI_RESPONSES.disease;
  if (lower.includes("feed") || lower.includes("schedule") || lower.includes("feeding")) return AI_RESPONSES.feeding;
  if (lower.includes("mortality") || lower.includes("dead") || lower.includes("dying")) return "**Mortality Management:**\n\n📉 Normal mortality rate: <2% per month\n\nIf mortality spikes:\n1. Check water quality immediately\n2. Remove dead fish ASAP\n3. Reduce feeding by 50%\n4. Check for visible disease signs\n5. Report to admin with photos\n\nCommon causes: low DO, high ammonia, disease outbreak, overfeeding, sudden temperature change.";
  if (lower.includes("harvest") || lower.includes("market")) return "**Harvest Guidelines:**\n\n🐟 Tilapia is typically harvested at **500-800g** (market size varies by region).\n\n**Pre-harvest steps:**\n1. Stop feeding 24 hours before harvest\n2. Harvest early morning when water is cool\n3. Notify admin for processing coordination\n4. Have transport ready with aeration\n\n**Tip:** Partial harvest (seining) can help manage stocking density while keeping remaining fish growing.";
  if (lower.includes("oxygen") || lower.includes("do ") || lower.includes("dissolved")) return "**Dissolved Oxygen (DO) Management:**\n\n💧 Ideal DO level: **5-8 mg/L**\n\n- Below 3 mg/L: Fish stress and mortality risk\n- 3-5 mg/L: Reduced growth and feeding\n- 5-8 mg/L: Optimal\n- Above 8 mg/L: Excellent\n\n**How to improve DO:**\n- Aeration (paddlewheel aerators)\n- Reduce stocking density\n- Control algae blooms\n- Avoid overfeeding\n- Emergency: water exchange";
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) return "Hello! 👋 I'm **AquaBot**, your aquaculture assistant.\n\nI can help you with fish farming questions about water quality, feeding, disease management, and best practices.\n\nWhat would you like to know?";
  return AI_RESPONSES.default;
}

const AquaChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! 👋 I'm **AquaBot**, your AI aquaculture assistant.\n\nAsk me anything about fish farming — water quality, feeding, disease management, or best practices.\n\nYou can also try the quick questions below!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className="space-y-4 sm:pt-14 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] flex flex-col">
      <div>
        <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> AquaBot
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your AI assistant for aquaculture queries</p>
      </div>

      {/* Chat Messages */}
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

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
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

        {/* Input */}
        <div className="p-3 border-t border-border flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about water quality, feeding, diseases..."
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
