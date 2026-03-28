import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Fish, Lock, Mail, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LanguageToggle from "@/components/LanguageToggle";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        toast({ title: t("loginFailed"), description: t("invalidCredentials"), variant: "destructive" });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <Waves
              key={i}
              className="absolute text-primary-foreground"
              style={{
                top: `${20 + i * 18}%`,
                left: `${-5 + i * 10}%`,
                width: "120%",
                height: "auto",
                opacity: 0.15 + i * 0.05,
              }}
              strokeWidth={0.5}
            />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 rounded-2xl gradient-primary mx-auto mb-8 flex items-center justify-center shadow-elevated">
            <Fish className="w-14 h-14 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4 font-heading">
            AquaFlow ERP
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            {t("erpTagline")}
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[t("breedingLabel"), t("growthLabel"), t("processingLabel")].map((label) => (
              <div key={label} className="bg-primary-foreground/10 backdrop-blur rounded-lg p-3 text-primary-foreground/90 text-sm font-medium">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Fish className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground font-heading">AquaFlow ERP</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground font-heading">{t("welcomeBack")}</h2>
            <p className="text-muted-foreground mt-1">{t("signInDesc")}</p>
          </div>

          <Card className="shadow-elevated border-border/50">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">{t("emailAddress")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("enterEmail")}
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">{t("password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("enterPassword")}
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11" disabled={loading}>
                  {loading ? t("signingIn") : t("signIn")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {t("loginHint")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
