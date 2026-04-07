import { useState } from "react";
import { useBreeding } from "@/contexts/BreedingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Fish, Heart, Shield, Save, RotateCcw, List } from "lucide-react";

const BroodstockEntry = () => {
  const { broodstock, addBroodstock } = useBreeding();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"form" | "list">("list");
  const [form, setForm] = useState({
    species: "Tilápia", breedType: "Nilo", gender: "Female" as "Male" | "Female",
    age: 0, weight: 0, source: "Own" as "Own" | "Supplier", tankPond: "", healthStatus: "Healthy" as "Healthy" | "Sick" | "Quarantine" | "Resting",
  });

  const pt = language === "pt";
  const myStock = broodstock.filter(b => b.farmerId === user?.id);

  const resetForm = () => setForm({ species: "Tilápia", breedType: "Nilo", gender: "Female", age: 0, weight: 0, source: "Own", tankPond: "", healthStatus: "Healthy" });

  const handleSave = () => {
    if (!form.tankPond || form.age <= 0 || form.weight <= 0) {
      toast({ title: pt ? "Erro" : "Error", description: pt ? "Preencha todos os campos obrigatórios" : "Fill all required fields", variant: "destructive" });
      return;
    }
    addBroodstock({ ...form, farmerId: user?.id || "" });
    toast({ title: pt ? "✅ Reprodutor Cadastrado" : "✅ Broodstock Saved", description: pt ? "Registro adicionado com sucesso" : "Record added successfully" });
    resetForm();
    setOpen(false);
  };

  const healthColor = (s: string) => s === "Healthy" ? "default" : s === "Resting" ? "secondary" : "destructive";
  const healthLabel = (s: string) => {
    if (pt) return s === "Healthy" ? "Saudável" : s === "Resting" ? "Descanso" : s === "Quarantine" ? "Quarentena" : "Doente";
    return s;
  };

  return (
    <div className="space-y-6 sm:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Fish className="w-5 h-5 text-primary" /> {pt ? "Registro de Reprodutores" : "Broodstock Entry"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{pt ? "Gerencie seus peixes reprodutores" : "Manage your breeding fish"}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" /> {pt ? "Novo Reprodutor" : "Add Stock"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{pt ? "Cadastrar Reprodutor" : "Add Broodstock"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{pt ? "Espécie" : "Species"}</Label>
                  <Select value={form.species} onValueChange={v => setForm({...form, species: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tilápia">Tilápia</SelectItem>
                      <SelectItem value="Tambaqui">Tambaqui</SelectItem>
                      <SelectItem value="Pintado">Pintado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Linhagem" : "Breed Type"}</Label>
                  <Select value={form.breedType} onValueChange={v => setForm({...form, breedType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nilo">Nilo</SelectItem>
                      <SelectItem value="GIFT">GIFT</SelectItem>
                      <SelectItem value="Chitralada">Chitralada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{pt ? "Sexo" : "Gender"}</Label>
                  <Select value={form.gender} onValueChange={v => setForm({...form, gender: v as "Male"|"Female"})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">{pt ? "Macho" : "Male"}</SelectItem>
                      <SelectItem value="Female">{pt ? "Fêmea" : "Female"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Idade (meses)" : "Age (months)"}</Label>
                  <Input type="number" value={form.age || ""} onChange={e => setForm({...form, age: Number(e.target.value)})} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{pt ? "Peso (kg)" : "Weight (kg)"}</Label>
                  <Input type="number" step="0.1" value={form.weight || ""} onChange={e => setForm({...form, weight: Number(e.target.value)})} placeholder="0.0" />
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Origem" : "Source"}</Label>
                  <Select value={form.source} onValueChange={v => setForm({...form, source: v as "Own"|"Supplier"})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Own">{pt ? "Próprio" : "Own"}</SelectItem>
                      <SelectItem value="Supplier">{pt ? "Fornecedor" : "Supplier"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{pt ? "Tanque/Viveiro" : "Tank/Pond"}</Label>
                  <Input value={form.tankPond} onChange={e => setForm({...form, tankPond: e.target.value})} placeholder="Tanque-R1" />
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Saúde" : "Health Status"}</Label>
                  <Select value={form.healthStatus} onValueChange={v => setForm({...form, healthStatus: v as any})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthy">{pt ? "Saudável" : "Healthy"}</SelectItem>
                      <SelectItem value="Sick">{pt ? "Doente" : "Sick"}</SelectItem>
                      <SelectItem value="Quarantine">{pt ? "Quarentena" : "Quarantine"}</SelectItem>
                      <SelectItem value="Resting">{pt ? "Descanso" : "Resting"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} className="flex-1 gradient-primary text-primary-foreground gap-2"><Save className="w-4 h-4" />{pt ? "Salvar" : "Save"}</Button>
                <Button onClick={resetForm} variant="outline" className="gap-2"><RotateCcw className="w-4 h-4" />{pt ? "Limpar" : "Reset"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: pt ? "Total Reprodutores" : "Total Broodstock", value: myStock.length, icon: Fish, color: "text-primary" },
          { label: pt ? "Machos" : "Males", value: myStock.filter(b => b.gender === "Male").length, icon: Shield, color: "text-info" },
          { label: pt ? "Fêmeas" : "Females", value: myStock.filter(b => b.gender === "Female").length, icon: Heart, color: "text-accent" },
          { label: pt ? "Saudáveis" : "Healthy", value: myStock.filter(b => b.healthStatus === "Healthy").length, icon: Shield, color: "text-success" },
        ].map(s => (
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
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <List className="w-4 h-4 text-primary" /> {pt ? "Lista de Reprodutores" : "Broodstock List"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2.5 px-2 font-medium">ID</th>
                <th className="text-left py-2.5 px-2 font-medium">{pt ? "Espécie" : "Species"}</th>
                <th className="text-left py-2.5 px-2 font-medium">{pt ? "Linhagem" : "Breed"}</th>
                <th className="text-left py-2.5 px-2 font-medium">{pt ? "Sexo" : "Gender"}</th>
                <th className="text-right py-2.5 px-2 font-medium">{pt ? "Idade" : "Age"}</th>
                <th className="text-right py-2.5 px-2 font-medium">{pt ? "Peso" : "Weight"}</th>
                <th className="text-left py-2.5 px-2 font-medium">{pt ? "Tanque" : "Tank"}</th>
                <th className="text-left py-2.5 px-2 font-medium">{pt ? "Saúde" : "Health"}</th>
              </tr></thead>
              <tbody>
                {myStock.map(b => (
                  <tr key={b.id} className="border-b border-border/50">
                    <td className="py-2.5 px-2 font-mono text-xs text-primary">{b.id}</td>
                    <td className="py-2.5 px-2 text-foreground">{b.species}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{b.breedType}</td>
                    <td className="py-2.5 px-2">
                      <Badge variant={b.gender === "Male" ? "secondary" : "default"} className="text-xs">
                        {pt ? (b.gender === "Male" ? "Macho" : "Fêmea") : b.gender}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">{b.age} {pt ? "m" : "mo"}</td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">{b.weight} kg</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{b.tankPond}</td>
                    <td className="py-2.5 px-2"><Badge variant={healthColor(b.healthStatus)} className="text-xs">{healthLabel(b.healthStatus)}</Badge></td>
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

export default BroodstockEntry;
