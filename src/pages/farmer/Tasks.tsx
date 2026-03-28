import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, Calendar, Target } from "lucide-react";

const Tasks = () => {
  const { t } = useLanguage();

  const initialTasks = [
    { id: 1, task: t("morningFeedingAllPonds"), priority: "high", status: "completed", due: `${t("today")} 7:00`, category: t("feeding") },
    { id: 2, task: t("recordWaterQuality"), priority: "high", status: "completed", due: `${t("today")} 9:00`, category: t("monitoring") },
    { id: 3, task: t("uploadDailyPhotos"), priority: "medium", status: "completed", due: `${t("today")} 12:00`, category: t("reporting") },
    { id: 4, task: t("eveningFeedingAdjust"), priority: "high", status: "pending", due: `${t("today")} 17:00`, category: t("feeding") },
    { id: 5, task: t("recordMortalityCount"), priority: "medium", status: "pending", due: `${t("today")} 18:00`, category: t("monitoring") },
    { id: 6, task: t("checkAerator"), priority: "high", status: "pending", due: t("today"), category: t("maintenance") },
    { id: 7, task: t("submitWeeklyReport"), priority: "low", status: "pending", due: "Sexta", category: t("reporting") },
    { id: 8, task: t("medicineApplication"), priority: "high", status: "pending", due: "Amanhã 8:00", category: t("health") },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const completed = tasks.filter(t => t.status === "completed").length;
  const total = tasks.length;

  const toggleTask = (id: number) => {
    setTasks(tasks.map(tk => tk.id === id ? { ...tk, status: tk.status === "completed" ? "pending" : "completed" } : tk));
  };

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading">{t("tasksTitle")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("tasksDesc")}</p>
        </div>
        <Card className="shadow-card border-border/50 w-fit">
          <CardContent className="p-3 flex items-center gap-3">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">{completed}/{total} {t("complete")}</p>
              <Progress value={(completed / total) * 100} className="w-24 h-2 mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> {t("today")}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">{tasks.filter(tk => tk.due.includes(t("today"))).length} {t("tasks").toLowerCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.filter(tk => tk.due.includes(t("today"))).map((tk) => (
            <div
              key={tk.id}
              onClick={() => toggleTask(tk.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                tk.status === "completed" ? "bg-success/10" : tk.priority === "high" ? "bg-destructive/5 hover:bg-destructive/10" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {tk.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              ) : tk.priority === "high" ? (
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-warning shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${tk.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{tk.task}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{tk.due}</p>
                  <Badge variant="secondary" className="text-xs">{tk.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading">{t("upcoming")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.filter(tk => !tk.due.includes(t("today"))).map((tk) => (
            <div
              key={tk.id}
              onClick={() => toggleTask(tk.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                tk.status === "completed" ? "bg-success/10" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {tk.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              ) : tk.priority === "high" ? (
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${tk.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{tk.task}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{tk.due}</p>
                  <Badge variant="secondary" className="text-xs">{tk.category}</Badge>
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
