import { Formatting, Note } from "./types";
import { defaultFormatting, defaultLabels, mentorPreLabels } from "./constants";

export function noteTextStyle(f?: Formatting) {
  const format = f ?? defaultFormatting;
  return {
    fontWeight: format.bold ? ("bold" as const) : ("normal" as const),
    fontStyle: format.italic ? ("italic" as const) : ("normal" as const),
    textDecorationLine: format.underline
      ? ("underline" as const)
      : ("none" as const),
    fontSize: format.fontSize,
    color: format.fontColor,
  };
}

export function getNoteId(note: Note): string {
  return note._id || note.id || "";
}

export function getLabels(type: string | null, userRole: string): string | string[] {
  if (!type) return [];
  if (type === "Pre") {
    return userRole === "mentor" ? mentorPreLabels : (defaultLabels.Pre as string[]);
  }
  return defaultLabels[type] ?? [];
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br>");
}

export function formatDateKey(createdAt?: string | number, id?: string): string {
  let ts: number | undefined;
  if (typeof createdAt === "string") {
    ts = new Date(createdAt).getTime();
  } else if (typeof createdAt === "number") {
    ts = createdAt;
  } else if (id && Number(id)) {
    ts = Number(id);
  }
  if (!ts || isNaN(ts)) return "Unknown";
  return new Date(ts).toLocaleDateString();
}
