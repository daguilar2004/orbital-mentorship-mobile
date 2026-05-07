import { DayKey } from "../types/accountability";

export const DAY_OPTIONS: { key: DayKey; label: string; short: string }[] = [
  { key: "S", label: "Sunday", short: "S" },
  { key: "M", label: "Monday", short: "M" },
  { key: "T", label: "Tuesday", short: "T" },
  { key: "W", label: "Wednesday", short: "W" },
  { key: "T2", label: "Thursday", short: "T" },
  { key: "F", label: "Friday", short: "F" },
  { key: "S2", label: "Saturday", short: "S" },
];

export const COLORS = {
  bg: "#F7F4FB",
  card: "#FFFFFF",
  text: "#1F2340",
  subtext: "#7F8198",
  primary: "#23205E",
  primarySoft: "#ECE7FB",
  pinkSoft: "#FFE3EF",
  pinkText: "#ff3b89",
  border: "#E8E0F0",
  borderSoft: "#F0EBF6",
  active: "#ff3b89",
  white: "#FFFFFF",
};