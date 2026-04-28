import { DayKey } from "../types/accountability";

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDayKey(): DayKey {
  const day = new Date().getDay();
  const map: DayKey[] = ["S", "M", "T", "W", "T2", "F", "S2"];
  return map[day];
}