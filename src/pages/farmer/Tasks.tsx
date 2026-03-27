import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, Calendar, Target } from "lucide-react";

const initialTasks = [
  { id: 1, task: "Complete morning feeding for all ponds", priority: "high", status: "completed", due: "Today 7:00 AM", category: "Feeding" },
  { id: 2, task: "Record water quality parameters", priority: "high", status: "completed", due: "Today 9:00 AM", category: "Monitoring" },
  { id: 3, task: "Upload daily pond photos", priority: "medium", status: "completed", due: "Today 12:00 PM", category: "Reporting" },
  { id: 4, task: "Evening feeding — adjust for Pond B2 temp", priority: "high", status: "pending", due: "Today 5:00 PM", category: "Feeding" },
  { id: 5, task: "Record mortality count for all ponds", priority: "medium", status: "pending", due: "Today 6:00 PM", category: "Monitoring" },
  { id: 6, task: "Check aerator in Pond B2", priority: "high", status: "pending", due: "Today", category: "Maintenance" },
  { id: 7, task: "Submit weekly harvest report", priority: "low", status: "pending", due: "Friday", category: "Reporting" },
  { id: 8, task: "Medicine application — Pond B2", priority: "high", status: "pending", due: "Tomorrow 8:00 AM", category: "Health" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const completed = tasks.filter(t => t.status === "completed").length;
  const total = tasks.length;

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t));
  };

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">Your assigned tasks and deadlines</p>
        </div>
        <Card className="shadow-card border-border/50 w-fit">
          <CardContent className="p-3 flex items-center gap-3">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">{completed}/{total} Complete</p>
              <Progress value={(completed / total) * 100} className="w-24 h-2 mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Today
            </CardTitle>
            <Badge variant="secondary" className="text-xs">{tasks.filter(t => t.due.includes("Today")).length} tasks</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.filter(t => t.due.includes("Today")).map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                t.status === "completed" ? "bg-success/10" : t.priority === "high" ? "bg-destructive/5 hover:bg-destructive/10" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {t.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              ) : t.priority === "high" ? (
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-warning shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${t.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.task}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{t.due}</p>
                  <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.filter(t => !t.due.includes("Today")).map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                t.status === "completed" ? "bg-success/10" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {t.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              ) : t.priority === "high" ? (
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${t.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.task}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{t.due}</p>
                  <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
