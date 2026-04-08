import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Truck, CarFront, Fuel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const VehicleManagement = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [vehicles, setVehicles] = useState([
    { id: "VH-001", name: pt ? "Caminhão Refrigerado 01" : "Refrigerated Truck 01", plate: "ABC-1234", driver: "Roberto Lima", capacity: "5.000 kg", type: pt ? "Refrigerado" : "Refrigerated", status: pt ? "Disponível" : "Available", fuel: 85 },
    { id: "VH-002", name: pt ? "Caminhão Refrigerado 02" : "Refrigerated Truck 02", plate: "DEF-5678", driver: "André Costa", capacity: "3.000 kg", type: pt ? "Refrigerado" : "Refrigerated", status: pt ? "Em Uso" : "In Use", fuel: 62 },
    { id: "VH-003", name: pt ? "Van de Transporte" : "Transport Van", plate: "GHI-9012", driver: "Marcos Silva", capacity: "1.500 kg", type: "Van", status: pt ? "Disponível" : "Available", fuel: 90 },
    { id: "VH-004", name: pt ? "Caminhão Tanque" : "Tank Truck", plate: "JKL-3456", driver: "Paulo Mendes", capacity: "8.000 L", type: pt ? "Tanque" : "Tank", status: pt ? "Em Uso" : "In Use", fuel: 45 },
    { id: "VH-005", name: pt ? "Pickup Utilitária" : "Utility Pickup", plate: "MNO-7890", driver: "Lucas Ferreira", capacity: "800 kg", type: "Pickup", status: pt ? "Manutenção" : "Maintenance", fuel: 30 },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", plate: "", driver: "", capacity: "", type: "" });

  const statusData = [
    { name: pt ? "Disponível" : "Available", value: vehicles.filter(v => v.status.includes("Disponível") || v.status.includes("Available")).length },
    { name: pt ? "Em Uso" : "In Use", value: vehicles.filter(v => v.status.includes("Uso") || v.status.includes("Use")).length },
    { name: pt ? "Manutenção" : "Maintenance", value: vehicles.filter(v => v.status.includes("Manutenção") || v.status.includes("Maintenance")).length },
  ];

  const handleAdd = () => {
    if (!form.name || !form.plate) return;
    const newV = { id: `VH-${String(vehicles.length + 1).padStart(3, "0")}`, ...form, status: pt ? "Disponível" : "Available", fuel: 100 };
    setVehicles([...vehicles, newV]);
    setForm({ name: "", plate: "", driver: "", capacity: "", type: "" });
    setDialogOpen(false);
    toast({ title: pt ? "Veículo Adicionado" : "Vehicle Added", description: newV.id });
  };

  const statusColor = (s: string) => {
    if (s.includes("Disponível") || s.includes("Available")) return "bg-green-100 text-green-700";
    if (s.includes("Uso") || s.includes("Use")) return "bg-blue-100 text-blue-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Gestão de Veículos" : "Vehicle Management"}</h1>
          <p className="text-muted-foreground text-sm">{pt ? "Frota e disponibilidade de motoristas" : "Fleet and driver availability"}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />{pt ? "Adicionar Veículo" : "Add Vehicle"}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{pt ? "Novo Veículo" : "New Vehicle"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder={pt ? "Nome do veículo" : "Vehicle name"} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder={pt ? "Placa" : "License Plate"} value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} />
              <Input placeholder={pt ? "Motorista" : "Driver"} value={form.driver} onChange={e => setForm({ ...form, driver: e.target.value })} />
              <Input placeholder={pt ? "Capacidade" : "Capacity"} value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue placeholder={pt ? "Tipo" : "Type"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={pt ? "Refrigerado" : "Refrigerated"}>{pt ? "Refrigerado" : "Refrigerated"}</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value={pt ? "Tanque" : "Tank"}>{pt ? "Tanque" : "Tank"}</SelectItem>
                  <SelectItem value="Pickup">Pickup</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} className="w-full">{pt ? "Adicionar" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: pt ? "Total de Veículos" : "Total Vehicles", value: vehicles.length, icon: Truck, color: "text-blue-500" },
          { label: pt ? "Disponíveis" : "Available", value: statusData[0].value, icon: CarFront, color: "text-green-500" },
          { label: pt ? "Combustível Médio" : "Avg Fuel", value: `${Math.round(vehicles.reduce((a, v) => a + v.fuel, 0) / vehicles.length)}%`, icon: Fuel, color: "text-orange-500" },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-4">
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">{pt ? "Veículo" : "Vehicle"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Placa" : "Plate"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Motorista" : "Driver"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Capacidade" : "Capacity"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Combustível" : "Fuel"}</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">{v.id}</td>
                    <td className="p-3 font-medium">{v.name}</td>
                    <td className="p-3 font-mono">{v.plate}</td>
                    <td className="p-3">{v.driver}</td>
                    <td className="p-3">{v.capacity}</td>
                    <td className="p-3"><div className="flex items-center gap-2"><div className="w-16 h-2 bg-muted rounded-full"><div className="h-2 rounded-full" style={{ width: `${v.fuel}%`, backgroundColor: v.fuel > 60 ? "#10b981" : v.fuel > 30 ? "#f59e0b" : "#ef4444" }} /></div><span className="text-xs">{v.fuel}%</span></div></td>
                    <td className="p-3"><Badge className={statusColor(v.status)} variant="secondary">{v.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Status da Frota" : "Fleet Status"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleManagement;
