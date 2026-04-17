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
import { Plus, Fish, Droplets, TrendingUp, Activity, Calendar, ChevronRight, FlaskConical, Layers, BarChart3, AlertCircle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Egg, Factory, Warehouse } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';

// Types for production entries
interface LarvalBatch {
  id: string;
  sourceEggBatchId: string;
  tankId: string;
  transferDate: string;
  eggQuantityReceived: number;
  hatchedLarvaeQty: number;
  hatchRate: number;
  mortality: number;
  status: "Active" | "Transferred" | "Lost";
  farmerId: string;
  createdAt: string;
  notes?: string;
}

interface FryBatch {
  id: string;
  sourceLarvalBatchId: string;
  nurseryPondId: string;
  transferDate: string;
  feedGiven: Array<{ date: string; amount: number; type: string }>;
  growthRecords: Array<{ date: string; avgLength: number; avgWeight: number; sampleSize: number }>;
  mortalityRecords: Array<{ date: string; count: number; cause?: string }>;
  finalFryQuantity: number;
  survivalRate: number;
  status: "Active" | "Harvested" | "Lost";
  farmerId: string;
  createdAt: string;
  expectedHarvestDate?: string;
}

// DEMO DATA - Industrial Scale Production
const DEMO_LARVAL_BATCHES: LarvalBatch[] = [
  {
    id: "LARVAL-2026-001",
    sourceEggBatchId: "EGG-2026-001",
    tankId: "Incubator-01 (2,500L)",
    transferDate: "2026-03-15",
    eggQuantityReceived: 1250000,
    hatchedLarvaeQty: 1125000,
    hatchRate: 90,
    mortality: 45000,
    status: "Active",
    farmerId: "farmer-demo",
    createdAt: "2026-03-15T08:00:00Z",
    notes: "High quality eggs from BC-001 cycle. Excellent fertilization rate."
  },
  {
    id: "LARVAL-2026-002",
    sourceEggBatchId: "EGG-2026-003",
    tankId: "Incubator-02 (3,000L)",
    transferDate: "2026-03-20",
    eggQuantityReceived: 980000,
    hatchedLarvaeQty: 833000,
    hatchRate: 85,
    mortality: 58800,
    status: "Active",
    farmerId: "farmer-demo",
    createdAt: "2026-03-20T10:30:00Z",
    notes: "Good hatch rate. Monitoring temperature closely."
  },
  {
    id: "LARVAL-2026-003",
    sourceEggBatchId: "EGG-2026-005",
    tankId: "Larval Tank LT-01 (5,000L)",
    transferDate: "2026-03-25",
    eggQuantityReceived: 2100000,
    hatchedLarvaeQty: 1785000,
    hatchRate: 85,
    mortality: 126000,
    status: "Active",
    farmerId: "farmer-demo",
    createdAt: "2026-03-25T14:15:00Z",
    notes: "Largest batch of the season. 2.1M eggs received."
  },
  {
    id: "LARVAL-2026-004",
    sourceEggBatchId: "EGG-2026-008",
    tankId: "Larval Tank LT-02 (5,000L)",
    transferDate: "2026-04-01",
    eggQuantityReceived: 1850000,
    hatchedLarvaeQty: 1665000,
    hatchRate: 90,
    mortality: 74000,
    status: "Active",
    farmerId: "farmer-demo",
    createdAt: "2026-04-01T09:00:00Z",
    notes: "Premium broodstock genetics used."
  },
  {
    id: "LARVAL-2026-005",
    sourceEggBatchId: "EGG-2026-010",
    tankId: "Incubator-03 (2,000L)",
    transferDate: "2026-04-05",
    eggQuantityReceived: 750000,
    hatchedLarvaeQty: 637500,
    hatchRate: 85,
    mortality: 37500,
    status: "Transferred",
    farmerId: "farmer-demo",
    createdAt: "2026-04-05T11:00:00Z",
    notes: "Successfully transferred to nursery ponds."
  }
];

const DEMO_FRY_BATCHES: FryBatch[] = [
  {
    id: "FRY-2026-001",
    sourceLarvalBatchId: "LARVAL-2026-001",
    nurseryPondId: "Nursery Pond NP-01 (10,000m²)",
    transferDate: "2026-03-28",
    feedGiven: [
      { date: "2026-03-29", amount: 45.5, type: "Starter #1" },
      { date: "2026-04-01", amount: 52.3, type: "Starter #1" },
      { date: "2026-04-04", amount: 68.7, type: "Starter #2" },
      { date: "2026-04-07", amount: 85.2, type: "Starter #2" },
      { date: "2026-04-10", amount: 102.5, type: "Grower #1" },
      { date: "2026-04-13", amount: 118.0, type: "Grower #1" },
      { date: "2026-04-16", amount: 135.8, type: "Grower #2" },
    ],
    growthRecords: [
      { date: "2026-03-30", avgLength: 0.85, avgWeight: 0.025, sampleSize: 50 },
      { date: "2026-04-02", avgLength: 1.52, avgWeight: 0.082, sampleSize: 50 },
      { date: "2026-04-05", avgLength: 2.21, avgWeight: 0.185, sampleSize: 50 },
      { date: "2026-04-08", avgLength: 3.05, avgWeight: 0.362, sampleSize: 50 },
      { date: "2026-04-11", avgLength: 3.82, avgWeight: 0.615, sampleSize: 50 },
      { date: "2026-04-14", avgLength: 4.48, avgWeight: 0.918, sampleSize: 50 },
      { date: "2026-04-17", avgLength: 5.15, avgWeight: 1.245, sampleSize: 50 },
    ],
    mortalityRecords: [
      { date: "2026-03-30", count: 2500, cause: "Stress" },
      { date: "2026-04-03", count: 1800, cause: "Unknown" },
      { date: "2026-04-08", count: 1200, cause: "Water quality adjustment" },
    ],
    finalFryQuantity: 985000,
    survivalRate: 87.6,
    status: "Active",
    farmerId: "farmer-demo",
    createdAt: "2026-03-28T00:00:00Z",
    expectedHarvestDate: "2026-05-15"
  },
  {
    id: "FRY-2026-002",
    sourceLarvalBatchId: "LARVAL-2026-002",
    nurseryPondId: "Nursery Pond NP-02 (8,000m²)",
    transferDate: "2026-04-02",
    feedGiven: [
      { date: "2026-04-03", amount: 38.2, type: "Starter #1" },
      { date: "2026-04-06", amount: 48.5, type: "Starter #1" },
      { date: "2026-04-09", amount: 62.3, type: "Starter #2" },
      { date: "2026-04-12", amount: 78.9, type: "Starter #2" },
      { date: "2026-04-15", amount: 95.4, type: "Grower #1" },
    ],
    growthRecords: [
      { date: "2026-04-04", avgLength: 0.78, avgWeight: 0.022, sampleSize: 50 },
      { date: "2026-04-07", avgLength: 1.45, avgWeight: 0.075, sampleSize: 50 },
      { date: "2026-04-10", avgLength: 2.12, avgWeight: 0.172, sampleSize: 50 },
      { date: "2026-04-13", avgLength: 2.95, avgWeight: 0.341, sampleSize: 50 },
      { date: "2026-04-16", avgLength: 3.68, avgWeight: 0.588, sampleSize: 50 },
    ],
    mortalityRecords: [
      { date: "2026-04-05", count: 3200, cause: "Parasite treatment" },
      { date: "2026-04-11", count: 1500, cause: "Routine culling" },
    ],
    finalFryQuantity: 728000,
    survivalRate: 87.4,
    status: "Active",
    farmerId: "farmer-demo",
    createdAt: "2026-04-02T00:00:00Z",
    expectedHarvestDate: "2026-05-20"
  },
  {
    id: "FRY-2026-003",
    sourceLarvalBatchId: "LARVAL-2026-003",
    nurseryPondId: "Nursery Tank NT-01 (3,000m²)",
    transferDate: "2026-04-08",
    feedGiven: [
      { date: "2026-04-09", amount: 55.8, type: "Starter #1" },
      { date: "2026-04-12", amount: 72.4, type: "Starter #2" },
      { date: "2026-04-15", amount: 92.1, type: "Grower #1" },
    ],
    growthRecords: [
      { date: "2026-04-10", avgLength: 0.82, avgWeight: 0.024, sampleSize: 50 },
      { date: "2026-04-13", avgLength: 1.58, avgWeight: 0.088, sampleSize: 50 },
      { date: "2026-04-16", avgLength: 2.35, avgWeight: 0.202, sampleSize: 50 },
    ],
    mortalityRecords: [],
    finalFryQuantity: 0,
    survivalRate: 0,
    status: "Active",
    farmerId: "farmer-demo",
    createdAt: "2026-04-08T00:00:00Z",
    expectedHarvestDate: "2026-05-25"
  }
];

// Production metrics data for charts
const weeklyProductionData = [
  { week: "Week 1", eggsReceived: 850000, larvaeHatched: 765000, fryProduced: 0, survival: 90 },
  { week: "Week 2", eggsReceived: 1200000, larvaeHatched: 1080000, fryProduced: 0, survival: 90 },
  { week: "Week 3", eggsReceived: 980000, larvaeHatched: 833000, fryProduced: 0, survival: 85 },
  { week: "Week 4", eggsReceived: 2100000, larvaeHatched: 1785000, fryProduced: 985000, survival: 85 },
  { week: "Week 5", eggsReceived: 1850000, larvaeHatched: 1665000, fryProduced: 728000, survival: 90 },
  { week: "Week 6", eggsReceived: 750000, larvaeHatched: 637500, fryProduced: 0, survival: 85 },
];

const hatchRateTrend = [
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 84 },
  { month: "Mar", rate: 87 },
  { month: "Apr", rate: 89 },
  { month: "May", rate: 91 },
  { month: "Jun", rate: 90 },
];

const survivalRateByPond = [
  { name: "NP-01", survival: 87.6, initial: 1125000, final: 985000 },
  { name: "NP-02", survival: 87.4, initial: 833000, final: 728000 },
  { name: "NT-01", survival: 0, initial: 1785000, final: 0 },
];

const feedConsumptionData = [
  { week: "Week 1", starter: 1250, grower: 0, finisher: 0 },
  { week: "Week 2", starter: 1850, grower: 0, finisher: 0 },
  { week: "Week 3", starter: 2450, grower: 450, finisher: 0 },
  { week: "Week 4", starter: 2200, grower: 1200, finisher: 0 },
  { week: "Week 5", starter: 1800, grower: 1850, finisher: 250 },
  { week: "Week 6", starter: 1200, grower: 2200, finisher: 600 },
];

const HatcheryProduction = () => {
  const { eggBatches, addLarvalBatch, larvalBatches, addFryBatch, fryBatches } = useBreeding();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const pt = language === "pt";

  // State for demo data initialization
  const [initialized, setInitialized] = useState(false);
  const [localLarvalBatches, setLocalLarvalBatches] = useState<LarvalBatch[]>([]);
  const [localFryBatches, setLocalFryBatches] = useState<FryBatch[]>([]);

  // State for dialogs
  const [openLarvalEntry, setOpenLarvalEntry] = useState(false);
  const [openFryEntry, setOpenFryEntry] = useState(false);
  const [openFeedEntry, setOpenFeedEntry] = useState(false);
  const [openGrowthEntry, setOpenGrowthEntry] = useState(false);
  const [openBatchDetails, setOpenBatchDetails] = useState(false);
  const [selectedFryBatch, setSelectedFryBatch] = useState<FryBatch | null>(null);
  const [selectedLarvalBatch, setSelectedLarvalBatch] = useState<LarvalBatch | null>(null);
  
  // Larval batch form state
  const [larvalForm, setLarvalForm] = useState({
    sourceEggBatchId: "",
    tankId: "",
    transferDate: new Date().toISOString().split("T")[0],
    eggQuantityReceived: 0,
    hatchedLarvaeQty: 0,
    mortality: 0,
    notes: "",
  });

  // Fry batch form state
  const [fryForm, setFryForm] = useState({
    sourceLarvalBatchId: "",
    nurseryPondId: "",
    transferDate: new Date().toISOString().split("T")[0],
    initialLarvaeQty: 0,
    notes: "",
  });

  // Feed entry form
  const [feedForm, setFeedForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    feedType: "Starter",
  });

  // Growth entry form
  const [growthForm, setGrowthForm] = useState({
    date: new Date().toISOString().split("T")[0],
    avgLength: 0,
    avgWeight: 0,
    sampleSize: 0,
  });

  // Initialize demo data
  useEffect(() => {
    if (!initialized && user?.id === "farmer-demo") {
      // Add demo larval batches if none exist
      if (larvalBatches.length === 0) {
        DEMO_LARVAL_BATCHES.forEach(batch => {
          addLarvalBatch(batch);
        });
        setLocalLarvalBatches(DEMO_LARVAL_BATCHES);
      }
      // Add demo fry batches if none exist
      if (fryBatches.length === 0) {
        DEMO_FRY_BATCHES.forEach(batch => {
          addFryBatch(batch);
        });
        setLocalFryBatches(DEMO_FRY_BATCHES);
      }
      setInitialized(true);
    }
  }, [user, larvalBatches, fryBatches, addLarvalBatch, addFryBatch, initialized]);

  // Get available egg batches
  const availableEggBatches = eggBatches.filter(b => 
    b.status === "Approved" && 
    b.currentStage === "Hatchery" &&
    !localLarvalBatches.some(l => l.sourceEggBatchId === b.id) &&
    !DEMO_LARVAL_BATCHES.some(l => l.sourceEggBatchId === b.id)
  );

  // Get available larval batches
  const availableLarvalBatches = [...localLarvalBatches, ...DEMO_LARVAL_BATCHES].filter(b => 
    b.status === "Active" &&
    ![...localFryBatches, ...DEMO_FRY_BATCHES].some(f => f.sourceLarvalBatchId === b.id)
  );

  // My batches for display
  const myLarvalBatches = [...localLarvalBatches, ...DEMO_LARVAL_BATCHES].filter(b => b.farmerId === user?.id || b.farmerId === "farmer-demo");
  const myFryBatches = [...localFryBatches, ...DEMO_FRY_BATCHES].filter(b => b.farmerId === user?.id || b.farmerId === "farmer-demo");

  // Calculate totals
  const totalEggsReceived = myLarvalBatches.reduce((s, b) => s + b.eggQuantityReceived, 0);
  const totalLarvaeHatched = myLarvalBatches.reduce((s, b) => s + b.hatchedLarvaeQty, 0);
  const totalFryProduced = myFryBatches.reduce((s, b) => s + b.finalFryQuantity, 0);
  const avgHatchRate = totalEggsReceived > 0 ? Math.round((totalLarvaeHatched / totalEggsReceived) * 100) : 0;
  const avgSurvivalRate = totalLarvaeHatched > 0 ? Math.round((totalFryProduced / totalLarvaeHatched) * 100) : 0;

  // Handle Larval Batch Creation
  const handleCreateLarvalBatch = () => {
    if (!larvalForm.sourceEggBatchId || larvalForm.eggQuantityReceived <= 0) {
      toast({ title: pt ? "Erro" : "Error", description: pt ? "Preencha campos obrigatórios" : "Fill required fields", variant: "destructive" });
      return;
    }

    const hatchRate = larvalForm.eggQuantityReceived > 0 
      ? Math.round((larvalForm.hatchedLarvaeQty / larvalForm.eggQuantityReceived) * 100)
      : 0;

    const newBatch: LarvalBatch = {
      id: `LARVAL-${new Date().getFullYear()}-${String(myLarvalBatches.length + 1).padStart(3, "0")}`,
      sourceEggBatchId: larvalForm.sourceEggBatchId,
      tankId: larvalForm.tankId,
      transferDate: larvalForm.transferDate,
      eggQuantityReceived: larvalForm.eggQuantityReceived,
      hatchedLarvaeQty: larvalForm.hatchedLarvaeQty,
      hatchRate: hatchRate,
      mortality: larvalForm.mortality,
      status: "Active",
      farmerId: user?.id || "",
      createdAt: new Date().toISOString(),
      notes: larvalForm.notes,
    };

    addLarvalBatch(newBatch);
    setLocalLarvalBatches(prev => [...prev, newBatch]);
    toast({ 
      title: pt ? "✅ Lote de Larvas Criado" : "✅ Larval Batch Created", 
      description: `${pt ? "ID" : "ID"}: ${newBatch.id} | ${pt ? "Taxa de Eclosão" : "Hatch Rate"}: ${hatchRate}%` 
    });
    
    setLarvalForm({
      sourceEggBatchId: "",
      tankId: "",
      transferDate: new Date().toISOString().split("T")[0],
      eggQuantityReceived: 0,
      hatchedLarvaeQty: 0,
      mortality: 0,
      notes: "",
    });
    setOpenLarvalEntry(false);
  };

  // Handle Fry Batch Creation
  const handleCreateFryBatch = () => {
    if (!fryForm.sourceLarvalBatchId || !fryForm.nurseryPondId) {
      toast({ title: pt ? "Erro" : "Error", description: pt ? "Preencha campos obrigatórios" : "Fill required fields", variant: "destructive" });
      return;
    }

    const newBatch: FryBatch = {
      id: `FRY-${new Date().getFullYear()}-${String(myFryBatches.length + 1).padStart(3, "0")}`,
      sourceLarvalBatchId: fryForm.sourceLarvalBatchId,
      nurseryPondId: fryForm.nurseryPondId,
      transferDate: fryForm.transferDate,
      feedGiven: [],
      growthRecords: [],
      mortalityRecords: [],
      finalFryQuantity: 0,
      survivalRate: 0,
      status: "Active",
      farmerId: user?.id || "",
      createdAt: new Date().toISOString(),
      expectedHarvestDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };

    addFryBatch(newBatch);
    setLocalFryBatches(prev => [...prev, newBatch]);
    toast({ 
      title: pt ? "✅ Lote de Alevinos Criado" : "✅ Fry Batch Created", 
      description: `${pt ? "ID" : "ID"}: ${newBatch.id} | ${pt ? "Viveiro" : "Nursery"}: ${fryForm.nurseryPondId}` 
    });
    
    setFryForm({
      sourceLarvalBatchId: "",
      nurseryPondId: "",
      transferDate: new Date().toISOString().split("T")[0],
      initialLarvaeQty: 0,
      notes: "",
    });
    setOpenFryEntry(false);
  };

  // Handle Feed Entry
  const handleAddFeedEntry = () => {
    if (!selectedFryBatch || feedForm.amount <= 0) return;
    
    const updatedFeed = [...selectedFryBatch.feedGiven, { 
      date: feedForm.date, 
      amount: feedForm.amount, 
      type: feedForm.feedType 
    }];
    
    const updatedBatch = { ...selectedFryBatch, feedGiven: updatedFeed };
    setLocalFryBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
    
    toast({ title: pt ? "🍽️ Alimentação Registrada" : "🍽️ Feeding Recorded", description: `${feedForm.amount} kg ${pt ? "fornecidos" : "provided"}` });
    setOpenFeedEntry(false);
    setFeedForm({ date: new Date().toISOString().split("T")[0], amount: 0, feedType: "Starter" });
  };

  // Handle Growth Entry
  const handleAddGrowthEntry = () => {
    if (!selectedFryBatch || growthForm.avgLength <= 0 || growthForm.avgWeight <= 0) return;
    
    const updatedGrowth = [...selectedFryBatch.growthRecords, { 
      date: growthForm.date, 
      avgLength: growthForm.avgLength, 
      avgWeight: growthForm.avgWeight,
      sampleSize: growthForm.sampleSize || 50
    }];
    
    const updatedBatch = { ...selectedFryBatch, growthRecords: updatedGrowth };
    setLocalFryBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
    
    toast({ title: pt ? "📏 Crescimento Registrado" : "📏 Growth Recorded", description: `L:${growthForm.avgLength}cm | W:${growthForm.avgWeight}g` });
    setOpenGrowthEntry(false);
    setGrowthForm({ date: new Date().toISOString().split("T")[0], avgLength: 0, avgWeight: 0, sampleSize: 0 });
  };

  // Handle Harvest (complete batch)
  const handleHarvestBatch = (batch: FryBatch) => {
    const finalQty = Math.round(batch.growthRecords.length > 0 ? batch.finalFryQuantity || (batch.growthRecords[batch.growthRecords.length - 1].avgWeight * 1000000) : 500000);
    const sourceLarval = myLarvalBatches.find(l => l.id === batch.sourceLarvalBatchId);
    const survivalRate = sourceLarval ? Math.round((finalQty / sourceLarval.hatchedLarvaeQty) * 100) : 85;
    
    const updatedBatch = { 
      ...batch, 
      status: "Harvested" as const, 
      finalFryQuantity: finalQty,
      survivalRate: survivalRate
    };
    setLocalFryBatches(prev => prev.map(b => b.id === updatedBatch.id ? updatedBatch : b));
    
    toast({ 
      title: pt ? "🎉 Lote Colhido com Sucesso!" : "🎉 Batch Harvested Successfully!", 
      description: `${finalQty.toLocaleString()} ${pt ? "alevinos produzidos" : "fry produced"} | ${pt ? "Sobrevivência" : "Survival"}: ${survivalRate}%` 
    });
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return "default";
      case "Transferred": return "secondary";
      case "Harvested": return "default";
      case "Lost": return "destructive";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Harvested": return "bg-primary/10 text-primary border-primary/20";
      case "Lost": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 sm:pt-14 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" /> 
            {pt ? "Produção de Larvas e Alevinos" : "Larval & Fry Production"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pt ? "Gestão completa do incubatório ao viveiro" : "Complete management from hatchery to nursery"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={openLarvalEntry} onOpenChange={setOpenLarvalEntry}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2" size="sm">
                <Plus className="w-4 h-4" />{pt ? "Novo Lote Larval" : "New Larval Batch"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-heading">{pt ? "Entrada de Lote Larval" : "Larval Batch Entry"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{pt ? "Lote de Ovos Origem" : "Source Egg Batch"}</Label>
                  <Select value={larvalForm.sourceEggBatchId} onValueChange={v => {
                    const egg = eggBatches.find(e => e.id === v);
                    setLarvalForm({...larvalForm, sourceEggBatchId: v, eggQuantityReceived: egg?.eggQuantity || 0});
                  }}>
                    <SelectTrigger><SelectValue placeholder={pt ? "Selecione lote de ovos" : "Select egg batch"} /></SelectTrigger>
                    <SelectContent>
                      {availableEggBatches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.id} - {b.eggQuantity.toLocaleString()} {pt ? "ovos" : "eggs"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Tanque/Incubadora" : "Tank/Incubator"}</Label>
                    <Select value={larvalForm.tankId} onValueChange={v => setLarvalForm({...larvalForm, tankId: v})}>
                      <SelectTrigger><SelectValue placeholder={pt ? "Selecionar" : "Select"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Incubator-01 (2,500L)">Incubator-01 (2,500L)</SelectItem>
                        <SelectItem value="Incubator-02 (3,000L)">Incubator-02 (3,000L)</SelectItem>
                        <SelectItem value="Incubator-03 (2,000L)">Incubator-03 (2,000L)</SelectItem>
                        <SelectItem value="Larval Tank LT-01 (5,000L)">Larval Tank LT-01 (5,000L)</SelectItem>
                        <SelectItem value="Larval Tank LT-02 (5,000L)">Larval Tank LT-02 (5,000L)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Data Transferência" : "Transfer Date"}</Label>
                    <Input type="date" value={larvalForm.transferDate} onChange={e => setLarvalForm({...larvalForm, transferDate: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Ovos Recebidos" : "Eggs Received"}</Label>
                    <Input type="number" value={larvalForm.eggQuantityReceived || ""} onChange={e => setLarvalForm({...larvalForm, eggQuantityReceived: Number(e.target.value)})} className="font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Larvas Eclodidas" : "Hatched Larvae"}</Label>
                    <Input type="number" value={larvalForm.hatchedLarvaeQty || ""} onChange={e => setLarvalForm({...larvalForm, hatchedLarvaeQty: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Mortalidade" : "Mortality"}</Label>
                    <Input type="number" value={larvalForm.mortality || ""} onChange={e => setLarvalForm({...larvalForm, mortality: Number(e.target.value)})} />
                  </div>
                </div>
                {larvalForm.eggQuantityReceived > 0 && (
                  <div className="p-3 rounded-lg bg-info/10">
                    <p className="text-sm text-info font-medium">{pt ? "Taxa de Eclosão" : "Hatch Rate"}: {Math.round(larvalForm.hatchedLarvaeQty / larvalForm.eggQuantityReceived * 100)}%</p>
                    <Progress value={larvalForm.hatchedLarvaeQty / larvalForm.eggQuantityReceived * 100} className="h-2 mt-2 [&>div]:bg-info" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>{pt ? "Observações" : "Notes"}</Label>
                  <Textarea value={larvalForm.notes} onChange={e => setLarvalForm({...larvalForm, notes: e.target.value})} rows={2} />
                </div>
                <Button onClick={handleCreateLarvalBatch} className="w-full gradient-primary text-primary-foreground gap-2">
                  <Droplets className="w-4 h-4" />{pt ? "Criar Lote Larval" : "Create Larval Batch"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openFryEntry} onOpenChange={setOpenFryEntry}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" size="sm">
                <Plus className="w-4 h-4" />{pt ? "Novo Lote Alevinos" : "New Fry Batch"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="font-heading">{pt ? "Entrada de Lote de Alevinos" : "Fry Batch Entry"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{pt ? "Lote Larval Origem" : "Source Larval Batch"}</Label>
                  <Select value={fryForm.sourceLarvalBatchId} onValueChange={v => {
                    const larval = myLarvalBatches.find(l => l.id === v);
                    setFryForm({...fryForm, sourceLarvalBatchId: v, initialLarvaeQty: larval?.hatchedLarvaeQty || 0});
                  }}>
                    <SelectTrigger><SelectValue placeholder={pt ? "Selecione lote larval" : "Select larval batch"} /></SelectTrigger>
                    <SelectContent>
                      {availableLarvalBatches.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.id} - {b.hatchedLarvaeQty.toLocaleString()} {pt ? "larvas" : "larvae"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{pt ? "Viveiro/Tanque" : "Nursery Pond/Tank"}</Label>
                    <Select value={fryForm.nurseryPondId} onValueChange={v => setFryForm({...fryForm, nurseryPondId: v})}>
                      <SelectTrigger><SelectValue placeholder={pt ? "Selecionar" : "Select"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nursery Pond NP-01 (10,000m²)">Nursery Pond NP-01 (10,000m²)</SelectItem>
                        <SelectItem value="Nursery Pond NP-02 (8,000m²)">Nursery Pond NP-02 (8,000m²)</SelectItem>
                        <SelectItem value="Nursery Tank NT-01 (3,000m²)">Nursery Tank NT-01 (3,000m²)</SelectItem>
                        <SelectItem value="Nursery Tank NT-02 (2,500m²)">Nursery Tank NT-02 (2,500m²)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{pt ? "Data Transferência" : "Transfer Date"}</Label>
                    <Input type="date" value={fryForm.transferDate} onChange={e => setFryForm({...fryForm, transferDate: e.target.value})} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium">{pt ? "Larvas Recebidas" : "Larvae Received"}: <span className="text-primary font-bold">{fryForm.initialLarvaeQty.toLocaleString()}</span></p>
                </div>
                <div className="space-y-1.5">
                  <Label>{pt ? "Observações" : "Notes"}</Label>
                  <Textarea value={fryForm.notes} onChange={e => setFryForm({...fryForm, notes: e.target.value})} rows={2} />
                </div>
                <Button onClick={handleCreateFryBatch} className="w-full gradient-primary text-primary-foreground gap-2">
                  <Fish className="w-4 h-4" />{pt ? "Criar Lote de Alevinos" : "Create Fry Batch"}
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
                <p className="text-xs text-muted-foreground">{pt ? "Total Ovos Recebidos" : "Total Eggs Received"}</p>
                <p className="text-2xl font-bold text-primary">{totalEggsReceived.toLocaleString()}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+15% vs last month</p>
              </div>
              <Egg className="w-8 h-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50 bg-gradient-to-br from-info/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{pt ? "Total Larvas Eclodidas" : "Total Larvae Hatched"}</p>
                <p className="text-2xl font-bold text-info">{totalLarvaeHatched.toLocaleString()}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+12% vs last month</p>
              </div>
              <Droplets className="w-8 h-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50 bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{pt ? "Total Alevinos Produzidos" : "Total Fry Produced"}</p>
                <p className="text-2xl font-bold text-success">{totalFryProduced.toLocaleString()}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+8% vs last month</p>
              </div>
              <Fish className="w-8 h-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50 bg-gradient-to-br from-warning/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{pt ? "Taxa Média Eclosão" : "Avg Hatch Rate"}</p>
                <p className="text-2xl font-bold text-warning">{avgHatchRate}%</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3" />+3% vs last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Production Chart */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              {pt ? "Produção Semanal" : "Weekly Production"}
            </CardTitle>
            <CardDescription>{pt ? "Ovos recebidos vs Larvas eclodidas" : "Eggs received vs Larvae hatched"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => Number(v).toLocaleString()} />
                  <Legend />
                  <Bar dataKey="eggsReceived" name={pt ? "Ovos Recebidos" : "Eggs Received"} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="larvaeHatched" name={pt ? "Larvas Eclodidas" : "Larvae Hatched"} fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hatch Rate Trend Chart */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              {pt ? "Tendência de Eclosão" : "Hatch Rate Trend"}
            </CardTitle>
            <CardDescription>{pt ? "Taxa de eclosão mensal" : "Monthly hatch rate percentage"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hatchRateTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis domain={[70, 95]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="rate" name={pt ? "Taxa de Eclosão" : "Hatch Rate"} stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4 }} />
                  <Area type="monotone" dataKey="rate" fill="#3b82f6" fillOpacity={0.1} stroke="none" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feed Consumption Chart */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Factory className="w-4 h-4 text-primary" />
            {pt ? "Consumo de Ração" : "Feed Consumption"}
          </CardTitle>
          <CardDescription>{pt ? "Consumo semanal por tipo de ração (kg)" : "Weekly consumption by feed type (kg)"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feedConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `${v} kg`} />
                <Legend />
                <Area type="monotone" dataKey="starter" name="Starter" stackId="1" fill="#3b82f6" stroke="#3b82f6" />
                <Area type="monotone" dataKey="grower" name="Grower" stackId="1" fill="#10b981" stroke="#10b981" />
                <Area type="monotone" dataKey="finisher" name="Finisher" stackId="1" fill="#f59e0b" stroke="#f59e0b" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs for Batches */}
      <Tabs defaultValue="larval" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="larval" className="gap-2"><Droplets className="w-4 h-4" />{pt ? "Lotes Larva" : "Larval Batches"} ({myLarvalBatches.length})</TabsTrigger>
          <TabsTrigger value="fry" className="gap-2"><Fish className="w-4 h-4" />{pt ? "Lotes Alevinos" : "Fry Batches"} ({myFryBatches.length})</TabsTrigger>
        </TabsList>

        {/* Larval Batches Tab */}
        <TabsContent value="larval" className="space-y-4 mt-4">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" /> {pt ? "Lotes Larva" : "Larval Batches"}
              </CardTitle>
              <CardDescription>{pt ? "Acompanhamento de lotes em incubação" : "Tracking batches in incubation"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myLarvalBatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Droplets className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>{pt ? "Nenhum lote larval registrado" : "No larval batches recorded"}</p>
                    <Button variant="link" onClick={() => setOpenLarvalEntry(true)} className="mt-2">
                      {pt ? "+ Criar primeiro lote" : "+ Create first batch"}
                    </Button>
                  </div>
                ) : (
                  myLarvalBatches.map(b => {
                    const survivalToFry = myFryBatches.find(f => f.sourceLarvalBatchId === b.id)?.finalFryQuantity || 0;
                    const survivalPercent = b.hatchedLarvaeQty > 0 ? Math.round((survivalToFry / b.hatchedLarvaeQty) * 100) : 0;
                    
                    return (
                      <div key={b.id} className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-primary font-bold">{b.id}</span>
                            <Badge variant={getStatusBadge(b.status)} className={`text-xs ${getStatusColor(b.status)}`}>
                              {pt ? (b.status === "Active" ? "Ativo" : b.status === "Transferred" ? "Transferido" : "Perdido") : b.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/20">
                              {b.tankId}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 inline mr-1" />{new Date(b.transferDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Ovos Recebidos" : "Eggs Received"}</p>
                            <p className="font-bold text-foreground">{b.eggQuantityReceived.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Larvas Eclodidas" : "Larvae Hatched"}</p>
                            <p className="font-bold text-success">{b.hatchedLarvaeQty.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Taxa Eclosão" : "Hatch Rate"}</p>
                            <div className="flex items-center gap-2">
                              <p className={`font-bold ${b.hatchRate >= 85 ? "text-success" : b.hatchRate >= 70 ? "text-warning" : "text-destructive"}`}>{b.hatchRate}%</p>
                              <Progress value={b.hatchRate} className="w-16 h-1.5" />
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">{pt ? "Sobrevivência p/ Alevino" : "Survival to Fry"}</p>
                            <p className={`font-bold ${survivalPercent >= 80 ? "text-success" : "text-warning"}`}>{survivalPercent}%</p>
                          </div>
                        </div>
                        
                        {b.notes && (
                          <div className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
                            📝 {b.notes}
                          </div>
                        )}
                        
                        <div className="mt-3 flex justify-end">
                          <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" onClick={() => { setSelectedLarvalBatch(b); setOpenBatchDetails(true); }}>
                            {pt ? "Ver Detalhes" : "View Details"} <ChevronRight className="w-3 h-3" />
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

        {/* Fry Batches Tab */}
        <TabsContent value="fry" className="space-y-4 mt-4">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Fish className="w-4 h-4 text-primary" /> {pt ? "Lotes de Alevinos" : "Fry Batches"}
              </CardTitle>
              <CardDescription>{pt ? "Registros diários de alimentação, crescimento e mortalidade" : "Daily records of feeding, growth and mortality"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myFryBatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Fish className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>{pt ? "Nenhum lote de alevinos registrado" : "No fry batches recorded"}</p>
                    <Button variant="link" onClick={() => setOpenFryEntry(true)} className="mt-2">
                      {pt ? "+ Criar primeiro lote" : "+ Create first batch"}
                    </Button>
                  </div>
                ) : (
                  myFryBatches.map(b => {
                    const sourceLarval = myLarvalBatches.find(l => l.id === b.sourceLarvalBatchId);
                    const latestGrowth = b.growthRecords[b.growthRecords.length - 1];
                    const totalFeed = b.feedGiven.reduce((sum, f) => sum + f.amount, 0);
                    const totalMortality = b.mortalityRecords.reduce((sum, m) => sum + m.count, 0);
                    
                    return (
                      <div key={b.id} className="p-4 rounded-lg border border-border hover:shadow-card transition-shadow">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-primary font-bold">{b.id}</span>
                            <Badge variant={getStatusBadge(b.status)} className={`text-xs ${getStatusColor(b.status)}`}>
                              {pt ? (b.status === "Active" ? "Ativo" : b.status === "Harvested" ? "Colhido" : "Perdido") : b.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-secondary/50">
                              {b.nurseryPondId}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {b.status === "Active" && (
                              <>
                                <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => { setSelectedFryBatch(b); setOpenFeedEntry(true); }}>
                                  <Plus className="w-3 h-3" />{pt ? "Alimentação" : "Feed"}
                                </Button>
                                <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => { setSelectedFryBatch(b); setOpenGrowthEntry(true); }}>
                                  <Plus className="w-3 h-3" />{pt ? "Crescimento" : "Growth"}
                                </Button>
                                <Button size="sm" variant="default" className="gap-1 text-xs h-7 bg-success hover:bg-success/80" onClick={() => handleHarvestBatch(b)}>
                                  <CheckCircle2 className="w-3 h-3" />{pt ? "Colher" : "Harvest"}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs mb-3">
                          <div>
                            <p className="text-muted-foreground">{pt ? "Larvas Iniciais" : "Initial Larvae"}</p>
                            <p className="font-medium">{sourceLarval?.hatchedLarvaeQty.toLocaleString() || "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Alevinos Finais" : "Final Fry"}</p>
                            <p className="font-medium text-success">{b.finalFryQuantity.toLocaleString() || (b.status === "Active" ? "Em produção" : "-")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Sobrevivência" : "Survival"}</p>
                            <p className={`font-bold ${b.survivalRate >= 85 ? "text-success" : b.survivalRate >= 70 ? "text-warning" : "text-muted-foreground"}`}>
                              {b.survivalRate > 0 ? `${b.survivalRate}%` : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Ração Total" : "Total Feed"}</p>
                            <p className="font-medium">{totalFeed.toLocaleString()} kg</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Crescimento Atual" : "Current Growth"}</p>
                            <p className="font-medium">{latestGrowth ? `${latestGrowth.avgLength}cm / ${latestGrowth.avgWeight}g` : "-"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{pt ? "Registros" : "Records"}</p>
                            <p className="font-medium">{b.growthRecords.length} {pt ? "medições" : "measurements"}</p>
                          </div>
                        </div>
                        
                        {/* Growth Chart for this batch */}
                        {b.growthRecords.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-2">{pt ? "Progresso de Crescimento" : "Growth Progress"}</p>
                            <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={b.growthRecords.map((r, i) => ({ ...r, week: `D${Math.ceil((new Date(r.date).getTime() - new Date(b.transferDate).getTime()) / (1000 * 60 * 60 * 24))}` }))}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                  <Legend />
                                  <Line yAxisId="left" type="monotone" dataKey="avgLength" stroke="#3b82f6" name={pt ? "Comprimento (cm)" : "Length (cm)"} strokeWidth={2} />
                                  <Line yAxisId="right" type="monotone" dataKey="avgWeight" stroke="#10b981" name={pt ? "Peso (g)" : "Weight (g)"} strokeWidth={2} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                        
                        {/* Recent Feed Records */}
                        {b.feedGiven.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-2">{pt ? "Últimas Alimentações" : "Recent Feedings"}</p>
                            <div className="flex flex-wrap gap-2">
                              {b.feedGiven.slice(-3).reverse().map((f, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {new Date(f.date).toLocaleDateString()}: {f.amount}kg ({f.type})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Survival Rate by Pond Chart */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-primary" />
            {pt ? "Taxa de Sobrevivência por Viveiro" : "Survival Rate by Nursery"}
          </CardTitle>
          <CardDescription>{pt ? "Comparativo de desempenho entre viveiros" : "Performance comparison between nurseries"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={survivalRateByPond}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
                <Bar dataKey="survival" name={pt ? "Taxa de Sobrevivência" : "Survival Rate"} fill="#10b981" radius={[4, 4, 0, 0]}>
                  {survivalRateByPond.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.survival >= 85 ? "#10b981" : entry.survival >= 70 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Feed Entry Dialog */}
      <Dialog open={openFeedEntry} onOpenChange={setOpenFeedEntry}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{pt ? "Registrar Alimentação" : "Record Feeding"} - {selectedFryBatch?.id}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{pt ? "Data" : "Date"}</Label>
              <Input type="date" value={feedForm.date} onChange={e => setFeedForm({...feedForm, date: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{pt ? "Quantidade (kg)" : "Amount (kg)"}</Label>
                <Input type="number" step="0.1" value={feedForm.amount || ""} onChange={e => setFeedForm({...feedForm, amount: Number(e.target.value)})} placeholder="e.g., 125.5" />
              </div>
              <div className="space-y-1.5">
                <Label>{pt ? "Tipo de Ração" : "Feed Type"}</Label>
                <Select value={feedForm.feedType} onValueChange={v => setFeedForm({...feedForm, feedType: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter #1">Starter #1 (0-5mm)</SelectItem>
                    <SelectItem value="Starter #2">Starter #2 (5-10mm)</SelectItem>
                    <SelectItem value="Grower #1">Grower #1 (10-15mm)</SelectItem>
                    <SelectItem value="Grower #2">Grower #2 (15-20mm)</SelectItem>
                    <SelectItem value="Finisher">Finisher (20-25mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddFeedEntry} className="w-full gradient-primary text-primary-foreground">{pt ? "Registrar" : "Record"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Growth Entry Dialog */}
      <Dialog open={openGrowthEntry} onOpenChange={setOpenGrowthEntry}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{pt ? "Registrar Crescimento" : "Record Growth"} - {selectedFryBatch?.id}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{pt ? "Data" : "Date"}</Label>
              <Input type="date" value={growthForm.date} onChange={e => setGrowthForm({...growthForm, date: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{pt ? "Comprimento Médio (cm)" : "Avg Length (cm)"}</Label>
                <Input type="number" step="0.01" value={growthForm.avgLength || ""} onChange={e => setGrowthForm({...growthForm, avgLength: Number(e.target.value)})} placeholder="e.g., 5.25" />
              </div>
              <div className="space-y-1.5">
                <Label>{pt ? "Peso Médio (g)" : "Avg Weight (g)"}</Label>
                <Input type="number" step="0.01" value={growthForm.avgWeight || ""} onChange={e => setGrowthForm({...growthForm, avgWeight: Number(e.target.value)})} placeholder="e.g., 1.35" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{pt ? "Tamanho da Amostra" : "Sample Size"}</Label>
              <Input type="number" value={growthForm.sampleSize || ""} onChange={e => setGrowthForm({...growthForm, sampleSize: Number(e.target.value)})} placeholder={pt ? "Nº de peixes medidos" : "Number of fish measured"} defaultValue={50} />
            </div>
            <Button onClick={handleAddGrowthEntry} className="w-full gradient-primary text-primary-foreground">{pt ? "Registrar" : "Record"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Batch Details Dialog */}
      <Dialog open={openBatchDetails} onOpenChange={setOpenBatchDetails}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{pt ? "Detalhes do Lote" : "Batch Details"} - {selectedLarvalBatch?.id}</DialogTitle>
          </DialogHeader>
          {selectedLarvalBatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Lote de Ovos Origem" : "Source Egg Batch"}</p>
                  <p className="font-mono font-bold">{selectedLarvalBatch.sourceEggBatchId}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Tanque/Incubadora" : "Tank/Incubator"}</p>
                  <p className="font-medium">{selectedLarvalBatch.tankId}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Data de Transferência" : "Transfer Date"}</p>
                  <p className="font-medium">{new Date(selectedLarvalBatch.transferDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground text-xs">{pt ? "Data de Criação" : "Created At"}</p>
                  <p className="font-medium">{new Date(selectedLarvalBatch.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedLarvalBatch.notes && (
                <div className="p-3 rounded-lg bg-info/10">
                  <p className="text-xs text-info font-medium">{pt ? "Observações" : "Notes"}</p>
                  <p className="text-sm">{selectedLarvalBatch.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HatcheryProduction;