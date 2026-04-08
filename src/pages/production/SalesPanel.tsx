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
    { id: "SL-001", customer: "Supermercado Peixão - SP", product: pt ? "Filé Premium 500g" : "Premium Fillet 500g", qty: "200 un", unitPrice: "R$32,00", total: "R$6.400", date: "2026-04-08", status: pt ? "Pago" : "Paid" },
    { id: "SL-002", customer: "Restaurante Maré Alta - RJ", product: pt ? "Peixe Inteiro 1kg" : "Whole Fish 1kg", qty: "80 un", unitPrice: "R$28,00", total: "R$2.240", date: "2026-04-07", status: pt ? "Pago" : "Paid" },
    { id: "SL-003", customer: "Frigorífico Central - MG", product: pt ? "Congelado 2kg" : "Frozen Pack 2kg", qty: "50 un", unitPrice: "R$52,00", total: "R$2.600", date: "2026-04-07", status: pt ? "Pendente" : "Pending" },
    { id: "SL-004", customer: "Distribuidora Mar & Terra - BA", product: pt ? "Filé Premium 500g" : "Premium Fillet 500g", qty: "300 un", unitPrice: "R$30,00", total: "R$9.000", date: "2026-04-06", status: pt ? "Pago" : "Paid" },
    { id: "SL-005", customer: "Hortifruti Natureza - GO", product: pt ? "Peixe Inteiro 1kg" : "Whole Fish 1kg", qty: "120 un", unitPrice: "R$26,00", total: "R$3.120", date: "2026-04-05", status: pt ? "Pago" : "Paid" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", product: "", qty: "", unitPrice: "" });

  const salesByProduct = [
    { product: pt ? "Filé" : "Fillet", revenue: 15400 },
    { product: pt ? "Inteiro" : "Whole", revenue: 5360 },
    { product: pt ? "Congelado" : "Frozen", revenue: 2600 },
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
      qty: `${qty} un`,
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
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="w-6 h-6 text-green-500" /><div><p className="text-xl font-bold">R$23.360</p><p className="text-xs text-muted-foreground">{pt ? "Total de Vendas" : "Total Sales"}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold">{sales.length}</p><p className="text-xs text-muted-foreground">{pt ? "Pedidos" : "Orders"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold">5</p><p className="text-xs text-muted-foreground">{pt ? "Clientes" : "Customers"}</p></CardContent></Card>
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
                <th className="text-left p-3 font-medium">{pt ? "Preço Un." : "Unit Price"}</th>
                <th className="text-left p-3 font-medium">Total</th>
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
                    <td className="p-3 font-medium">{s.total}</td>
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
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
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
