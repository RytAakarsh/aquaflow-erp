import React, { createContext, useContext, useState, useCallback } from "react";

export interface Broodstock {
  id: string;
  species: string;
  breedType: string;
  gender: "Male" | "Female";
  age: number;
  weight: number;
  source: "Own" | "Supplier";
  tankPond: string;
  healthStatus: "Healthy" | "Sick" | "Quarantine" | "Resting";
  farmerId: string;
  createdAt: string;
}

export interface BreedingGroup {
  id: string;
  maleCount: number;
  femaleCount: number;
  ratio: string;
  tankPond: string;
  status: "Active" | "Completed" | "Pending";
  farmerId: string;
  createdAt: string;
}

export interface BreedingCycle {
  id: string;
  groupId: string;
  startDate: string;
  expectedEggDate: string;
  tankPond: string;
  status: "Active" | "Completed" | "Cancelled";
  totalEggs: number;
  fertilityPercent: number;
  hatchRate: number;
  farmerId: string;
}

export interface EggCollection {
  id: string;
  batchId: string;
  cycleId: string;
  groupId: string;
  collectionDate: string;
  eggQuantity: number;
  fertilizedEggs: number;
  unfertilized: number;
  collectedBy: string;
  farmerId: string;
}

export interface EggBatch {
  id: string;
  cycleId: string;
  eggQuantity: number;
  status: "Pending" | "Approved" | "Rejected" | "Transferred";
  currentStage: "Breeding" | "QC" | "Hatchery" | "Nursery";
  fertilizationRate: number;
  qualityGrade: "A" | "B" | "C" | "D";
  deadEggs: number;
  remarks: string;
  farmerId: string;
  createdAt: string;
}

export interface HatcheryTransfer {
  id: string;
  batchId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  transferDate: string;
  farmerId: string;
}

interface BreedingContextType {
  broodstock: Broodstock[];
  breedingGroups: BreedingGroup[];
  breedingCycles: BreedingCycle[];
  eggCollections: EggCollection[];
  eggBatches: EggBatch[];
  hatcheryTransfers: HatcheryTransfer[];
  addBroodstock: (data: Omit<Broodstock, "id" | "createdAt">) => void;
  addBreedingGroup: (data: Omit<BreedingGroup, "id" | "createdAt">) => void;
  addBreedingCycle: (data: Omit<BreedingCycle, "id">) => void;
  addEggCollection: (data: Omit<EggCollection, "id">) => void;
  addEggBatch: (data: Omit<EggBatch, "id" | "createdAt">) => void;
  updateBatchStatus: (id: string, status: EggBatch["status"], grade?: EggBatch["qualityGrade"]) => void;
  addHatcheryTransfer: (data: Omit<HatcheryTransfer, "id">) => void;
}

const BreedingContext = createContext<BreedingContextType | null>(null);

const INITIAL_BROODSTOCK: Broodstock[] = [
  { id: "BS-001", species: "Tilápia", breedType: "Nilo", gender: "Male", age: 8, weight: 1.2, source: "Own", tankPond: "Tanque-R1", healthStatus: "Healthy", farmerId: "f1", createdAt: "2026-01-15" },
  { id: "BS-002", species: "Tilápia", breedType: "Nilo", gender: "Female", age: 10, weight: 1.5, source: "Own", tankPond: "Tanque-R1", healthStatus: "Healthy", farmerId: "f1", createdAt: "2026-01-15" },
  { id: "BS-003", species: "Tilápia", breedType: "GIFT", gender: "Female", age: 12, weight: 1.8, source: "Supplier", tankPond: "Tanque-R2", healthStatus: "Healthy", farmerId: "f1", createdAt: "2026-02-10" },
  { id: "BS-004", species: "Tilápia", breedType: "Nilo", gender: "Male", age: 9, weight: 1.3, source: "Own", tankPond: "Tanque-R2", healthStatus: "Resting", farmerId: "f1", createdAt: "2026-02-20" },
  { id: "BS-005", species: "Tilápia", breedType: "GIFT", gender: "Female", age: 11, weight: 1.6, source: "Own", tankPond: "Tanque-R1", healthStatus: "Healthy", farmerId: "f3", createdAt: "2026-03-01" },
  { id: "BS-006", species: "Tilápia", breedType: "Nilo", gender: "Male", age: 7, weight: 1.1, source: "Supplier", tankPond: "Tanque-R3", healthStatus: "Healthy", farmerId: "f3", createdAt: "2026-03-05" },
  { id: "BS-007", species: "Tilápia", breedType: "Chitralada", gender: "Female", age: 14, weight: 2.0, source: "Own", tankPond: "Tanque-R1", healthStatus: "Healthy", farmerId: "f2", createdAt: "2026-01-20" },
  { id: "BS-008", species: "Tilápia", breedType: "GIFT", gender: "Female", age: 9, weight: 1.4, source: "Own", tankPond: "Tanque-R2", healthStatus: "Quarantine", farmerId: "f2", createdAt: "2026-03-15" },
];

const INITIAL_GROUPS: BreedingGroup[] = [
  { id: "BG-01", maleCount: 50, femaleCount: 150, ratio: "1:3", tankPond: "Tanque-R1", status: "Active", farmerId: "f1", createdAt: "2026-02-01" },
  { id: "BG-02", maleCount: 30, femaleCount: 90, ratio: "1:3", tankPond: "Tanque-R2", status: "Active", farmerId: "f1", createdAt: "2026-03-01" },
  { id: "BG-03", maleCount: 40, femaleCount: 120, ratio: "1:3", tankPond: "Tanque-R1", status: "Completed", farmerId: "f3", createdAt: "2026-01-15" },
  { id: "BG-04", maleCount: 25, femaleCount: 75, ratio: "1:3", tankPond: "Tanque-R3", status: "Active", farmerId: "f2", createdAt: "2026-03-10" },
];

const INITIAL_CYCLES: BreedingCycle[] = [
  { id: "BC-001", groupId: "BG-01", startDate: "2026-03-01", expectedEggDate: "2026-03-15", tankPond: "Tanque-R1", status: "Completed", totalEggs: 50000, fertilityPercent: 90, hatchRate: 85, farmerId: "f1" },
  { id: "BC-002", groupId: "BG-02", startDate: "2026-03-20", expectedEggDate: "2026-04-05", tankPond: "Tanque-R2", status: "Active", totalEggs: 0, fertilityPercent: 0, hatchRate: 0, farmerId: "f1" },
  { id: "BC-003", groupId: "BG-03", startDate: "2026-02-10", expectedEggDate: "2026-02-25", tankPond: "Tanque-R1", status: "Completed", totalEggs: 42000, fertilityPercent: 88, hatchRate: 82, farmerId: "f3" },
  { id: "BC-004", groupId: "BG-04", startDate: "2026-04-01", expectedEggDate: "2026-04-15", tankPond: "Tanque-R3", status: "Active", totalEggs: 0, fertilityPercent: 0, hatchRate: 0, farmerId: "f2" },
];

const INITIAL_COLLECTIONS: EggCollection[] = [
  { id: "EC-001", batchId: "EGG-2026-001", cycleId: "BC-001", groupId: "BG-01", collectionDate: "2026-03-15", eggQuantity: 50000, fertilizedEggs: 45000, unfertilized: 5000, collectedBy: "Carlos Silva", farmerId: "f1" },
  { id: "EC-002", batchId: "EGG-2026-002", cycleId: "BC-003", groupId: "BG-03", collectionDate: "2026-02-25", eggQuantity: 42000, fertilizedEggs: 37000, unfertilized: 5000, collectedBy: "Pedro Oliveira", farmerId: "f3" },
];

const INITIAL_BATCHES: EggBatch[] = [
  { id: "EGG-2026-001", cycleId: "BC-001", eggQuantity: 50000, status: "Transferred", currentStage: "Hatchery", fertilizationRate: 90, qualityGrade: "A", deadEggs: 200, remarks: "Excellent batch", farmerId: "f1", createdAt: "2026-03-15" },
  { id: "EGG-2026-002", cycleId: "BC-003", eggQuantity: 42000, status: "Approved", currentStage: "QC", fertilizationRate: 88, qualityGrade: "B", deadEggs: 350, remarks: "Good quality", farmerId: "f3", createdAt: "2026-02-25" },
  { id: "EGG-2026-003", cycleId: "BC-002", eggQuantity: 35000, status: "Pending", currentStage: "Breeding", fertilizationRate: 0, qualityGrade: "B", deadEggs: 0, remarks: "", farmerId: "f1", createdAt: "2026-04-01" },
];

const INITIAL_TRANSFERS: HatcheryTransfer[] = [
  { id: "HT-001", batchId: "EGG-2026-001", fromLocation: "Reprodução - Tanque-R1", toLocation: "Incubatório - Inc-01", quantity: 44800, transferDate: "2026-03-17", farmerId: "f1" },
];

export const BreedingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [broodstock, setBroodstock] = useState<Broodstock[]>(INITIAL_BROODSTOCK);
  const [breedingGroups, setBreedingGroups] = useState<BreedingGroup[]>(INITIAL_GROUPS);
  const [breedingCycles, setBreedingCycles] = useState<BreedingCycle[]>(INITIAL_CYCLES);
  const [eggCollections, setEggCollections] = useState<EggCollection[]>(INITIAL_COLLECTIONS);
  const [eggBatches, setEggBatches] = useState<EggBatch[]>(INITIAL_BATCHES);
  const [hatcheryTransfers, setHatcheryTransfers] = useState<HatcheryTransfer[]>(INITIAL_TRANSFERS);

  const addBroodstock = useCallback((data: Omit<Broodstock, "id" | "createdAt">) => {
    setBroodstock(prev => [...prev, { ...data, id: `BS-${String(prev.length + 1).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0] }]);
  }, []);

  const addBreedingGroup = useCallback((data: Omit<BreedingGroup, "id" | "createdAt">) => {
    setBreedingGroups(prev => [...prev, { ...data, id: `BG-${String(prev.length + 1).padStart(2, "0")}`, createdAt: new Date().toISOString().split("T")[0] }]);
  }, []);

  const addBreedingCycle = useCallback((data: Omit<BreedingCycle, "id">) => {
    setBreedingCycles(prev => [...prev, { ...data, id: `BC-${String(prev.length + 1).padStart(3, "0")}` }]);
  }, []);

  const addEggCollection = useCallback((data: Omit<EggCollection, "id">) => {
    setEggCollections(prev => [...prev, { ...data, id: `EC-${String(prev.length + 1).padStart(3, "0")}` }]);
  }, []);

  const addEggBatch = useCallback((data: Omit<EggBatch, "id" | "createdAt">) => {
    setEggBatches(prev => [...prev, { ...data, id: `EGG-2026-${String(prev.length + 1).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0] }]);
  }, []);

  const updateBatchStatus = useCallback((id: string, status: EggBatch["status"], grade?: EggBatch["qualityGrade"]) => {
    setEggBatches(prev => prev.map(b => b.id === id ? { ...b, status, ...(grade ? { qualityGrade: grade } : {}) } : b));
  }, []);

  const addHatcheryTransfer = useCallback((data: Omit<HatcheryTransfer, "id">) => {
    setHatcheryTransfers(prev => [...prev, { ...data, id: `HT-${String(prev.length + 1).padStart(3, "0")}` }]);
    setEggBatches(prev => prev.map(b => b.id === data.batchId ? { ...b, status: "Transferred" as const, currentStage: "Hatchery" as const } : b));
  }, []);

  return (
    <BreedingContext.Provider value={{ broodstock, breedingGroups, breedingCycles, eggCollections, eggBatches, hatcheryTransfers, addBroodstock, addBreedingGroup, addBreedingCycle, addEggCollection, addEggBatch, updateBatchStatus, addHatcheryTransfer }}>
      {children}
    </BreedingContext.Provider>
  );
};

export const useBreeding = () => {
  const ctx = useContext(BreedingContext);
  if (!ctx) throw new Error("useBreeding must be used within BreedingProvider");
  return ctx;
};
