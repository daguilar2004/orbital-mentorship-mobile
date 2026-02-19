import React, { createContext, useContext, useMemo, useState } from "react";

export type UserRole = "mentee" | "mentor";

export type TaskStatus = "pending" | "submitted" | "approved" | "rejected";
export type PhaseStatus = "current" | "completed" | "upcoming";

export type Task = { status: TaskStatus };
export type Phase = {
  name: string;
  status: PhaseStatus;
  startDate: string;
  endDate: string;
  tasks: Task[];
};

type AppContextValue = {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  toggleRole: () => void;

  totalXP: number;
  phases: Phase[];
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("mentee");

  // Mock data for now (replace later with real data/API)
  const [totalXP] = useState<number>(1240);
  const [phases] = useState<Phase[]>([
    {
      name: "Phase 2: Foundations",
      status: "current",
      startDate: "Feb 1",
      endDate: "Mar 1",
      tasks: [
        { status: "approved" },
        { status: "approved" },
        { status: "pending" },
        { status: "submitted" },
      ],
    },
    {
      name: "Phase 1: Onboarding",
      status: "completed",
      startDate: "Jan 1",
      endDate: "Jan 31",
      tasks: [{ status: "approved" }],
    },
  ]);

  const value = useMemo<AppContextValue>(() => {
    return {
      userRole,
      setUserRole,
      toggleRole: () => setUserRole((r) => (r === "mentee" ? "mentor" : "mentee")),
      totalXP,
      phases,
    };
  }, [userRole, totalXP, phases]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
