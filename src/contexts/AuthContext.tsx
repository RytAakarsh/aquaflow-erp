import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "admin" | "farmer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  pondCount: number;
  status: "active" | "inactive";
  joinDate: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  farmers: Farmer[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addFarmer: (farmer: Omit<Farmer, "id" | "joinDate">) => Farmer;
  removeFarmer: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_CREDENTIALS = { email: "aqua@gmail.com", password: "Aqua@123" };

const INITIAL_FARMERS: Farmer[] = [
  { id: "f1", name: "Carlos Silva", email: "carlos@farm.com", phone: "+55 11 98765-4321", location: "São Paulo", pondCount: 5, status: "active", joinDate: "2025-06-15", password: "farmer123" },
  { id: "f2", name: "João Santos", email: "joao@farm.com", phone: "+55 21 87654-3210", location: "Minas Gerais", pondCount: 3, status: "active", joinDate: "2025-08-20", password: "farmer123" },
  { id: "f3", name: "Pedro Oliveira", email: "pedro@farm.com", phone: "+55 62 76543-2109", location: "Goiás", pondCount: 8, status: "active", joinDate: "2025-03-10", password: "farmer123" },
  { id: "f4", name: "Rafael Costa", email: "rafael@farm.com", phone: "+55 71 65432-1098", location: "Bahia", pondCount: 4, status: "inactive", joinDate: "2025-11-01", password: "farmer123" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({ id: "admin-1", email, name: "Admin", role: "admin" });
      return true;
    }
    const farmer = farmers.find((f) => f.email === email && f.password === password);
    if (farmer) {
      setUser({ id: farmer.id, email: farmer.email, name: farmer.name, role: "farmer" });
      return true;
    }
    return false;
  }, [farmers]);

  const logout = useCallback(() => setUser(null), []);

  const addFarmer = useCallback((data: Omit<Farmer, "id" | "joinDate">): Farmer => {
    const newFarmer: Farmer = {
      ...data,
      id: `f${Date.now()}`,
      joinDate: new Date().toISOString().split("T")[0],
    };
    setFarmers((prev) => [...prev, newFarmer]);
    return newFarmer;
  }, []);

  const removeFarmer = useCallback((id: string) => {
    setFarmers((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <AuthContext.Provider value={{ user, farmers, login, logout, addFarmer, removeFarmer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
