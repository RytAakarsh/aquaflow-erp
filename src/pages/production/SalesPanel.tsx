import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalesPanel = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  const [sales, setSales] = useState([
    { id: "SL-001", customer: "Rede Atacadão - Nacional", product: pt ? "Filé Premium 1kg" : "Premium Fillet 1kg", qty: "12.000 un", unitPrice: "R$48,00", total: "R$576.000", date: "2026-04-08", status: pt ? "Pago" : "Paid" },
    { id: "SL-002", customer: "Carrefour Brasil - SP/RJ", product: pt ? "Tilápia Inteira 1kg" : "Whole Tilapia 1kg", qty: "8.500 un", unitPrice: "R$32,00", total: "R$272.000", date: "2026-04-07", status: pt ? "Pago" : "Paid" },
    { id: "SL-003", customer: "Frigorífico JBS Aqua - MG", product: pt ? "Congelado 2kg" : "Frozen Pack 2kg", qty: "5.000 un", unitPrice: "R$89,00", total: "R$445.000", date: "2026-04-07", status: pt ? "Pendente" : "Pending" },
    { id: "SL-004", customer: "Pão de Açúcar - Nacional", product: pt ? "Filé Premium 500g" : "Premium Fillet 500g", qty: "25.000 un", unitPrice: "R$28,00", total: "R$700.000", date: "2026-04-06", status: pt ? "Pago" : "Paid" },
    { id: "SL-005", customer: "BRF S.A. - Exportação", product: pt ? "Filé Congelado 2kg" : "Frozen Fillet 2kg", qty: "15.000 un", unitPrice: "R$89,00", total: "R$1.335.000", date: "2026-04-05", status: pt ? "Pago" : "Paid" },
    { id: "SL-006", customer: "Restaurante Fasano - SP", product: pt ? "Filé Premium 1kg" : "Premium Fillet 1kg", qty: "2.000 un", unitPrice: "R$65,00", total: "R$130.000", date: "2026-04-05", status: pt ? "Pago" : "Paid" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", product: "", qty: "", unitPrice: "" });

  const salesByProduct = [
    { product: pt ? "Filé" : "Fillet", revenue: 1406000 },
    { product: pt ? "Inteiro" : "Whole", revenue: 272000 },
    { product: pt ? "Congelado" : "Frozen", revenue: 1780000 },
  ];

  const handleAdd = () => {
    if (!form.customer || !form.product || !form.qty || !form.unitPrice) return;
    const qty = parseInt(form.qty);
    const price = parseFloat(form.unitPrice);
    const total = qty * price;
    const newSale = {
      id: `SL-${String(sales.length + 1).padStart(3, "0")}`,
      customer: form.customer,
      product: form.product,
      qty: `${qty.toLocaleString("pt-BR")} un`,
      unitPrice: `R$${price.toFixed(2).replace(".", ",")}`,
      total: `R$${total.toLocaleString("pt-BR")}`,
      date: new Date().toISOString().split("T")[0],
      status: pt ? "Pendente" : "Pending",
    };
    setSales([newSale, ...sales]);
    setForm({ customer: "", product: "", qty: "", unitPrice: "" });
    setDialogOpen(false);
    toast({ title: pt ? "Venda Registrada" : "Sale Recorded", description: newSale.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Vendas" : "Sales"}</h1>
          <p className="text-muted-foreground text-sm">{pt ? "Registre e acompanhe as vendas" : "Record and track sales"}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />{pt ? "Nova Venda" : "New Sale"}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{pt ? "Registrar Venda" : "Record Sale"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder={pt ? "Cliente" : "Customer"} value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} />
              <Input placeholder={pt ? "Produto" : "Product"} value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
              <Input type="number" placeholder={pt ? "Quantidade" : "Quantity"} value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
              <Input type="number" placeholder={pt ? "Preço unitário (R$)" : "Unit price (R$)"} value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} />
              <Button onClick={handleAdd} className="w-full">{pt ? "Registrar Venda" : "Record Sale"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="w-6 h-6 text-green-500" /><div><p className="text-xl font-bold">R$3,46M</p><p className="text-xs text-muted-foreground">{pt ? "Total de Vendas" : "Total Sales"}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold">{sales.length}</p><p className="text-xs text-muted-foreground">{pt ? "Pedidos" : "Orders"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold">6</p><p className="text-xs text-muted-foreground">{pt ? "Clientes Corporativos" : "Corporate Clients"}</p></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">{pt ? "Cliente" : "Customer"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Produto" : "Product"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Qtd" : "Qty"}</th>
                <th className="text-left p-3 font-medium">{pt ? "R$/Un (1kg)" : "R$/Unit (1kg)"}</th>
                <th className="text-left p-3 font-medium">{pt ? "Total do Lote" : "Lot Total"}</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="p-3 font-mono text-xs">{s.id}</td>
                    <td className="p-3">{s.customer}</td>
                    <td className="p-3">{s.product}</td>
                    <td className="p-3">{s.qty}</td>
                    <td className="p-3">{s.unitPrice}</td>
                    <td className="p-3 font-bold">{s.total}</td>
                    <td className="p-3"><Badge variant="secondary" className={s.status.includes("Pago") || s.status.includes("Paid") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>{s.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{pt ? "Receita por Produto" : "Revenue by Product"}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesByProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="product" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => `R$${v.toLocaleString("pt-BR")}`} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={pt ? "Receita (R$)" : "Revenue (R$)"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesPanel;
