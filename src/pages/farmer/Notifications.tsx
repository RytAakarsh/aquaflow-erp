import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, AlertTriangle, CheckCircle2, DollarSign, Calendar, Thermometer, Fish } from "lucide-react";

const notifications = [
  { icon: AlertTriangle, title: "Water Temperature Alert", msg: "Pond B2 temperature reached 31.2°C — above safe threshold. Reduce feeding and check aerator.", time: "3 hours ago", type: "warning", read: false },
  { icon: Package, title: "Feed Delivery Scheduled", msg: "500kg floating pellets arriving tomorrow at 9 AM. Please ensure storage area is ready.", time: "5 hours ago", type: "info", read: false },
  { icon: DollarSign, title: "Payment Processed", msg: "₹85,000 has been credited to your account for March production.", time: "1 day ago", type: "success", read: false },
  { icon: CheckCircle2, title: "Report Reviewed", msg: "Your weekly report for Week 12 has been reviewed and approved by admin.", time: "1 day ago", type: "success", read: true },
  { icon: Calendar, title: "Harvest Scheduled", msg: "Pond B2 harvest planned for Friday. Estimated yield: 1,200 kg. Stop feeding 24h before.", time: "2 days ago", type: "info", read: true },
  { icon: Fish, title: "New Batch Allocated", msg: "Batch NB-2405: 5,000 fry transferred to your Pond C1 from nursery. Monitor closely.", time: "3 days ago", type: "info", read: true },
  { icon: Thermometer, title: "Weather Advisory", msg: "Heatwave expected next week. Temperatures may exceed 35°C. Prepare shade nets and increase aeration.", time: "4 days ago", type: "warning", read: true },
  { icon: AlertTriangle, title: "Medicine Application Reminder", msg: "Scheduled Oxytetracycline treatment for Pond B2 tomorrow at 8 AM. Follow dosage instructions.", time: "5 days ago", type: "warning", read: true },
  { icon: CheckCircle2, title: "Training Module Available", msg: "New training video on FCR optimization is available. Watch it in the Resources section.", time: "1 week ago", type: "info", read: true },
];

const Notifications = () => {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">Stay updated with your farm alerts</p>
        </div>
        {unread > 0 && <Badge className="gradient-primary text-primary-foreground">{unread} new</Badge>}
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
