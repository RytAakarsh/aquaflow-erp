import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const tasks = [
  { task: "Complete morning feeding for all ponds", priority: "high", status: "pending", due: "Today 7:00 AM" },
  { task: "Record water quality parameters", priority: "high", status: "pending", due: "Today 9:00 AM" },
  { task: "Upload feeding video", priority: "medium", status: "pending", due: "Today 12:00 PM" },
  { task: "Medicine application - Pond B2", priority: "high", status: "completed", due: "Yesterday" },
  { task: "Submit weekly harvest report", priority: "low", status: "pending", due: "Friday" },
];

const Tasks = () => (
  <div className="space-y-6 sm:pt-14">
    <div>
      <h1 className="text-xl font-bold text-foreground font-heading">Tasks</h1>
      <p className="text-muted-foreground text-sm mt-1">Your assigned tasks and deadlines</p>
    </div>
    <div className="space-y-3">
      {tasks.map((t, i) => (
        <Card key={i} className="shadow-card border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            {t.status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            ) : t.priority === "high" ? (
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            ) : (
              <Clock className="w-5 h-5 text-warning shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${t.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.task}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.due}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Tasks;
