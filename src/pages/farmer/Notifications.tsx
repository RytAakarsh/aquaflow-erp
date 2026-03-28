import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, CheckCircle2, DollarSign, Calendar, Thermometer, Fish } from "lucide-react";

const Notifications = () => {
  const { t } = useLanguage();

  const notifications = [
    { icon: AlertTriangle, title: t("waterTempAlert"), msg: t("waterTempAlertMsg"), time: "3h", type: "warning", read: false },
    { icon: Package, title: t("feedDeliveryScheduled"), msg: t("feedDeliveryMsg"), time: "5h", type: "info", read: false },
    { icon: DollarSign, title: t("paymentProcessed"), msg: t("paymentProcessedMsg"), time: "1d", type: "success", read: false },
    { icon: CheckCircle2, title: t("reportReviewed"), msg: t("reportReviewedMsg"), time: "1d", type: "success", read: true },
    { icon: Calendar, title: t("harvestScheduled"), msg: t("harvestScheduledMsg"), time: "2d", type: "info", read: true },
    { icon: Fish, title: t("newBatchAllocated"), msg: t("newBatchAllocatedMsg"), time: "3d", type: "info", read: true },
    { icon: Thermometer, title: t("weatherAdvisory"), msg: t("weatherAdvisoryMsg"), time: "4d", type: "warning", read: true },
    { icon: AlertTriangle, title: t("medicineReminder"), msg: t("medicineReminderMsg"), time: "5d", type: "warning", read: true },
    { icon: CheckCircle2, title: t("trainingAvailable"), msg: t("trainingAvailableMsg"), time: "1sem", type: "info", read: true },
  ];

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading">{t("notificationsTitle")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("notificationsDesc")}</p>
        </div>
        {unread > 0 && <Badge className="gradient-primary text-primary-foreground">{unread} {t("new")}</Badge>}
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <Card key={i} className={`shadow-card border-border/50 transition-all ${!n.read ? "ring-1 ring-primary/20" : ""}`}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                n.type === "warning" ? "bg-warning/10" : n.type === "success" ? "bg-success/10" : "bg-info/10"
              }`}>
                <n.icon className={`w-5 h-5 ${
                  n.type === "warning" ? "text-warning" : n.type === "success" ? "text-success" : "text-info"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.msg}</p>
                <p className="text-xs text-muted-foreground mt-2">{n.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
