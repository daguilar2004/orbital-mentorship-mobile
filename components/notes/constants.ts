import { Formatting, ViewMode } from "./types";

export const categoryColors: Record<string, string> = {
  Pre: "#ff3b89",
  During: "#0b0c67",
  Post: "#e373bd",
  Daily: "#0b0c67",
  New: "#cfc2eb",
};

export const options = ["Pre", "During", "Post", "Daily", "New"];

export const displayLabels: Record<string, string> = {
  Pre: "Pre-Session",
  During: "In Session",
  Post: "Post-Session",
  Daily: "Daily Reflection",
  New: "+ New Note",
};

export const defaultLabels: Record<string, string | string[]> = {
  Pre: [
    "What is one specific thing I want clarity on?",
    "What have I tried since our last conversation?",
    "Where am I feeling stuck, uncertain, or overwhelmed?",
    "What decision, next step, or mindset shift would help me most right now?",
  ],
  During: [
    "What would make this session valuable today? What are the one or two things we should focus on? What does success look like by the end of this session?",
    "What has gone well since our last session? What challenges came up? What did you learn from those experiences?",
    "What are some possible ways to move forward? What else could you try? If there were no constraints, what would you do?",
    "Which option feels best right now? What specific action will you take? By when will you complete it? How will you measure progress?",
    "What is your biggest takeaway from today? What are you committing to before next time? When should we check in again?",
  ],
  Post: ["What did I learn or realize during this session?"],
  Daily: [
    "What did I do today that mattered?",
    "What did I learn today about work, others, and/or myself?",
    "What is one small adjustment I want to make tomorrow?",
  ],
  New: "New Note",
};

export const mentorPreLabels = [
  "What do I want to meaningfully practice or strengthen in myself as a mentor during this meeting?",
  "What tendency of mine should I be mindful of in this conversation?",
  "How can I guide this conversation in a way that builds the mentee's independent thinking not reliance on me?",
  "What would 'showing up well' as a mentor look like in this meeting, regardless of the outcome?",
];

export const defaultFormatting: Formatting = {
  bold: false,
  italic: false,
  underline: false,
  fontSize: 16,
  fontColor: "#000000",
};

export const fontColors = [
  "#000000",
  "#000000",
  "#e373bd",
  "#cfc2eb",
  "#FB8C00",
  "#8E24AA",
];

export const viewMenuModes: { key: ViewMode; label: string }[] = [
  { key: "list", label: "List" },
  { key: "folder", label: "Folders" },
  { key: "timeline", label: "Timeline" },
  { key: "favorites", label: "Favorites" },
  { key: "graph", label: "Graph" },
];
