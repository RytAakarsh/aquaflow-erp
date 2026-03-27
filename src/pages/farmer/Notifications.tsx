import { Card, CardContent } from "@/components/ui/card";
import { Bell, Package, AlertTriangle, CheckCircle2 } from "lucide-react";

const notifications = [
  { icon: Package, msg: "New feed delivery arriving tomorrow - 500kg", time: "2 hours ago", type: "info" },
  { icon: AlertTriangle, msg: "Water temperature above threshold in Pond A3", time: "5 hours ago", type: "warning" },
  { icon: CheckCircle2, msg: "Your weekly report has been reviewed by admin", time: "1 day ago", type: "success" },
  { icon: Bell, msg: "Harvest scheduled for Pond B2 on Friday", time: "2 days ago", type: "info" },
];

const Notifications = () => (
  <div className="space-y-6 sm:pt-14">
    <div>
      <h1 className="text-xl font-bold text-foreground font-heading">Notifications</h1>
      <p className="text-muted-foreground text-sm mt-1">Stay updated with your farm alerts</p>
    </div>
    <div className="space-y-3">
      {notifications.map((n, i) => (
        <Card key={i} className="shadow-card border-border/50">
          <CardContent className="p-4 flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              n.type === "warning" ? "bg-warning/10" : n.type === "success" ? "bg-success/10" : "bg-info/10"
            }`}>
              <n.icon className={`w-4 h-4 ${
                n.type === "warning" ? "text-warning" : n.type === "success" ? "text-success" : "text-info"
              }`} />
            </div>
            <div>
              <p className="text-sm text-foreground">{n.msg}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Notifications;
