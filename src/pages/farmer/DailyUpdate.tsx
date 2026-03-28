import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Video, CheckCircle2, Clock, Calendar } from "lucide-react";

const pastUpdates = [
  { date: "26 Mar", pond: "A1", feed: "48kg", mortality: "2", temp: "28,5°C", status: "Approved" },
  { date: "25 Mar", pond: "A1", feed: "45kg", mortality: "1", temp: "28,2°C", status: "Approved" },
  { date: "24 Mar", pond: "A2", feed: "52kg", mortality: "3", temp: "29,0°C", status: "Reviewed" },
  { date: "23 Mar", pond: "B1", feed: "40kg", mortality: "0", temp: "27,8°C", status: "Approved" },
];

const DailyUpdate = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    pondId: "", feedAmount: "", mortalityCount: "", waterTemp: "", dissolved_oxygen: "", ph: "", notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t("updateSubmitted"), description: t("updateSubmittedDesc") });
    setForm({ pondId: "", feedAmount: "", mortalityCount: "", waterTemp: "", dissolved_oxygen: "", ph: "", notes: "" });
  };

  return (
    <div className="space-y-6 sm:pt-14">
      <div>
        <h1 className="text-xl font-bold text-foreground font-heading">{t("dailyUpdate")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("submitDailyReport")}</p>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> {t("todaysReport")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("pondId")}</Label>
                <Input value={form.pondId} onChange={(e) => setForm({ ...form, pondId: e.target.value })} placeholder="ex: A1" />
              </div>
              <div className="space-y-2">
                <Label>{t("feedKg")}</Label>
                <Input type="number" value={form.feedAmount} onChange={(e) => setForm({ ...form, feedAmount: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label>{t("mortalityLabel")}</Label>
                <Input type="number" value={form.mortalityCount} onChange={(e) => setForm({ ...form, mortalityCount: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>{t("tempC")}</Label>
                <Input type="number" step="0.1" value={form.waterTemp} onChange={(e) => setForm({ ...form, waterTemp: e.target.value })} placeholder="28" />
              </div>
              <div className="space-y-2">
                <Label>{t("doMgL")}</Label>
                <Input type="number" step="0.1" value={form.dissolved_oxygen} onChange={(e) => setForm({ ...form, dissolved_oxygen: e.target.value })} placeholder="6,5" />
              </div>
              <div className="space-y-2">
                <Label>{t("phLevel")}</Label>
                <Input type="number" step="0.1" value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} placeholder="7,0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("notesObservations")}</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={t("notesPlaceholder")} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Camera className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">{t("uploadPhotos")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("dailyPondCondition")}</p>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Video className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">{t("uploadVideo")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("feedingMedicine")}</p>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2">
              <Upload className="w-4 h-4" /> {t("submitDailyUpdate")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Clock className="w-4 h-4 text-info" /> {t("pastSubmissions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2.5 px-2 font-medium">{t("date")}</th>
                <th className="text-left py-2.5 px-2 font-medium">{t("pond")}</th>
                <th className="text-right py-2.5 px-2 font-medium">{t("feed")}</th>
                <th className="text-right py-2.5 px-2 font-medium">{t("mort")}</th>
                <th className="text-right py-2.5 px-2 font-medium">{t("temp")}</th>
                <th className="text-left py-2.5 px-2 font-medium">{t("status")}</th>
              </tr></thead>
              <tbody>
                {pastUpdates.map((u, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2.5 px-2 text-foreground">{u.date}</td>
                    <td className="py-2.5 px-2 font-medium text-foreground">{u.pond}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">{u.feed}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">{u.mortality}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">{u.temp}</td>
                    <td className="py-2.5 px-2">
                      <Badge variant={u.status === "Approved" ? "default" : "secondary"} className="text-xs">
                        {u.status === "Approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {u.status === "Approved" ? t("approved") : t("reviewed")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyUpdate;
