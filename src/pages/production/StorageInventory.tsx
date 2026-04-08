import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, AlertTriangle } from "lucide-react";

const StorageInventory = () => {
  const { language } = useLanguage();
  const pt = language === "pt";

  const inventory = [
    { product: pt ? "Filé Premium 500g" : "Premium Fillet 500g", qty: "1.040 un", weight: "520 kg", location: pt ? "Câmara Fria A" : "Cold Room A", expiry: "2026-05-07", capacity: 75, alert: false },
    { product: pt ? "Peixe Inteiro 1kg" : "Whole Fish 1kg", qty: "540 un", weight: "540 kg", location: pt ? "Câmara Fria A" : "Cold Room A", expiry: "2026-04-20", capacity: 60, alert: false },
    { product: pt ? "Congelado 2kg" : "Frozen Pack 2kg", qty: "120 un", weight: "240 kg", location: pt ? "Câmara Fria B" : "Cold Room B", expiry: "2026-07-15", capacity: 30, alert: false },
    { product: pt ? "Subprodutos" : "By-products", qty: "80 kg", weight: "80 kg", location: pt ? "Armazém Seco" : "Dry Storage", expiry: "2026-04-12", capacity: 90, alert: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{pt ? "Estoque e Armazenamento" : "Storage & Inventory"}</h1>
        <p className="text-muted-foreground text-sm">{pt ? "Controle de produtos acabados" : "Finished goods control"}</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">1.380 kg</p><p className="text-xs text-muted-foreground">{pt ? "Total em Estoque" : "Total in Stock"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">85%</p><p className="text-xs text-muted-foreground">{pt ? "Capacidade Usada" : "Capacity Used"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">4</p><p className="text-xs text-muted-foreground">{pt ? "Tipos de Produto" : "Product Types"}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-orange-500">1</p><p className="text-xs text-muted-foreground">{pt ? "Alertas de Validade" : "Expiry Alerts"}</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {inventory.map((item, i) => (
          <Card key={i} className={item.alert ? "border-orange-300" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{item.product}</span>
                    {item.alert && <Badge className="bg-orange-100 text-orange-700" variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />{pt ? "Validade Próxima" : "Expiring Soon"}</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>{pt ? "Qtd" : "Qty"}: {item.qty}</span>
                    <span>{pt ? "Peso" : "Weight"}: {item.weight}</span>
                    <span>{pt ? "Local" : "Location"}: {item.location}</span>
                    <span>{pt ? "Validade" : "Expiry"}: {item.expiry}</span>
                  </div>
                </div>
                <div className="w-full sm:w-40">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{pt ? "Capacidade" : "Capacity"}</span>
                    <span>{item.capacity}%</span>
                  </div>
                  <Progress value={item.capacity} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StorageInventory;
