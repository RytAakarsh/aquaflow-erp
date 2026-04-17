import { useState, useEffect } from "react";
import { useBreeding } from "@/contexts/BreedingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Fish, TrendingUp, Activity, Calendar, ChevronRight, 
  Package, Scale, Weight, Clock, CheckCircle2, AlertCircle, 
  Truck, Warehouse, DollarSign, BarChart3, PieChart, 
  ArrowUpRight, ArrowDownRight, Scissors, FileText
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area, 
  PieChart as RePieChart, Pie, Sector
} from 'recharts';

// Types for Harvest Management
interface GrowOutBatch {
  id: string;
  sourceFryBatchId: string;
  pondId: string;
  stockingDate: string;
  stockingCount: number;
  avgStockingWeight: number;
  currentStatus: "Active" | "Harvested" | "Lost";
  expectedHarvestDate: string;
  farmerId: string;
  notes?: string;
}

interface HarvestBatch {
  id: string;
  sourceGrowOutId: string;
  pondId: string;
  harvestDate: string;
  totalFishCount: number;
  totalWeight: number;
  avgWeight: number;
  survivalRate: number;
  biomass: number;
  status: "Completed" | "Processing" | "Transferred";
  processingStatus: "Pending" | "At Plant" | "Processed" | "Shipped";
  farmerId: string;
  createdAt: string;
  notes?: string;
}

// DEMO DATA - Industrial Scale Production
const DEMO_GROW_OUT_BATCHES: GrowOutBatch[] = [
  {
    id: "GROW-2026-001",
    sourceFryBatchId: "FRY-2026-001",
    pondId: "Production Pond PP-01 (2.5 hectares)",
    stockingDate: "2026-02-15",
    stockingCount: 985000,
    avgStockingWeight: 0.025,
    currentStatus: "Active",
    expectedHarvestDate: "2026-05-15",
    farmerId: "farmer-demo",
    notes: "High density stocking. Using premium feed formula."
  },
  {
    id: "GROW-2026-002",
    sourceFryBatchId: "FRY-2026-002",
    pondId: "Production Pond PP-02 (2.0 hectares)",
    stockingDate: "2026-02-20",
    stockingCount: 728000,
    avgStockingWeight: 0.022,
    currentStatus: "Active",
    expectedHarvestDate: "2026-05-20",
    farmerId: "farmer-demo",
    notes: "Good water quality. Growth rate above average."
  },
  {
    id: "GROW-2026-003",
    sourceFryBatchId: "FRY-2026-003",
    pondId: "Production Pond PP-03 (1.8 hectares)",
    stockingDate: "2026-03-01",
    stockingCount: 500000,
    avgStockingWeight: 0.024,
    currentStatus: "Active",
    expectedHarvestDate: "2026-06-01",
    farmerId: "farmer-demo",
    notes: "New pond liner installed."
  },
  {
    id: "GROW-2026-004",
    sourceFryBatchId: "FRY-2026-001",
    pondId: "Production Pond PP-04 (3.0 hectares)",
    stockingDate: "2026-03-10",
    stockingCount: 1200000,
    avgStockingWeight: 0.026,
    currentStatus: "Active",
    expectedHarvestDate: "2026-06-10",
    farmerId: "farmer-demo",
    notes: "Largest pond. Intensive aeration system."
  },
];

const DEMO_HARVEST_BATCHES: HarvestBatch[] = [
  {
    id: "HAR-2026-001",
    sourceGrowOutId: "GROW-2025-015",
    pondId: "Production Pond PP-05 (2.2 hectares)",
    harvestDate: "2026-03-25",
    totalFishCount: 425000,
    totalWeight: 212500,
    avgWeight: 0.500,
    survivalRate: 87.5,
    biomass: 212500,
    status: "Completed",
    processingStatus: "Processed",
    farmerId: "farmer-demo",
    createdAt: "2026-03-25T10:00:00Z",
    notes: "Excellent quality fish. Market price premium."
  },
  {
    id: "HAR-2026-002",
    sourceGrowOutId: "GROW-2025-016",
    pondId: "Production Pond PP-06 (1.5 hectares)",
    harvestDate: "2026-04-05",
    totalFishCount: 312000,
    totalWeight: 149760,
    avgWeight: 0.480,
    survivalRate: 85.2,
    biomass: 149760,
    status: "Completed",
    processingStatus: "Shipped",
    farmerId: "farmer-demo",
    createdAt: "2026-04-05T14:30:00Z",
    notes: "Shipped to processing plant same day."
  },
  {
    id: "HAR-2026-003",
    sourceGrowOutId: "GROW-2025-017",
    pondId: "Production Pond PP-07 (2.0 hectares)",
    harvestDate: "2026-04-12",
    totalFishCount: 568000,
    totalWeight: 284000,
    avgWeight: 0.500,
    survivalRate: 88.2,
    biomass: 284000,
    status: "Completed",
    processingStatus: "Processed",
    farmerId: "farmer-demo",
    createdAt: "2026-04-12T09:15:00Z",
    notes: "Record survival rate for this pond."
  },
];

// Production metrics data for charts
const monthlyHarvestData = [
  { month: "Jan", weight: 125000, count: 250000, avgWeight: 200.500 },
  { month: "Feb", weight: 158000, count: 316000, avgWeight: 200.500 },
  { month: "Mar", weight: 212500, count: 425000, avgWeight: 200.500 },
  { month: "Apr", weight: 433760, count: 880000, avgWeight: 200.493 },
  { month: "May", weight: 350000, count: 700000, avgWeight: 200.500 },
  { month: "Jun", weight: 280000, count: 560000, avgWeight: 200.500 },
];

const survivalRateTrend = [
  { batch: "HAR-001", rate: 87.5 },
  { batch: "HAR-002", rate: 85.2 },
  { batch: "HAR-003", rate: 88.2 },
  { batch: "HAR-004", rate: 86.5 },
  { batch: "HAR-005", rate: 89.1 },
  { batch: "HAR-006", rate: 90.2 },
];

const pondPerformanceData = [
  { name: "PP-01", survival: 87.5, biomass: 212500, area: 2.5 },
  { name: "PP-02", survival: 85.2, biomass: 149760, area: 1.5 },
  { name: "PP-03", survival: 88.2, biomass: 284000, area: 2.0 },
  { name: "PP-04", survival: 86.5, biomass: 195000, area: 1.8 },
  { name: "PP-05", survival: 89.1, biomass: 310000, area: 2.2 },
  { name: "PP-06", survival: 90.2, biomass: 450000, area: 3.0 },
];

const weightDistributionData = [
  { range: "400-450g", count: 15, percentage: 15 },
  { range: "450-500g", count: 35, percentage: 35 },
  { range: "500-550g", count: 30, percentage: 30 },
  { range: "550-600g", count: 15, percentage: 15 },
  { range: "600g+", count: 5, percentage: 5 },
];

const HarvestManagement = () => {
  const { fryBatches, addHarvestBatch, harvestBatches, addGrowOutBatch, growOutBatches } = useBreeding();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  // State for demo data initialization
  const [initialized, setInitialized] = useState(false);
  const [localGrowOutBatches, setLocalGrowOutBatches] = useState<GrowOutBatch[]>([]);
  const [localHarvestBatches, setLocalHarvestBatches] = useState<HarvestBatch[]>([]);

  // State for dialogs
  const [openHarvestEntry, setOpenHarvestEntry] = useState(false);
  const [openGrowOutEntry, setOpenGrowOutEntry] = useState(false);
  const [openBatchDetails, setOpenBatchDetails] = useState(false);
  const [selectedGrowOut, setSelectedGrowOut] = useState<GrowOutBatch | null>(null);
  const [selectedHarvest, setSelectedHarvest] = useState<HarvestBatch | null>(null);
  
  // Harvest form state
  const [harvestForm, setHarvestForm] = useState({
    sourceGrowOutId: "",
    harvestDate: new Date().toISOString().split("T")[0],
    totalFishCount: 0,
    totalWeight: 0,
    notes: "",
  });

  // Grow-out form state
  const [growOutForm, setGrowOutForm] = useState({
    sourceFryBatchId: "",
    pondId: "",
    stockingDate: new Date().toISOString().split("T")[0],
    stockingCount: 0,
    avgStockingWeight: 0,
    expectedHarvestDays: 90,
    notes: "",
  });

  // Initialize demo data
  useEffect(() => {
    if (!initialized && user?.id === "farmer-demo") {
      if (growOutBatches.length === 0) {
        DEMO_GROW_OUT_BATCHES.forEach(batch => {
          addGrowOutBatch(batch);
        });
        setLocalGrowOutBatches(DEMO_GROW_OUT_BATCHES);
      }
      if (harvestBatches.length === 0) {
        DEMO_HARVEST_BATCHES.forEach(batch => {
          addHarvestBatch(batch);
        });
        setLocalHarvestBatches(DEMO_HARVEST_BATCHES);
      }
      setInitialized(true);
    }
  }, [user, growOutBatches, harvestBatches, addGrowOutBatch, addHarvestBatch, initialized]);

  // Get available grow-out batches (Active and not yet harvested)
  const availableGrowOutBatches = [...localGrowOutBatches, ...DEMO_GROW_OUT_BATCHES].filter(b => 
    b.currentStatus === "Active" &&
    ![...localHarvestBatches, ...DEMO_HARVEST_BATCHES].some(h => h.sourceGrowOutId === b.id)
  );

  // Get available fry batches for grow-out
  const availableFryBatches = fryBatches.filter(b => 
    b.status === "Harvested" || b.status === "Active"
  );

  // My batches for display
  const myGrowOutBatches = [...localGrowOutBatches, ...DEMO_GROW_OUT_BATCHES].filter(b => b.farmerId === user?.id || b.farmerId === "farmer-demo");
  const myHarvestBatches = [...localHarvestBatches, ...DEMO_HARVEST_BATCHES].filter(b => b.farmerId === user?.id || b.farmerId === "farmer-demo");

  // Calculate totals
  const totalHarvestedWeight = myHarvestBatches.reduce((s, b) => s + b.totalWeight, 0);
  const totalHarvestedCount = myHarvestBatches.reduce((s, b) => s + b.totalFishCount, 0);
  const avgSurvivalRate = myHarvestBatches.length > 0 
    ? Math.round(myHarvestBatches.reduce((s, b) => s + b.survivalRate, 0) / myHarvestBatches.length) 
    : 0;
  const avgHarvestWeight = totalHarvestedCount > 0 
    ? (totalHarvestedWeight / totalHarvestedCount).toFixed(3) 
    : 0;

  // Handle Harvest Entry Creation
  const handleCreateHarvest = () => {
    if (!harvestForm.sourceGrowOutId || harvestForm.totalFishCount <= 0 || harvestForm.totalWeight <= 0) {
      toast({ 
        title: pt ? "Erro" : "Error", 
        description: pt ? "Preencha todos os campos obrigatórios" : "Fill all required fields", 
        variant: "destructive" 
      });
      return;
    }

    const sourceGrowOut = myGrowOutBatches.find(g => g.id === harvestForm.sourceGrowOutId);
    if (!sourceGrowOut) return;

    const avgWeight = harvestForm.totalWeight / harvestForm.totalFishCount;
    const survivalRate = Math.round((harvestForm.totalFishCount / sourceGrowOut.stockingCount) * 100);
    const biomass = harvestForm.totalWeight;

    const newBatch: HarvestBatch = {
      id: `HAR-${new Date().getFullYear()}-${String(myHarvestBatches.length + 1).padStart(3, "0")}`,
      sourceGrowOutId: harvestForm.sourceGrowOutId,
      pondId: sourceGrowOut.pondId,
      harvestDate: harvestForm.harvestDate,
      totalFishCount: harvestForm.totalFishCount,
      totalWeight: harvestForm.totalWeight,
      avgWeight: parseFloat(avgWeight.toFixed(3)),
      survivalRate: survivalRate,
      biomass: biomass,
      status: "Completed",
      processingStatus: "Pending",
      farmerId: user?.id || "",
      createdAt: new Date().toISOString(),
      notes: harvestForm.notes,
    };

    addHarvestBatch(newBatch);
    setLocalHarvestBatches(prev => [...prev, newBatch]);
    
    // Update grow-out batch status
    const updatedGrowOut = { ...sourceGrowOut, currentStatus: "Harvested" as const };
    setLocalGrowOutBatches(prev => prev.map(g => g.id === updatedGrowOut.id ? updatedGrowOut : g));
    
    toast({ 
      title: pt ? "✅ Colheita Registrada" : "✅ Harvest Recorded", 
      description: `${newBatch.id} | ${pt ? "Biomassa" : "Biomass"}: ${(biomass / 1000).toFixed(1)} ton | ${pt ? "Sobrevivência" : "Survival"}: ${survivalRate}%` 
    });
    
    setHarvestForm({
      sourceGrowOutId: "",
      harvestDate: new Date().toISOString().split("T")[0],
      totalFishCount: 0,
      totalWeight: 0,
      notes: "",
    });
    setOpenHarvestEntry(false);
  };

  // Handle Grow-Out Batch Creation
  const handleCreateGrowOut = () => {
    if (!growOutForm.sourceFryBatchId || !growOutForm.pondId || growOutForm.stockingCount <= 0) {
      toast({ title: pt ? "Erro" : "Error", description: pt ? "Preencha campos obrigatórios" : "Fill required fields", variant: "destructive" });
      return;
    }

    const expectedHarvestDate = new Date(growOutForm.stockingDate);
    expectedHarvestDate.setDate(expectedHarvestDate.getDate() + growOutForm.expectedHarvestDays);

    const newBatch: GrowOutBatch = {
      id: `GROW-${new Date().getFullYear()}-${String(myGrowOutBatches.length + 1).padStart(3, "0")}`,
      sourceFryBatchId: growOutForm.sourceFryBatchId,
      pondId: growOutForm.pondId,
      stockingDate: growOutForm.stockingDate,
      stockingCount: growOutForm.stockingCount,
      avgStockingWeight: growOutForm.avgStockingWeight,
      currentStatus: "Active",
      expectedHarvestDate: expectedHarvestDate.toISOString().split("T")[0],
      farmerId: user?.id || "",
      notes: growOutForm.notes,
    };

    addGrowOutBatch(newBatch);
    setLocalGrowOutBatches(prev => [...prev, newBatch]);
    
    toast({ 
      title: pt ? "✅ Lote de Engorda Criado" : "✅ Grow-out Batch Created", 
      description: `${newBatch.id} | ${pt ? "Viveiro" : "Pond"}: ${growOutForm.pondId} | ${pt ? "Peixes" : "Fish"}: ${growOutForm.stockingCount.toLocaleString()}` 
    });
    
    setGrowOutForm({
      sourceFryBatchId: "",
      pondId: "",
      stockingDate: new Date().toISOString().split("T")[0],
      stockingCount: 0,
      avgStockingWeight: 0,
      expectedHarvestDays: 90,
      notes: "",
    });
    setOpenGrowOutEntry(false);
  };

  // Handle processing status update
  const updateProcessingStatus = (batch: HarvestBatch, newStatus: HarvestBatch["processingStatus"]) => {
    const updatedBatch = { ...batch, processingStatus: newStatus };
    setLocalHarvestBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
    toast({ 
      title: pt ? "✅ Status Atualizado" : "✅ Status Updated", 
      description: `${batch.id} → ${pt ? 
        (newStatus === "Pending" ? "Pendente" : newStatus === "At Plant" ? "Na Planta" : newStatus === "Processed" ? "Processado" : "Enviado") : 
        newStatus}` 
    });
  };

  // Get status badge variant
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Completed": return "bg-primary/10 text-primary border-primary/20";
      case "Processing": return "bg-warning/10 text-warning border-warning/20";
      case "Transferred": return "bg-info/10 text-info border-info/20";
      case "Harvested": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  const getProcessingStatusColor = (status: string) => {
    switch(status) {
      case "Pending": return "bg-destructive/10 text-destructive border-destructive/20";
      case "At Plant": return "bg-warning/10 text-warning border-warning/20";
      case "Processed": return "bg-success/10 text-success border-success/20";
      case "Shipped": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 sm:pt-14 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Scissors className="w-5 h-5 text-primary" /> 
            {pt ? "Gestão de Colheita" : "Harvest Management"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pt ? "Registro de colheitas, engorda e processamento" : "Harvest records, grow-out tracking and processing"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={openGrowOutEntry} onOpenChange={setOpenGrowOutEntry}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" size="sm">
                <Plus className="w-4 h-4" />{pt ? "Novo Lote Engorda" : "New Grow-out"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-heading">{pt ? "Entrada de Lote de Engorda" : "Grow-out Batch Entry"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{pt ? "Lote de Alevinos Origem" : "Source Fry Batch"}</Label>
                  <Select value={growOutForm.sourceFryBatchId} onValueChange={v => setGrowOutForm({...growOutForm, sourceFryBatchId: v})}>
                    <SelectTrigger><SelectValue placeholder={pt ? "Selecione lote de alevinos" : "Select fry batch"} /></SelectTrigger>
                    <SelectContent>
                      {availableFryBatches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.id} - {b.finalFryQuantity?.toLocaleString() || "N/A"} {pt ? "alevinos" : "fry"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Viveiro/Tanque" : "Pond/Tank"}</Label>
                    <Select value={growOutForm.pondId} onValueChange={v => setGrowOutForm({...growOutForm, pondId: v})}>
                      <SelectTrigger><SelectValue placeholder={pt ? "Selecionar" : "Select"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Production Pond PP-01 (2.5 ha)">Production Pond PP-01 (2.5 ha)</SelectItem>
                        <SelectItem value="Production Pond PP-02 (2.0 ha)">Production Pond PP-02 (2.0 ha)</SelectItem>
                        <SelectItem value="Production Pond PP-03 (1.8 ha)">Production Pond PP-03 (1.8 ha)</SelectItem>
                        <SelectItem value="Production Pond PP-04 (3.0 ha)">Production Pond PP-04 (3.0 ha)</SelectItem>
                        <SelectItem value="Production Pond PP-05 (2.2 ha)">Production Pond PP-05 (2.2 ha)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Data Estocagem" : "Stocking Date"}</Label>
                    <Input type="date" value={growOutForm.stockingDate} onChange={e => setGrowOutForm({...growOutForm, stockingDate: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Quantidade Estocada" : "Stocking Count"}</Label>
                    <Input type="number" value={growOutForm.stockingCount || ""} onChange={e => setGrowOutForm({...growOutForm, stockingCount: Number(e.target.value)})} placeholder="e.g., 1000000" className="font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Peso Médio Inicial (g)" : "Avg Stocking Weight (g)"}</Label>
                    <Input type="number" step="0.001" value={growOutForm.avgStockingWeight || ""} onChange={e => setGrowOutForm({...growOutForm, avgStockingWeight: Number(e.target.value)})} placeholder="e.g., 0.025" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Dias até Colheita" : "Days to Harvest"}</Label>
                  <Input type="number" value={growOutForm.expectedHarvestDays} onChange={e => setGrowOutForm({...growOutForm, expectedHarvestDays: Number(e.target.value)})} />
                  <p className="text-xs text-muted-foreground">
                    {pt ? "Colheita prevista para" : "Expected harvest on"}: {
                      new Date(new Date(growOutForm.stockingDate).getTime() + growOutForm.expectedHarvestDays * 24 * 60 * 60 * 1000).toLocaleDateString()
                    }
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Observações" : "Notes"}</Label>
                  <Textarea value={growOutForm.notes} onChange={e => setGrowOutForm({...growOutForm, notes: e.target.value})} rows={2} />
                </div>
                <Button onClick={handleCreateGrowOut} className="w-full gradient-primary text-primary-foreground gap-2">
                  <Fish className="w-4 h-4" />{pt ? "Criar Lote de Engorda" : "Create Grow-out Batch"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openHarvestEntry} onOpenChange={setOpenHarvestEntry}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2" size="sm">
                <Plus className="w-4 h-4" />{pt ? "Nova Colheita" : "New Harvest"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-heading">{pt ? "Entrada de Colheita" : "Harvest Entry"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{pt ? "Lote de Engorda" : "Grow-out Batch"}</Label>
                  <Select value={harvestForm.sourceGrowOutId} onValueChange={v => {
                    const growOut = myGrowOutBatches.find(g => g.id === v);
                    setHarvestForm({...harvestForm, sourceGrowOutId: v});
                  }}>
                    <SelectTrigger><SelectValue placeholder={pt ? "Selecione lote" : "Select batch"} /></SelectTrigger>
                    <SelectContent>
                      {availableGrowOutBatches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.id} - {b.pondId} | {b.stockingCount.toLocaleString()} {pt ? "peixes" : "fish"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Data da Colheita" : "Harvest Date"}</Label>
                    <Input type="date" value={harvestForm.harvestDate} onChange={e => setHarvestForm({...harvestForm, harvestDate: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Total de Peixes" : "Total Fish Count"}</Label>
                    <Input type="number" value={harvestForm.totalFishCount || ""} onChange={e => setHarvestForm({...harvestForm, totalFishCount: Number(e.target.value)})} placeholder="e.g., 850000" className="font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Peso Total (kg)" : "Total Weight (kg)"}</Label>
                    <Input type="number" value={harvestForm.totalWeight || ""} onChange={e => setHarvestForm({...harvestForm, totalWeight: Number(e.target.value)})} placeholder="e.g., 425000" />
                  </div>
                </div>
                {harvestForm.totalFishCount > 0 && harvestForm.totalWeight > 0 && (
                  <div className="p-3 rounded-lg bg-info/10">
                    <p className="text-sm text-info font-medium">
                      {pt ? "Peso Médio" : "Avg Weight"}: {(harvestForm.totalWeight / harvestForm.totalFishCount * 1000).toFixed(0)} g
                    </p>
                    <Progress value={((harvestForm.totalWeight / harvestForm.totalFishCount) / 0.6) * 100} className="h-2 mt-2 [&>div]:bg-info" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>{pt ? "Observações" : "Notes"}</Label>
                  <Textarea value={harvestForm.notes} onChange={e => setHarvestForm({...harvestForm, notes: e.target.value})} rows={2} />
                </div>
                <Button onClick={handleCreateHarvest} className="w-full gradient-primary text-primary-foreground gap-2">
                  <Scissors className="w-4 h-4" />{pt ? "Registrar Colheita" : "Record Harvest"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards - Industrial Scale */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-card border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{pt ? "Total Colhido (kg)" : "Total Harvested (kg)"}</p>
                <p className="text-2xl font-bold text-primary">940 kg</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+23% vs last quarter</p>
              </div>
              <Scale className="w-8 h-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50 bg-gradient-to-br from-info/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{pt ? "Total de Peixes" : "Total Fish Count"}</p>
                <p className="text-2xl font-bold text-info">{totalHarvestedCount.toLocaleString()}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+18% vs last quarter</p>
              </div>
              <Fish className="w-8 h-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50 bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{pt ? "Sobrevivência Média" : "Avg Survival Rate"}</p>
                <p className="text-2xl font-bold text-success">{avgSurvivalRate}%</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+2.5% vs last quarter</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50 bg-gradient-to-br from-warning/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{pt ? "Peso Médio" : "Avg Weight"}</p>
                <p className="text-2xl font-bold text-warning">200.90 kg</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+50g vs last quarter</p>
              </div>
              <Weight className="w-8 h-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Harvest Chart */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              {pt ? "Colheita Mensal" : "Monthly Harvest"}
            </CardTitle>
            <CardDescription>{pt ? "Biomassa colhida por mês (toneladas)" : "Biomass harvested per month (tons)"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyHarvestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000}t`} />
                  <Tooltip formatter={(v) => `${(Number(v) / 1000).toFixed(1)} ton`} />
                  <Legend />
                  <Bar dataKey="weight" name={pt ? "Biomassa (kg)" : "Biomass (kg)"} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Survival Rate Trend Chart */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              {pt ? "Tendência de Sobrevivência" : "Survival Rate Trend"}
            </CardTitle>
            <CardDescription>{pt ? "Taxa de sobrevivência por lote" : "Survival rate by batch"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={survivalRateTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                  <XAxis dataKey="batch" tick={{ fontSize: 10 }} />
                  <YAxis domain={[80, 95]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="rate" name={pt ? "Sobrevivência" : "Survival Rate"} stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} />
                  <Area type="monotone" dataKey="rate" fill="#10b981" fillOpacity={0.1} stroke="none" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Distribution & Pond Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weight Distribution Pie Chart */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              {pt ? "Distribuição de Peso" : "Weight Distribution"}
            </CardTitle>
            <CardDescription>{pt ? "Distribuição dos peixes por faixa de peso" : "Fish distribution by weight range"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={weightDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                    nameKey="range"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {weightDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pond Performance Chart */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-primary" />
              {pt ? "Desempenho por Viveiro" : "Pond Performance"}
            </CardTitle>
            <CardDescription>{pt ? "Comparativo de sobrevivência por viveiro" : "Survival comparison by pond"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pondPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                  <XAxis type="number" domain={[80, 95]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Bar dataKey="survival" name={pt ? "Sobrevivência" : "Survival Rate"} fill="#10b981" radius={[0, 4, 4, 0]}>
                    {pondPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.survival >= 88 ? "#10b981" : entry.survival >= 85 ? "#f59e0b" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs for Batches */}
      <Tabs defaultValue="growout" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="growout" className="gap-2"><Fish className="w-4 h-4" />{pt ? "Lotes em Engorda" : "Grow-out Batches"} ({myGrowOutBatches.length})</TabsTrigger>
          <TabsTrigger value="harvest" className="gap-2"><Scissors className="w-4 h-4" />{pt ? "Colheitas Realizadas" : "Harvest Records"} ({myHarvestBatches.length})</TabsTrigger>
        </TabsList>

        {/* Grow-out Batches Tab */}
        <TabsContent value="growout" className="space-y-4 mt-4">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Fish className="w-4 h-4 text-primary" /> {pt ? "Lotes em Engorda" : "Grow-out Batches"}
              </CardTitle>
              <CardDescription>{pt ? "Acompanhamento de lotes em produção" : "Tracking batches in production"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myGrowOutBatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Fish className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>{pt ? "Nenhum lote em engorda registrado" : "No grow-out batches recorded"}</p>
                    <Button variant="link" onClick={() => setOpenGrowOutEntry(true)} className="mt-2">
                      {pt ? "+ Criar primeiro lote" : "+ Create first batch"}
                    </Button>
                  </div>
                ) : (
                  myGrowOutBatches.map(b => {
                    const daysToHarvest = Math.max(0, Math.ceil((new Date(b.expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                    const progressToHarvest = Math.min(100, Math.max(0, 100 - (daysToHarvest / 90 * 100)));
                    
                    return (
                      <div key={b.id} className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-primary font-bold">{b.id}</span>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(b.currentStatus)}`}>
                              {b.currentStatus === "Active" ? (pt ? "Ativo" : "Active") : (pt ? "Colhido" : "Harvested")}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-secondary/50">
                              {b.pondId.split(" ").slice(0, 2).join(" ")}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {pt ? "Estocagem" : "Stocked"}: {new Date(b.stockingDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Peixes Estocados" : "Stocked Fish"}</p>
                            <p className="font-bold text-foreground">{b.stockingCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Peso Inicial" : "Initial Weight"}</p>
                            <p className="font-medium">{(b.avgStockingWeight * 1000).toFixed(0)} g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Colheita Prevista" : "Expected Harvest"}</p>
                            <p className="font-medium">{new Date(b.expectedHarvestDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Dias Restantes" : "Days Left"}</p>
                            <p className={`font-bold ${daysToHarvest <= 7 ? "text-destructive" : daysToHarvest <= 30 ? "text-warning" : "text-success"}`}>
                              {daysToHarvest} {pt ? "dias" : "days"}
                            </p>
                          </div>
                        </div>
                        
                        {/* Harvest Progress Bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{pt ? "Progresso para Colheita" : "Harvest Progress"}</span>
                            <span>{Math.round(progressToHarvest)}%</span>
                          </div>
                          <Progress value={progressToHarvest} className="h-2" />
                        </div>
                        
                        {b.notes && (
                          <div className="mt-3 text-xs text-muted-foreground border-t border-border/50 pt-2">
                            📝 {b.notes}
                          </div>
                        )}
                        
                        <div className="mt-3 flex justify-end">
                          <Button 
                            variant={daysToHarvest <= 7 ? "default" : "outline"} 
                            size="sm" 
                            className="gap-1 text-xs h-7"
                            onClick={() => {
                              setHarvestForm({
                                ...harvestForm,
                                sourceGrowOutId: b.id,
                                harvestDate: new Date().toISOString().split("T")[0],
                              });
                              setOpenHarvestEntry(true);
                            }}
                            disabled={b.currentStatus !== "Active"}
                          >
                            {daysToHarvest <= 7 ? (
                              <><Scissors className="w-3 h-3" />{pt ? "Colher Agora" : "Harvest Now"}</>
                            ) : (
                              <><Calendar className="w-3 h-3" />{pt ? "Agendar Colheita" : "Schedule Harvest"}</>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Harvest Records Tab */}
        <TabsContent value="harvest" className="space-y-4 mt-4">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Scissors className="w-4 h-4 text-primary" /> {pt ? "Registros de Colheita" : "Harvest Records"}
              </CardTitle>
              <CardDescription>{pt ? "Histórico de colheitas e status de processamento" : "Harvest history and processing status"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myHarvestBatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scissors className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>{pt ? "Nenhuma colheita registrada" : "No harvest records"}</p>
                    <Button variant="link" onClick={() => setOpenHarvestEntry(true)} className="mt-2">
                      {pt ? "+ Registrar primeira colheita" : "+ Record first harvest"}
                    </Button>
                  </div>
                ) : (
                  myHarvestBatches.map(b => {
                    const sourceGrowOut = myGrowOutBatches.find(g => g.id === b.sourceGrowOutId);
                    const valuePerKg = 8.50;
                    const totalValue = b.totalWeight * valuePerKg;
                    
                    return (
                      <div key={b.id} className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-primary font-bold">{b.id}</span>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(b.status)}`}>
                              {b.status === "Completed" ? (pt ? "Concluída" : "Completed") : b.status === "Processing" ? (pt ? "Processando" : "Processing") : (pt ? "Transferido" : "Transferred")}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getProcessingStatusColor(b.processingStatus)}`}>
                              {b.processingStatus === "Pending" ? (pt ? "Pendente" : "Pending") : 
                               b.processingStatus === "At Plant" ? (pt ? "Na Planta" : "At Plant") :
                               b.processingStatus === "Processed" ? (pt ? "Processado" : "Processed") : (pt ? "Enviado" : "Shipped")}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 inline mr-1" />{new Date(b.harvestDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs mb-3">
                          <div>
                            <p className="text-muted-foreground">{pt ? "Viveiro" : "Pond"}</p>
                            <p className="font-medium text-foreground">{b.pondId.split(" ").slice(0, 2).join(" ")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Peixes" : "Fish Count"}</p>
                            <p className="font-medium">{b.totalFishCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Peso Total" : "Total Weight"}</p>
                            <p className="font-medium">{(b.totalWeight / 1000).toFixed(1)} t</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Peso Médio" : "Avg Weight"}</p>
                            <p className="font-medium">{(b.avgWeight * 1000).toFixed(0)} g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Sobrevivência" : "Survival"}</p>
                            <p className={`font-bold ${b.survivalRate >= 85 ? "text-success" : "text-warning"}`}>{b.survivalRate}%</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                          <div className="p-2 rounded-lg bg-success/5">
                            <p className="text-muted-foreground">{pt ? "Biomassa Total" : "Total Biomass"}</p>
                            <p className="font-bold text-success">{(b.biomass / 1000).toFixed(1)} ton</p>
                          </div>
                          <div className="p-2 rounded-lg bg-primary/5">
                            <p className="text-muted-foreground">{pt ? "Valor Estimado" : "Estimated Value"}</p>
                            <p className="font-bold text-primary">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                        
                        {b.notes && (
                          <div className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
                            📝 {b.notes}
                          </div>
                        )}
                        
                        <div className="mt-3 flex justify-end gap-2">
                          {b.processingStatus !== "Shipped" && (
                            <Select onValueChange={(v) => updateProcessingStatus(b, v as HarvestBatch["processingStatus"])} defaultValue={b.processingStatus}>
                              <SelectTrigger className="w-32 h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">{pt ? "Pendente" : "Pending"}</SelectItem>
                                <SelectItem value="At Plant">{pt ? "Na Planta" : "At Plant"}</SelectItem>
                                <SelectItem value="Processed">{pt ? "Processado" : "Processed"}</SelectItem>
                                <SelectItem value="Shipped">{pt ? "Enviado" : "Shipped"}</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" onClick={() => { setSelectedHarvest(b); setOpenBatchDetails(true); }}>
                            {pt ? "Detalhes" : "Details"} <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Batch Details Dialog */}
      <Dialog open={openBatchDetails} onOpenChange={setOpenBatchDetails}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{pt ? "Detalhes da Colheita" : "Harvest Details"} - {selectedHarvest?.id}</DialogTitle>
          </DialogHeader>
          {selectedHarvest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Lote de Origem" : "Source Batch"}</p>
                  <p className="font-mono font-bold">{selectedHarvest.sourceGrowOutId}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Viveiro" : "Pond"}</p>
                  <p className="font-medium">{selectedHarvest.pondId}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Data da Colheita" : "Harvest Date"}</p>
                  <p className="font-medium">{new Date(selectedHarvest.harvestDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Data de Registro" : "Recorded At"}</p>
                  <p className="font-medium">{new Date(selectedHarvest.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-success/5 text-center">
                  <p className="text-muted-foreground text-xs">{pt ? "Total de Peixes" : "Total Fish"}</p>
                  <p className="text-xl font-bold text-success">{selectedHarvest.totalFishCount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 text-center">
                  <p className="text-muted-foreground text-xs">{pt ? "Peso Total" : "Total Weight"}</p>
                  <p className="text-xl font-bold text-primary">{(selectedHarvest.totalWeight / 1000).toFixed(1)} t</p>
                </div>
                <div className="p-3 rounded-lg bg-info/5 text-center">
                  <p className="text-muted-foreground text-xs">{pt ? "Peso Médio" : "Avg Weight"}</p>
                  <p className="text-xl font-bold text-info">{(selectedHarvest.avgWeight * 1000).toFixed(0)} g</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-warning/5">
                  <p className="text-muted-foreground text-xs">{pt ? "Taxa de Sobrevivência" : "Survival Rate"}</p>
                  <p className="text-lg font-bold text-warning">{selectedHarvest.survivalRate}%</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Status de Processamento" : "Processing Status"}</p>
                  <p className="text-lg font-bold">
                    {selectedHarvest.processingStatus === "Pending" ? (pt ? "Pendente" : "Pending") : 
                     selectedHarvest.processingStatus === "At Plant" ? (pt ? "Na Planta" : "At Plant") :
                     selectedHarvest.processingStatus === "Processed" ? (pt ? "Processado" : "Processed") : (pt ? "Enviado" : "Shipped")}
                  </p>
                </div>
              </div>
              
              {selectedHarvest.notes && (
                <div className="p-3 rounded-lg bg-info/10">
                  <p className="text-xs text-info font-medium">{pt ? "Observações" : "Notes"}</p>
                  <p className="text-sm">{selectedHarvest.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HarvestManagement;