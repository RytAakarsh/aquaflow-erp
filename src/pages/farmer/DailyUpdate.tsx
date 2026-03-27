import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Video } from "lucide-react";

const DailyUpdate = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    pondId: "",
    feedAmount: "",
    mortalityCount: "",
    waterTemp: "",
    dissolved_oxygen: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Update Submitted", description: "Your daily update has been recorded successfully" });
    setForm({ pondId: "", feedAmount: "", mortalityCount: "", waterTemp: "", dissolved_oxygen: "", notes: "" });
  };

  return (
    <div className="space-y-6 sm:pt-14">
      <div>
        <h1 className="text-xl font-bold text-foreground font-heading">Daily Update</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit your daily farm report</p>
      </div>

      <Card className="shadow-card border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Pond ID</Label>
                <Input value={form.pondId} onChange={(e) => setForm({ ...form, pondId: e.target.value })} placeholder="e.g. A1" />
              </div>
              <div className="space-y-2">
                <Label>Feed (kg)</Label>
                <Input type="number" value={form.feedAmount} onChange={(e) => setForm({ ...form, feedAmount: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Mortality</Label>
                <Input type="number" value={form.mortalityCount} onChange={(e) => setForm({ ...form, mortalityCount: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Temp (°C)</Label>
                <Input type="number" step="0.1" value={form.waterTemp} onChange={(e) => setForm({ ...form, waterTemp: e.target.value })} placeholder="28" />
              </div>
              <div className="space-y-2">
                <Label>DO (mg/L)</Label>
                <Input type="number" step="0.1" value={form.dissolved_oxygen} onChange={(e) => setForm({ ...form, dissolved_oxygen: e.target.value })} placeholder="6.5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any observations, issues, or updates..." rows={3} />
            </div>

            {/* Photo / Video uploads */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload Photos</p>
                <p className="text-xs text-muted-foreground mt-1">Daily pond photos</p>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload Video</p>
                <p className="text-xs text-muted-foreground mt-1">Feeding / medicine</p>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2">
              <Upload className="w-4 h-4" /> Submit Daily Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyUpdate;
