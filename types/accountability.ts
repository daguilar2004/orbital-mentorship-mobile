export type TabKey = "habits" | "goals";
export type DayKey = "S" | "M" | "T" | "W" | "T2" | "F" | "S2";

export type DailyHabit = {
  id: string;
  title: string;
  days: DayKey[];
  completedOn?: string | null;
  linkedGoalId?: string;
};

export type SmartGoal = {
  id: string;
  title: string;
  time: string;
  specific: string;
  measurable: string;
  achievable?: string;
  relevant?: string;
  timeBound: string;
  completed: boolean;
  linkedHabitId?: string;
};