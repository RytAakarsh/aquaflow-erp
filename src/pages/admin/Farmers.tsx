import { useState } from "react";
import { useAuth, Farmer } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Mail, Phone, MapPin, Trash2, Copy } from "lucide-react";

const Farmers = () => {
  const { farmers, addFarmer, removeFarmer } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", pondCount: 1, password: "farmer123", status: "active" as const });
  const [createdFarmer, setCreatedFarmer] = useState<Farmer | null>(null);

  const handleAdd = () => {
    if (!form.name || !form.email) {
      toast({ title: t("error"), description: t("nameEmailRequired"), variant: "destructive" });
      return;
    }
    const f = addFarmer(form);
    setCreatedFarmer(f);
    toast({ title: t("farmerAdded"), description: `${t("credentialsReady")} ${f.name}` });
  };

  const copyCredentials = (f: Farmer) => {
    navigator.clipboard.writeText(`AquaFlow ERP Login\nEmail: ${f.email}\nPassword: ${f.password}\nURL: ${window.location.origin}`);
    toast({ title: t("copied"), description: t("credentialsCopied") });
  };

  const resetDialog = () => {
    setForm({ name: "", email: "", phone: "", location: "", pondCount: 1, password: "farmer123", status: "active" });
    setCreatedFarmer(null);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{t("farmerManagement")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{farmers.length} {t("farmersRegistered")}</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" /> {t("addFarmer")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{createdFarmer ? t("farmerCreated") : t("addNewFarmer")}</DialogTitle>
            </DialogHeader>
            {createdFarmer ? (
              <div className="space-y-4">
                <div className="p-4 bg-success/10 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-foreground">{t("shareCredentials")} {createdFarmer.name}:</p>
                  <p className="text-sm text-muted-foreground">{t("email")}: <strong>{createdFarmer.email}</strong></p>
                  <p className="text-sm text-muted-foreground">{t("password")}: <strong>{createdFarmer.password}</strong></p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => copyCredentials(createdFarmer)} className="flex-1 gap-2" variant="outline">
                    <Copy className="w-4 h-4" /> {t("copyCredentials")}
                  </Button>
                  <Button onClick={resetDialog} className="flex-1">{t("done")}</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("fullName")}</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("farmerName")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("email")}</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="produtor@email.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t("phone")}</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+55..." />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("ponds")}</Label>
                    <Input type="number" value={form.pondCount} onChange={(e) => setForm({ ...form, pondCount: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("location")}</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={t("stateRegion")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("initialPassword")}</Label>
                  <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">{t("createFarmerAccount")}</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {farmers.map((f) => (
          <Card key={f.id} className="shadow-card border-border/50 hover:shadow-elevated transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {f.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{f.name}</p>
                    <Badge variant={f.status === "active" ? "default" : "secondary"} className="text-xs mt-0.5">
                      {f.status === "active" ? t("active") : t("inactive")}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyCredentials(f)}>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFarmer(f.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {f.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {f.phone}</div>
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {f.location}</div>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                <span>{f.pondCount} {t("ponds")}</span>
                <span>{t("joined")} {f.joinDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Farmers;
