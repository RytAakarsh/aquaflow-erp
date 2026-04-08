import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#8b5cf6"];

const PackagingPanel = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [packages, setPackages] = useState([
    { id: "PKG-001", batchId: "PB-601", product: pt ? "Filé Premium" : "Premium Fillet", size: "500g", packs: 1040, totalKg: "520 kg", status: pt ? "Concluído" : "Completed", date: "2026-04-07" },
    { id: "PKG-002", batchId: "PB-602", product: pt ? "Peixe Inteiro" : "Whole Fish", size: "1 kg", packs: 540, totalKg: "540 kg", status: pt ? "Concluído" : "Completed", date: "2026-04-07" },
    { id: "PKG-003", batchId: "PB-603", product: pt ? "Filé" : "Fillet", size: "500g", packs: 0, totalKg: "—", status: pt ? "Aguardando" : "Waiting", date: "2026-04-08" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ batchId: "", product: "", size: "500g", packs: "" });

  const productData = [
    { name: pt ? "Filé 500g" : "Fillet 500g", value: 1040 },
    { name: pt ? "Inteiro 1kg" : "Whole 1kg", value: 540 },
    { name: pt ? "Congelado 2kg" : "Frozen 2kg", value: 120 },
  ];

  const handleAdd = () => {
    if (!form.batchId || !form.product || !form.packs) return;
    const newPkg = {
      id: `PKG-${String(packages.length + 1).padStart(3, "0")}`,
      batchId: form.batchId,
      product: form.product,
      size: form.size,
      packs: parseInt(form.packs),
      totalKg: `${(parseInt(form.packs) * parseFloat(form.size) / 1000).toFixed(0)} kg`,
      status: pt ? "Concluído" : "Completed",
      date: new Date().toISOString().split("T")[0],
    };
    setPackages([newPkg, ...packages]);
    setForm({ batchId: "", product: "", size: "500g", packs: "" });
    setDialogOpen(false);
    toast({ title: pt ? "Embalagem Registrada" : "Packaging Recorded", description: newPkg.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Embalagem" : "Packaging"}</h1>
          <p className="text-muted-foreground text-sm">{pt ? "Gerencie produtos embalados" : "Manage packaged products"}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />{pt ? "Nova Embalagem" : "New Package"}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{pt ? "Registrar Embalagem" : "Record Packaging"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder={pt ? "ID do Lote" : "Batch ID"} value={form.batchId} onChange={e => setForm({ ...form, batchId: e.target.value })} />
              <Input placeholder={pt ? "Produto" : "Product"} value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
              <Select value={form.size} onValueChange={v => setForm({ ...form, size: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="500g">500g</SelectItem>
                  <SelectItem value="1000g">1 kg</SelectItem>
                  <SelectItem value="2000g">2 kg</SelectItem>
                  <SelectItem value="5000g">5 kg</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder={pt ? "Nº de Pacotes" : "Number of Packs"} value={form.packs} onChange={e => setForm({ ...form, packs: e.target.value })} />
              <Button onClick={handleAdd} className="w-full">{pt ? "Registrar" : "Record"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">{pt ? "Lote" : "Batch"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Produto" : "Product"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Tamanho" : "Size"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Pacotes" : "Packs"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Total" : "Total"}</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {packages.map(p => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="p-3 font-mono text-xs">{p.id}</td>
                    <td className="p-3 font-mono text-xs">{p.batchId}</td>
                    <td className="p-3">{p.product}</td>
                    <td className="p-3">{p.size}</td>
                    <td className="p-3">{p.packs}</td>
                    <td className="p-3">{p.totalKg}</td>
                    <td className="p-3"><Badge variant="secondary" className={p.status.includes("Concluído") || p.status.includes("Completed") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Por Produto" : "By Product"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart><Pie data={productData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{productData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PackagingPanel;
