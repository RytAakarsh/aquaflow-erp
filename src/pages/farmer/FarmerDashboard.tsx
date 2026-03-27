import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fish, Droplets, Thermometer, Activity, CheckCircle2 } from "lucide-react";

const FarmerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 sm:pt-14">
      <div>
        <h1 className="text-xl font-bold text-foreground font-heading">Hello, {user?.name} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your farm overview for today</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Active Ponds", value: "5", icon: Droplets, color: "text-primary" },
          { label: "Current Stock", value: "3,200", icon: Fish, color: "text-accent" },
          { label: "Water Temp", value: "28°C", icon: Thermometer, color: "text-warning" },
          { label: "FCR", value: "1.6", icon: Activity, color: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { task: "Morning feeding - Pond A1", done: true },
            { task: "Water quality check - All ponds", done: true },
            { task: "Upload daily photos", done: false },
            { task: "Evening feeding - Pond A1", done: false },
            { task: "Record mortality count", done: false },
          ].map((t, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${t.done ? "bg-success/10" : "bg-muted"}`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${t.done ? "text-success" : "text-muted-foreground"}`} />
              <span className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.task}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "New feed delivery scheduled for tomorrow",
            "Submit harvest report by end of week",
            "Water quality parameters updated by admin",
          ].map((n, i) => (
            <div key={i} className="p-3 bg-info/10 rounded-lg text-sm text-foreground">{n}</div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
