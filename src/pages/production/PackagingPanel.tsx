import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#8b5cf6"];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight={600}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const generateBarcode = (id: string) => {
  const bars: JSX.Element[] = [];
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let i = 0; i < 40; i++) {
    const w = ((hash * (i + 1) * 7) % 3) + 1;
    bars.push(<div key={i} className={`bg-foreground ${i % 3 === 0 ? "w-[1px]" : i % 3 === 1 ? "w-[2px]" : "w-[1px]"}`} style={{ height: "28px" }} />);
    if (i < 39) bars.push(<div key={`s${i}`} className="w-[1px]" />);
  }
  return bars;
};

const PackagingPanel = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [packages, setPackages] = useState([
    { id: "PKG-001", batchId: "PB-601", product: pt ? "Filé Premium" : "Premium Fillet", size: "1000kg", packs: 5520, pricePerPack: 208, totalKg: "5520 kg", lotPrice: "R$264,960", status: pt ? "Concluído" : "Completed", date: "2026-04-07", barcode: "7891234560012" },
    { id: "PKG-002", batchId: "PB-602", product: pt ? "Tilápia Inteira" : "Whole Tilapia", size: "1000kg", packs: 5400, pricePerPack: 320, totalKg: "5400 kg", lotPrice: "R$172,800", status: pt ? "Concluído" : "Completed", date: "2026-04-07", barcode: "7891234560029" },
    { id: "PKG-003", batchId: "PB-603", product: pt ? "Filé Congelado" : "Frozen Fillet", size: "2000kg", packs: 3000, pricePerPack: 500, totalKg: "6000 kg", lotPrice: "R$267,000", status: pt ? "Concluído" : "Completed", date: "2026-04-07", barcode: "7891234560036" },
    { id: "PKG-004", batchId: "PB-605", product: pt ? "Filé Premium" : "Premium Fillet", size: "500kg", packs: 0, pricePerPack: 280, totalKg: "—", lotPrice: "—", status: pt ? "Aguardando" : "Waiting", date: "2026-04-08", barcode: "7891234560043" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ batchId: "", product: "", size: "1000g", packs: "" });

  const productData = [
    { name: pt ? "Filé 1kg" : "Fillet 1kg", value: 5520 },
    { name: pt ? "Inteiro 1kg" : "Whole 1kg", value: 5400 },
    { name: pt ? "Congelado 2kg" : "Frozen 2kg", value: 3000 },
  ];

  const handleAdd = () => {
    if (!form.batchId || !form.product || !form.packs) return;
    const packs = parseInt(form.packs);
    const sizeKg = parseFloat(form.size) / 1000;
    const pricePerPack = sizeKg <= 0.5 ? 28 : sizeKg <= 1 ? 48 : 89;
    const newPkg = {
      id: `PKG-${String(packages.length + 1).padStart(3, "0")}`,
      batchId: form.batchId,
      product: form.product,
      size: form.size === "500g" ? "500g" : form.size === "1000g" ? "1kg" : form.size === "2000g" ? "2kg" : "5kg",
      packs,
      pricePerPack,
      totalKg: `${(packs * sizeKg).toFixed(0)} kg`,
      lotPrice: `R$${(packs * pricePerPack).toLocaleString("pt-BR")}`,
      status: pt ? "Concluído" : "Completed",
      date: new Date().toISOString().split("T")[0],
      barcode: `78912345${String(60000 + packages.length + 1).padStart(5, "0")}`,
    };
    setPackages([newPkg, ...packages]);
    setForm({ batchId: "", product: "", size: "1000g", packs: "" });
    setDialogOpen(false);
    toast({ title: pt ? "Embalagem Registrada" : "Packaging Recorded", description: newPkg.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Embalagem" : "Packaging"}</h1>
          <p className="text-muted-foreground text-sm">{pt ? "Gerencie produtos embalados com código de barras" : "Manage packaged products with barcode"}</p>
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
                  <SelectItem value="500g">500g — R$28/{pt ? "pacote" : "pack"}</SelectItem>
                  <SelectItem value="1000g">1 kg — R$48/{pt ? "pacote" : "pack"}</SelectItem>
                  <SelectItem value="2000g">2 kg — R$89/{pt ? "pacote" : "pack"}</SelectItem>
                  <SelectItem value="5000g">5 kg — R$210/{pt ? "pacote" : "pack"}</SelectItem>
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
                <th className="text-left p-3 font-medium">{pt ? "R$/Pacote" : "R$/Pack"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Total Lote" : "Lot Total"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Código" : "Barcode"}</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {packages.map(p => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="p-3 font-mono text-xs">{p.id}</td>
                    <td className="p-3 font-mono text-xs">{p.batchId}</td>
                    <td className="p-3">{p.product}</td>
                    <td className="p-3">{p.size}</td>
                    <td className="p-3 font-medium">{p.packs.toLocaleString("pt-BR")}</td>
                    <td className="p-3">R${p.pricePerPack}</td>
                    <td className="p-3 font-bold text-foreground">{p.lotPrice}</td>
                    <td className="p-3">
                      <div className="flex flex-col items-center">
                        <div className="flex items-end gap-[0.5px]">{generateBarcode(p.barcode)}</div>
                        <span className="font-mono text-[9px] text-muted-foreground mt-0.5">{p.barcode}</span>
                      </div>
                    </td>
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
              <PieChart><Pie data={productData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel}>{productData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PackagingPanel;
