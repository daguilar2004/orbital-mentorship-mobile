import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "./api/index";
import { MOCK_AUTH_TOKEN, MOCK_USER_ID } from "./config/mockAuth";
import { useApp } from "./context/AppContext"; // App context with userRole

/* API CONFIG */
const AUTH_TOKEN_KEY = "AUTH_TOKEN";

/* CATEGORY COLORS */
const categoryColors: Record<string, string> = {
  Pre: "#4CAF50",
  During: "#2196F3",
  Post: "#FF9800",
  Daily: "#9C27B0",
  New: "#607D8B",
};

const options = ["Pre", "During", "Post", "Daily", "New"];
const displayLabels: Record<string, string> = {
  Pre: "Pre-Session",
  During: "In Session",
  Post: "Post-Session",
  Daily: "Daily Reflection",
  New: "+ New Note",
};

/* DEFAULT LABELS */
const defaultLabels = {
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

/* FORMATTING */
type Formatting = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  fontColor: string;
};

const defaultFormatting: Formatting = {
  bold: false,
  italic: false,
  underline: false,
  fontSize: 16,
  fontColor: "#000000",
};

const fontColors = [
  "#000000",
  "#E53935",
  "#1E88E5",
  "#43A047",
  "#FB8C00",
  "#8E24AA",
];

function noteTextStyle(f?: Formatting) {
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

async function getHeadersWithAuth() {
  // TODO: Replace with real token from AsyncStorage when login is implemented
  const token = MOCK_AUTH_TOKEN;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

type Note = {
  _id?: string;
  id?: string;
  userId?: string;
  type: string;
  title: string;
  text: string | string[];
  formatting?: Formatting;
  createdAt?: string | number;
  updatedAt?: string | number;
  favorite?: boolean;
};

/* VIEW MODES */
type ViewMode = "list" | "folder" | "timeline" | "favorites" | "graph";
type SortMode = "default" | "az" | "za" | "favorites";

const viewMenuModes: {
  key: ViewMode;
  label: string;
}[] = [
  { key: "list", label: "List" },
  { key: "folder", label: "Folders" },
  { key: "timeline", label: "Timeline" },
  { key: "favorites", label: "Favorites" },
  { key: "graph", label: "Graph" },
];

const sortMenuModes: {
  key: Exclude<SortMode, "default">;
  label: string;
}[] = [
  { key: "az", label: "A-Z" },
  { key: "za", label: "Z-A" },
  { key: "favorites", label: "Favorites" },
];

/* ── GRAPH HELPERS ─────────────────────────────────────── */
const CANVAS_W = 440;
const CANVAS_H = 540;
const CX = CANVAS_W / 2;
const CY = CANVAS_H / 2 - 20;
const HUB_R = 140; // hub orbit radius from canvas center
const NOTE_R = 72; // note orbit radius from hub center
const HUB_NODE_R = 26; // visual radius of hub circle
const NOTE_NODE_R = 18; // visual radius of note circle

// Pentagon positions for 5 category hubs
const hubAngles: Record<string, number> = {
  Pre: -Math.PI / 2,                 // top
  During: -Math.PI / 2 + (2 * Math.PI) / 5,
  Post: -Math.PI / 2 + (4 * Math.PI) / 5,
  Daily: -Math.PI / 2 + (6 * Math.PI) / 5,
  New: -Math.PI / 2 + (8 * Math.PI) / 5,
};

function hubPos(cat: string) {
  const a = hubAngles[cat] ?? 0;
  return { x: CX + HUB_R * Math.cos(a), y: CY + HUB_R * Math.sin(a) };
}

function notePos(hubX: number, hubY: number, i: number, n: number) {
  const angle = (i / Math.max(n, 1)) * 2 * Math.PI - Math.PI / 2;
  return {
    x: hubX + NOTE_R * Math.cos(angle),
    y: hubY + NOTE_R * Math.sin(angle),
  };
}

function GraphLine({
  x1, y1, x2, y2, color,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: midX - length / 2,
        top: midY - 0.75,
        width: length,
        height: 1.5,
        backgroundColor: color + "55",
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

/* ── GRAPH VIEW ─────────────────────────────────────────── */
function GraphView({
  notes,
  onOpenNote,
}: {
  notes: Note[];
  onOpenNote: (note: Note) => void;
}) {
  const [expandedHub, setExpandedHub] = useState<string | null>(null);

  const notesByCategory: Record<string, Note[]> = {};
  options.forEach((cat) => {
    notesByCategory[cat] = notes.filter((n) => n.type === cat);
  });

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ minWidth: CANVAS_W }}
      showsHorizontalScrollIndicator={false}
    >
      <ScrollView contentContainerStyle={{ minHeight: CANVAS_H }}>
        <View style={{ width: CANVAS_W, height: CANVAS_H }}>
          {/* Hub-to-note lines */}
          {options.map((cat) => {
            const hub = hubPos(cat);
            const catNotes = notesByCategory[cat];
            const showing = expandedHub === null || expandedHub === cat;
            if (!showing || catNotes.length === 0) return null;
            return catNotes.map((n, i) => {
              const np = notePos(hub.x, hub.y, i, catNotes.length);
              return (
                <GraphLine
                  key={n.id}
                  x1={hub.x}
                  y1={hub.y}
                  x2={np.x}
                  y2={np.y}
                  color={categoryColors[cat]}
                />
              );
            });
          })}

          {/* Hub-to-hub connecting ring (decorative) */}
          {options.map((cat, ci) => {
            const hub = hubPos(cat);
            const nextCat = options[(ci + 1) % options.length];
            const nextHub = hubPos(nextCat);
            return (
              <GraphLine
                key={`ring-${cat}`}
                x1={hub.x}
                y1={hub.y}
                x2={nextHub.x}
                y2={nextHub.y}
                color="#ccc"
              />
            );
          })}

          {/* Note nodes */}
          {options.map((cat) => {
            const hub = hubPos(cat);
            const catNotes = notesByCategory[cat];
            const showing = expandedHub === null || expandedHub === cat;
            if (!showing || catNotes.length === 0) return null;
            return catNotes.map((n, i) => {
              const np = notePos(hub.x, hub.y, i, catNotes.length);
              const preview =
                typeof n.text === "string"
                  ? n.text.slice(0, 24)
                  : n.text[0]?.slice(0, 24) ?? "";
              return (
                <TouchableOpacity
                  key={n.id}
                  onPress={() => onOpenNote(n)}
                  style={{
                    position: "absolute",
                    left: np.x - NOTE_NODE_R,
                    top: np.y - NOTE_NODE_R,
                    width: NOTE_NODE_R * 2,
                    height: NOTE_NODE_R * 2,
                    borderRadius: NOTE_NODE_R,
                    backgroundColor: categoryColors[cat] + "22",
                    borderWidth: 1.5,
                    borderColor: categoryColors[cat],
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 8, color: categoryColors[cat], textAlign: "center" }}
                    numberOfLines={2}
                  >
                    {n.favorite ? "★ " : ""}
                    {preview || n.title}
                  </Text>
                </TouchableOpacity>
              );
            });
          })}

          {/* Hub nodes (drawn on top) */}
          {options.map((cat) => {
            const hub = hubPos(cat);
            const count = notesByCategory[cat].length;
            const isExpanded = expandedHub === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() =>
                  setExpandedHub((prev) => (prev === cat ? null : cat))
                }
                style={{
                  position: "absolute",
                  left: hub.x - HUB_NODE_R,
                  top: hub.y - HUB_NODE_R,
                  width: HUB_NODE_R * 2,
                  height: HUB_NODE_R * 2,
                  borderRadius: HUB_NODE_R,
                  backgroundColor: isExpanded
                    ? categoryColors[cat]
                    : categoryColors[cat] + "33",
                  borderWidth: 2,
                  borderColor: categoryColors[cat],
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: isExpanded ? "#fff" : categoryColors[cat],
                    textAlign: "center",
                  }}
                >
                  {cat}
                  {"\n"}
                  <Text style={{ fontSize: 9, fontWeight: "normal" }}>
                    {count} {count === 1 ? "note" : "notes"}
                  </Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={graphStyles.hint}>
          Tap a category to highlight its notes · Tap a note to open it
        </Text>
      </ScrollView>
    </ScrollView>
  );
}

const graphStyles = StyleSheet.create({
  hint: {
    textAlign: "center",
    color: "#667085",
    fontSize: 11,
    marginTop: 12,
    marginBottom: 20,
  },
});

/* ── TIMELINE VIEW ──────────────────────────────────────── */
function TimelineView({
  notes,
  onOpenNote,
  getLabels,
}: {
  notes: Note[];
  onOpenNote: (note: Note) => void;
  getLabels: (type: string | null) => any;
}) {
  const sorted = [...notes].sort((a, b) => {
    const ta = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : (a.createdAt ?? Number(a.id) ?? 0);
    const tb = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : (b.createdAt ?? Number(b.id) ?? 0);
    return (tb as number) - (ta as number);
  });

  const groups: { dateKey: string; notes: Note[] }[] = [];
  sorted.forEach((n) => {
    const ts = n.createdAt ?? (Number(n.id) ? Number(n.id) : Date.now());
    const dateKey = new Date(ts).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const existing = groups.find((g) => g.dateKey === dateKey);
    if (existing) existing.notes.push(n);
    else groups.push({ dateKey, notes: [n] });
  });

  if (groups.length === 0) {
    return (
      <View style={tlStyles.empty}>
        <Text style={tlStyles.emptyText}>No notes yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      {groups.map((group, gi) => (
        <View key={group.dateKey} style={tlStyles.group}>
          {/* Date marker */}
          <View style={tlStyles.dateRow}>
            <View style={tlStyles.dateDot} />
            <Text style={tlStyles.dateLabel}>{group.dateKey}</Text>
          </View>

          {/* Notes under this date */}
          {group.notes.map((item) => (
            <View key={item.id} style={tlStyles.noteRow}>
              {/* Timeline rail */}
              <View style={tlStyles.rail}>
                <View style={tlStyles.railLine} />
                <View
                  style={[
                    tlStyles.railDot,
                    { backgroundColor: categoryColors[item.type] ?? "#999" },
                  ]}
                />
              </View>

              {/* Card */}
              <TouchableOpacity
                onPress={() => onOpenNote(item)}
                style={[
                  tlStyles.card,
                  { borderLeftColor: categoryColors[item.type] ?? "#999" },
                ]}
              >
                <View style={tlStyles.cardHeader}>
                  <View
                    style={[
                      tlStyles.typeBadge,
                      { backgroundColor: categoryColors[item.type] + "22" },
                    ]}
                  >
                    <Text
                      style={[
                        tlStyles.typeBadgeText,
                        { color: categoryColors[item.type] },
                      ]}
                    >
                      {displayLabels[item.type] ?? item.type}
                    </Text>
                  </View>
                  {item.favorite && (
                    <Text style={{ color: "#FB8C00", fontSize: 14 }}>★</Text>
                  )}
                </View>
                <Text style={tlStyles.noteTitle}>{item.title}</Text>
                <Text style={tlStyles.notePreview} numberOfLines={2}>
                  {Array.isArray(item.text)
                    ? item.text.find((t) => t.trim())
                    : item.text}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Bottom rail continuation */}
          {gi < groups.length - 1 && (
            <View style={tlStyles.groupConnector} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const tlStyles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { color: "#98A2B3", fontSize: 16 },
  group: { marginBottom: 6 },
  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dateDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#111827",
    marginRight: 10,
  },
  dateLabel: { fontSize: 13, fontWeight: "600", color: "#111827" },
  noteRow: { flexDirection: "row", marginBottom: 8 },
  rail: { width: 32, alignItems: "center", paddingTop: 4 },
  railLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 15,
    width: 2,
    backgroundColor: "#e5e7eb",
  },
  railDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    zIndex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#EAECF0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  typeBadgeText: { fontSize: 11, fontWeight: "600" },
  noteTitle: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 4 },
  notePreview: { fontSize: 12, color: "#667085", lineHeight: 18 },
  groupConnector: {
    width: 2,
    height: 12,
    backgroundColor: "#e5e7eb",
    marginLeft: 15,
  },
});

/* ── FAVORITES VIEW ─────────────────────────────────────── */
function FavoritesView({
  notes,
  onOpenNote,
  onToggleFavorite,
  onExport,
  onDelete,
  getLabels,
}: {
  notes: Note[];
  onOpenNote: (note: Note) => void;
  onToggleFavorite: (id: string) => void;
  onExport: (note: Note) => void;
  onDelete: (id: string) => void;
  getLabels: (type: string | null) => any;
}) {
  const favNotes = notes
    .filter((n) => n.favorite)
    .sort((a, b) => {
      const ta = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : (a.createdAt ?? Number(a.id) ?? 0);
      const tb = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : (b.createdAt ?? Number(b.id) ?? 0);
      return (tb as number) - (ta as number);
    });

  if (favNotes.length === 0) {
    return (
      <View style={favStyles.empty}>
        <Text style={favStyles.star}>★</Text>
        <Text style={favStyles.emptyTitle}>No favorites yet</Text>
        <Text style={favStyles.emptySubtitle}>
          Tap ☆ on any note to add it here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={favStyles.count}>{favNotes.length} favorited notes</Text>
      {favNotes.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onOpenNote(item)}
          style={[
            favStyles.card,
            { borderLeftColor: categoryColors[item.type] ?? "#999" },
          ]}
        >
          <View style={favStyles.cardHeader}>
            <View
              style={[
                favStyles.badge,
                { backgroundColor: categoryColors[item.type] + "22" },
              ]}
            >
              <Text
                style={[favStyles.badgeText, { color: categoryColors[item.type] }]}
              >
                {displayLabels[item.type] ?? item.type}
              </Text>
            </View>
    <TouchableOpacity
              onPress={() => onToggleFavorite(item._id || item.id || "")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: "#FB8C00", fontSize: 20 }}>★</Text>
            </TouchableOpacity>
          </View>

          <Text style={favStyles.title}>{item.title}</Text>
          <Text style={favStyles.preview} numberOfLines={3}>
            {Array.isArray(item.text)
              ? item.text.find((t) => t.trim())
              : item.text}
          </Text>

          <View style={favStyles.actions}>
            <TouchableOpacity onPress={() => onExport(item)}>
              <Text style={styles.noteActionExport}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onOpenNote(item)}>
              <Text style={{ color: "#1E88E5", fontSize: 13 }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item._id || item.id || "")}>
              <Text style={{ color: "#E53935", fontSize: 13 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const favStyles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 8,
  },
  star: { fontSize: 48, color: "#FB8C00" },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  emptySubtitle: { fontSize: 14, color: "#98A2B3" },
  count: { fontSize: 13, color: "#667085", marginBottom: 12 },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: "#EAECF0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  title: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 4 },
  preview: { fontSize: 13, color: "#667085", lineHeight: 20 },
  actions: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "flex-end",
    marginTop: 10,
  },
});

/* ═══════════════════════════════════════════════════════════
   MAIN NOTES SCREEN
═══════════════════════════════════════════════════════════ */
export default function Notes() {
  const { userRole } = useApp(); // mentor or mentee
  // TODO: Replace MOCK_USER_ID with real user._id when login is implemented
  const userId = MOCK_USER_ID;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [text, setText] = useState("");
  const [multiText, setMultiText] = useState<string[]>([]);
  const [fmt, setFmt] = useState(defaultFormatting);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [insightsMenuOpen, setInsightsMenuOpen] = useState(false);

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteOne = async (id: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const headers = await getHeadersWithAuth();
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Failed to delete note (${response.status} ${response.statusText})${errorText ? `: ${errorText}` : ""}`
        );
      }
      
      const updated = notes.filter((n) => getNoteId(n) !== id);
      setNotes(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
      Alert.alert("Error", "Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

 const toggleSelectNote = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const headers = await getHeadersWithAuth();
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`${API_BASE_URL}/notes/${id}`, { 
          method: "DELETE",
          headers,
        })
      );
      
      await Promise.all(deletePromises);
      
      const updated = notes.filter((n) => !selectedIds.has(getNoteId(n)));
      setNotes(updated);
      setSelectedIds(new Set());
      setSelectMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete notes");
      Alert.alert("Error", "Failed to delete selected notes");
    } finally {
      setLoading(false);
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const getNoteId = (note: Note) => note._id || note.id || "";

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setSelectedType(note.type);
    setNoteTitle(note.title);
    setFmt(note.formatting ?? defaultFormatting);
    if (Array.isArray(note.text)) {
      const padded = [...note.text];
      while (padded.length < 3) padded.push("");
      setMultiText(padded);
      setText("");
    } else {
      setText(note.text);
      setMultiText(["", "", ""]);
    }
  };

  const closeEditor = () => {
    setSelectedType(null);
    setEditingNote(null);
    setText("");
    setMultiText(["", "", ""]);
    setNoteTitle("");
    setFmt(defaultFormatting);
  };

  const formatDateKey = (createdAt?: string | number, id?: string) => {
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
  };

  /* ── STORAGE ──────────────────────────────────────────── */
  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeadersWithAuth();
      const response = await fetch(`${API_BASE_URL}/notes/${userId}`, {
        method: "GET",
        headers,
      });
      
      if (!response.ok) throw new Error("Failed to load notes");
      
      const data = await response.json();
      const parsed = data.map((note: any) => ({
        ...note,
        id: note._id,
        formatting: note.formatting ?? defaultFormatting,
      }));
      setNotes(parsed);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load notes";
      setError(errorMsg);
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async (noteData: Note, action: "create" | "update") => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeadersWithAuth();
      const payload = {
        type: noteData.type,
        title: noteData.title,
        text: noteData.text,
        formatting: noteData.formatting,
      };

      let response;
      if (action === "create") {
        response = await fetch(`${API_BASE_URL}/notes/${userId}`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        const noteId = getNoteId(noteData);
        response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Failed to ${action} note (${response.status} ${response.statusText})${errorText ? `: ${errorText}` : ""}`
        );
      }

      const savedNote = await response.json();
      await loadData();
      
      return savedNote;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : `Failed to ${action} note`;
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
      console.error(`Failed to ${action} note:`, err);
    } finally {
      setLoading(false);
    }
  };

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\n/g, "<br>");
  };

  useEffect(() => {
    const onBackPress = () => {
      if (selectedType) {
        closeEditor();
        return true;
      }

      if (modalVisible) {
        setModalVisible(false);
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => subscription.remove();
  }, [selectedType, modalVisible]);

  const sharePdf = async (uri: string, dialogTitle: string) => {
    if (!(await Sharing.isAvailableAsync())) {
      console.warn("Sharing is not available on this device.");
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle,
    });
  };

  const exportNoteToPDF = async (note: Note) => {
    const htmlContent = generateNoteHTML(note);
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await sharePdf(uri, "Share Note PDF");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const exportSelectedNotesToPDF = async () => {
    const selectedNotes = notes.filter((n) => selectedIds.has(getNoteId(n)));
    if (selectedNotes.length === 0) return;

    const htmlContent = generateMultiPageNoteHTML(selectedNotes);
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await sharePdf(uri, "Share Selected Notes PDF");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generateNoteHTML = (note: Note) => {
    let dateStr = "";
    if (note.createdAt) {
      if (typeof note.createdAt === "string") {
        dateStr = new Date(note.createdAt).toLocaleDateString();
      } else if (typeof note.createdAt === "number") {
        dateStr = new Date(note.createdAt).toLocaleDateString();
      }
    }
    let html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${note.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
              font-weight: bold;
            }
            .type {
              color: #666;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .content {
              margin: 20px 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .section {
              margin-bottom: 15px;
            }
            .section-label {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .date {
              font-size: 12px;
              color: #666;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(note.title)}</h1>
          <div class="type">${escapeHtml(displayLabels[note.type] || note.type)}</div>
    `;

    if (Array.isArray(note.text)) {
      note.text.forEach((section, index) => {
        const label = getLabels(note.type)[index] || '';
        html += `
          <div class="section">
            <div class="section-label">${label}</div>
            <div class="content">${escapeHtml(section)}</div>
          </div>
        `;
      });
    } else {
      const label = getLabels(note.type) || '';
      html += `
        <div class="section">
          <div class="section-label">${label}</div>
          <div class="content">${escapeHtml(note.text)}</div>
        </div>
      `;
    }

    if (dateStr) {
      html += `<div class="date">Created: ${escapeHtml(dateStr)}</div>`;
    }

    html += `
        </body>
      </html>
    `;

    return html;
  };

  const generateMultiPageNoteHTML = (selectedNotes: Note[]) => {
    let html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Selected Notes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .page { page-break-after: always; }
            h1 {
              color: #333;
              margin-bottom: 10px;
              font-weight: bold;
            }
            .type {
              color: #666;
              font-size: 14px;
              margin-bottom: 20px;
            }
            .content {
              margin: 20px 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .section {
              margin-bottom: 15px;
            }
            .section-label {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .date {
              font-size: 12px;
              color: #666;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
    `;

    selectedNotes.forEach((note) => {
      const date = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '';
      html += `<div class="page">`;
      html += `<h1>${note.title}</h1>`;
      html += `<div class="type">${displayLabels[note.type] || note.type}</div>`;

      if (Array.isArray(note.text)) {
        note.text.forEach((section, index) => {
          const label = getLabels(note.type)[index] || '';
          html += `
            <div class="section">
              <div class="section-label">${label}</div>
              <div class="content">${escapeHtml(section)}</div>
            </div>
          `;
        });
      } else {
        const label = getLabels(note.type) || '';
        html += `
          <div class="section">
            <div class="section-label">${label}</div>
            <div class="content">${escapeHtml(note.text)}</div>
          </div>
        `;
      }

      if (date) {
        html += `<div class="date">Created: ${escapeHtml(date)}</div>`;
      }

      html += `</div>`;
    });

    html += `
        </body>
      </html>
    `;

    return html;
  };

  /* ── LABELS ───────────────────────────────────────────── */
  const getLabels = (type: string | null) => {
    if (!type) return [];
    if (type === "Pre") {
      return userRole === "mentor"
        ? [
            "What do I want to meaningfully practice or strengthen in myself as a mentor during this meeting?",
            "What tendency of mine should I be mindful of in this conversation?",
            "How can I guide this conversation in a way that builds the mentee's independent thinking not reliance on me?",
            "What would 'showing up well' as a mentor look like in this meeting, regardless of the outcome?",
          ]
          
        : defaultLabels.Pre;
    }
    return (defaultLabels as any)[type];
  };

  /* SAVE NOTE */
  const handleSave = async () => {
    // If title is empty, use current date
    const finalTitle = noteTitle.trim() || new Date().toLocaleDateString();
    const labels = getLabels(selectedType);
    let noteContent: string | string[] = text;

    if (Array.isArray(labels)) {
      if (multiText.every((t) => !t.trim())) return;
      noteContent = multiText;
    } else {
      if (!text.trim()) return;
      noteContent = text;
    }
    
    if (editingNote) {
      const updatedNote: Note = {
        _id: getNoteId(editingNote),
        type: selectedType!,
        title: finalTitle,
        text: noteContent,
        formatting: fmt,
        createdAt: editingNote.createdAt,
      };
      await saveNotes(updatedNote, "update");
    } else {
      const newNote: Note = {
        type: selectedType!,
        title: finalTitle,
        text: noteContent,
        formatting: fmt,
      };
      await saveNotes(newNote, "create");
    }
    closeEditor();
  };
  

  /* ── FILTER ───────────────────────────────────────────── */
  const filteredNotes = notes.filter((n) => {
    const searchLower = search.toLowerCase();
    const matchesTitle = (n.title ?? "").toLowerCase().includes(searchLower);
    let matchesText = false;
    if (Array.isArray(n.text)) {
      matchesText = n.text.some((t) =>
        (t ?? "").toLowerCase().includes(searchLower)
      );
    } else if (typeof n.text === "string") {
      matchesText = n.text.toLowerCase().includes(searchLower);
    }
    const matchesSearch = matchesTitle || matchesText;
    const matchesFilter = activeFilter ? n.type === activeFilter : true;
    return matchesSearch && matchesFilter;
  });

  const groupedNotes = options.reduce(
    (acc: Record<string, Note[]>, category) => {
      acc[category] = filteredNotes.filter((n) => n.type === category);
      return acc;
    },
    {}
  );

  /* ── SORT AND FILTER LOGIC ──────────────────────────── */
  let visibleNotes = [...filteredNotes];
  if (sortMode === "az") {
    visibleNotes.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
  } else if (sortMode === "za") {
    visibleNotes.sort((a, b) => (b.title ?? "").localeCompare(a.title ?? ""));
  } else if (sortMode === "favorites") {
    visibleNotes = visibleNotes.filter((n) => n.favorite);
  }

  const toggleSortMode = (mode: Exclude<SortMode, "default">) => {
    setSortMode(mode);
  };

  const setActiveView = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const toggleFavorite = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        getNoteId(n) === id ? { ...n, favorite: !n.favorite } : n
      )
    );
  };
  
  if (loading && notes.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={{ marginTop: 10 }}>Loading notes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      {!selectedType && (
        <>
      {/* ── TOP BAR ──────────────────────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.toolbarRow}>
          <View style={styles.searchField}>
            <Text style={styles.searchGlyph}>⌕</Text>
            <TextInput
              placeholder="Search notes"
              placeholderTextColor="#98A2B3"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity
            onPress={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
            style={[styles.headerButton, selectMode && styles.headerButtonActive]}
          >
            <Text
              style={[
                styles.headerButtonText,
                selectMode && styles.headerButtonTextOnDark,
              ]}
            >
              {selectMode ? "Done" : "Select"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dropdownWrap}>
            <TouchableOpacity
              onPress={() => {
                setSortMenuOpen((open) => !open);
                setInsightsMenuOpen(false);
              }}
              style={[
                styles.headerButton,
                styles.sortButton,
                sortMenuOpen && styles.headerButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.sortIcon,
                  sortMenuOpen && styles.headerButtonTextOnDark,
                ]}
              >
                ⇅
              </Text>
            </TouchableOpacity>

            {sortMenuOpen && (
              <View style={styles.dropdownMenu}>
                {sortMenuModes.map((mode) => {
                  const isActive = sortMode === mode.key;
                  return (
                    <TouchableOpacity
                      key={mode.key}
                      onPress={() => toggleSortMode(mode.key)}
                      style={[
                        styles.dropdownItem,
                        isActive && styles.dropdownItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dropdownItemTitle,
                          isActive && styles.dropdownItemTitleActive,
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.dropdownWrap}>
            <TouchableOpacity
              onPress={() => {
                setInsightsMenuOpen((open) => !open);
                setSortMenuOpen(false);
              }}
              style={[
                styles.headerButton,
                styles.dropdownButton,
                insightsMenuOpen && styles.headerButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.headerButtonText,
                  insightsMenuOpen && styles.headerButtonTextOnDark,
                ]}
              >
                Views
              </Text>
              <Text
                style={[
                  styles.dropdownCaret,
                  insightsMenuOpen && styles.headerButtonTextOnDark,
                ]}
              >
                ▾
              </Text>
            </TouchableOpacity>

            {insightsMenuOpen && (
              <View style={styles.dropdownMenu}>
                {viewMenuModes.map((mode) => {
                  const isActive = viewMode === mode.key;
                  return (
                    <TouchableOpacity
                      key={mode.key}
                      onPress={() => setActiveView(mode.key)}
                      style={[
                        styles.dropdownItem,
                        isActive && styles.dropdownItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dropdownItemTitle,
                          isActive && styles.dropdownItemTitleActive,
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Category filter chips – only in list mode */}
        {viewMode === "list" && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() =>
                  setActiveFilter(activeFilter === opt ? null : opt)
                }
                style={[
                  styles.filterBtn,
                  activeFilter === opt && {
                    backgroundColor: categoryColors[opt],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    activeFilter === opt && styles.filterBtnTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.contentShell}>
        {viewMode === "list" ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {visibleNotes.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No notes found</Text>
                <Text style={styles.emptyStateText}>
                  Try a different search or clear the current filter.
                </Text>
              </View>
            ) : (
              options.map((category) =>
                groupedNotes[category]?.length ? (
                  <View key={category} style={styles.groupSection}>
                    <View style={styles.groupHeader}>
                      <View
                        style={[
                          styles.groupAccent,
                          { backgroundColor: categoryColors[category] },
                        ]}
                      />
                      <Text style={styles.groupTitle}>
                        {displayLabels[category] ?? category}
                      </Text>
                      <View
                        style={[
                          styles.groupCount,
                          { backgroundColor: `${categoryColors[category]}18` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.groupCountText,
                            { color: categoryColors[category] },
                          ]}
                        >
                          {groupedNotes[category].length}
                        </Text>
                      </View>
                    </View>

                {groupedNotes[category].map((item) => (
                  <TouchableOpacity
                    key={getNoteId(item)}
                    onPress={() => (selectMode ? toggleSelectNote(getNoteId(item)) : openEditNote(item))}
                    onLongPress={() => {
                      setSelectMode(true);
                      toggleSelectNote(getNoteId(item));
                    }}
                    style={[styles.noteCard, { borderLeftColor: categoryColors[category], flexDirection: "row", alignItems: "flex-start" }]}
                  >
                    {selectMode && (
                      <TouchableOpacity
                        onPress={() => toggleSelectNote(getNoteId(item))}
                        style={[styles.checkbox, selectedIds.has(getNoteId(item)) && styles.checkboxSelected, { marginRight: 12 }]}
                      />
                    )}

                        <View style={{ flex: 1 }}>
                          <View style={styles.noteHeader}>
                            <Text style={styles.noteTitle}>{item.title}</Text>
                            {!selectMode && (
                              <TouchableOpacity
                                onPress={() => toggleFavorite(getNoteId(item))}
                                hitSlop={{
                                  top: 8,
                                  bottom: 8,
                                  left: 8,
                                  right: 8,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 18,
                                    color: item.favorite
                                      ? "#FB8C00"
                                      : "#D0D5DD",
                                  }}
                                >
                                  ★
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>

                          {Array.isArray(item.text) ? (
                            item.text.map((section, index) => (
                              <View key={index} style={styles.noteSection}>
                                <Text style={styles.sectionLabel}>
                                  {getLabels(category)[index]}
                                </Text>
                                <Text style={noteTextStyle(item.formatting)}>
                                  {section}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <>
                              <Text style={styles.sectionLabel}>
                                {getLabels(category)}
                              </Text>
                              <Text style={noteTextStyle(item.formatting)}>
                                {item.text}
                              </Text>
                            </>
                          )}

                      {!selectMode && (
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
                          <TouchableOpacity onPress={() => exportNoteToPDF(item)} style={{ marginRight: 12 }}>
                            <Text style={{ color: "#4CAF50" }}>Export</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => openEditNote(item)} style={{ marginRight: 12 }}>
                            <Text style={{ color: "#1E88E5" }}>Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleDeleteOne(getNoteId(item))}>
                            <Text style={{ color: "#E53935" }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
            )
          )}
        </ScrollView>
        ) : (
          // Folder view IIFE
        (() => {
          const folders: Record<string, Note[]> = {};
          notes.forEach((n) => {
            const key = formatDateKey(n.createdAt, n.id);
            if (!folders[key]) folders[key] = [];
            folders[key].push(n);
          });

            const folderKeys = Object.keys(folders).sort((a, b) => {
              const ta = new Date(a).getTime();
              const tb = new Date(b).getTime();
              return tb - ta;
            });

            if (!openedFolder) {
              return (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  {folderKeys.map((key) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.noteCard, styles.folderCard]}
                      onPress={() => setOpenedFolder(key)}
                    >
                      <Text style={styles.folderTitle}>{key}</Text>
                      <Text style={styles.folderCount}>
                        {folders[key].length} notes
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              );
            }

            const folderNotes = (folders[openedFolder] || []).filter((note) =>
              folderFilter ? note.type === folderFilter : true
            );

            return (
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                  onPress={() => {
                    setOpenedFolder(null);
                    setFolderFilter(null);
                  }}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>‹ Back to folders</Text>
                </TouchableOpacity>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterRow}
                >
                  {options.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() =>
                        setFolderFilter(folderFilter === opt ? null : opt)
                      }
                      style={[
                        styles.filterBtn,
                        folderFilter === opt && {
                          backgroundColor: categoryColors[opt],
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterBtnText,
                          folderFilter === opt && styles.filterBtnTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

              {folderNotes.map((item) => (
                <TouchableOpacity
                  key={getNoteId(item)}
                  onPress={() => (selectMode ? toggleSelectNote(getNoteId(item)) : openEditNote(item))}
                  onLongPress={() => {
                    setSelectMode(true);
                    toggleSelectNote(getNoteId(item));
                  }}
                  style={[
                    styles.noteCard,
                    {
                      borderLeftColor: categoryColors[item.type] ?? "#999",
                      flexDirection: "row",
                      alignItems: "flex-start",
                    },
                  ]}
                >
                  {selectMode && (
                    <TouchableOpacity
                      onPress={() => toggleSelectNote(getNoteId(item))}
                      style={[
                        styles.checkbox,
                        selectedIds.has(getNoteId(item)) && styles.checkboxSelected,
                        { marginRight: 12 },
                      ]}
                    />
                  )}

                      <View style={{ flex: 1 }}>
                        <View style={styles.noteHeader}>
                          <Text style={styles.noteTitle}>{item.title}</Text>
                          {!selectMode && (
                            <TouchableOpacity
                              onPress={() => toggleFavorite(getNoteId(item))}
                              hitSlop={{
                                top: 8,
                                bottom: 8,
                                left: 8,
                                right: 8,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 18,
                                  color: item.favorite
                                    ? "#FB8C00"
                                    : "#D0D5DD",
                                }}
                              >
                                ★
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {Array.isArray(item.text) ? (
                          item.text.map((section, index) => (
                            <View key={index} style={styles.noteSection}>
                              <Text style={styles.sectionLabel}>
                                {getLabels(item.type)?.[index]}
                              </Text>
                              <Text style={noteTextStyle(item.formatting)}>
                                {section}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <>
                            <Text style={styles.sectionLabel}>
                              {getLabels(item.type)}
                            </Text>
                            <Text style={noteTextStyle(item.formatting)}>
                              {item.text}
                            </Text>
                          </>
                        )}

                    {!selectMode && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          marginTop: 8,
                        }}
                      >
                        <TouchableOpacity onPress={() => exportNoteToPDF(item)} style={{ marginRight: 12 }}>
                          <Text style={{ color: "#4CAF50" }}>Export</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => openEditNote(item)}
                          style={{ marginRight: 12 }}
                        >
                          <Text style={{ color: "#1E88E5" }}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleDeleteOne(getNoteId(item))}>
                          <Text style={{ color: "#E53935" }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          );
        })()
        )}
      </View>
      {selectMode && (
        <View style={styles.bulkBar}>
          <Text style={{ color: "white", fontSize: 14 }}>
            {selectedIds.size} selected
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={exportSelectedNotesToPDF}
              disabled={selectedIds.size === 0}
              style={[
                styles.bulkExportBtn,
                selectedIds.size === 0 && { opacity: 0.4 },
              ]}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteSelected}
              disabled={selectedIds.size === 0}
              style={[
                styles.bulkDeleteBtn,
                selectedIds.size === 0 && { opacity: 0.4 },
              ]}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── FAB ──────────────────────────────────────────── */}
      {!selectMode && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
        </>
      )}

      {/* ── NOTE TYPE PICKER (BOTTOM SHEET) ──────────────── */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <Pressable style={styles.overlay1} onPress={() => setModalVisible(false)}>
          <View style={styles.bottomSheet}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  setSelectedType(option);
                  setModalVisible(false);
                  const labels = getLabels(option);
                  if (Array.isArray(labels))
                    setMultiText(new Array(labels.length).fill(""));
                  else setMultiText([]);
                }}
              >
                <Text
                  style={{ fontSize: 18, color: categoryColors[option] }}
                >
                  {displayLabels[option] ?? option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* ── FULL SCREEN EDITOR ───────────────────────────── */}
      {selectedType && (
        <View style={styles.fullScreenEditor}>
          <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter Title..."
              value={noteTitle}
              onChangeText={setNoteTitle}
            />

            {/* TOOLBAR */}
            <View style={styles.toolbar}>
              <TouchableOpacity
                style={[styles.toolbarBtn, fmt.bold && styles.toolbarBtnActive]}
                onPress={() => setFmt((f) => ({ ...f, bold: !f.bold }))}
              >
                <Text style={{ fontWeight: "bold" }}>B</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toolbarBtn,
                  fmt.italic && styles.toolbarBtnActive,
                ]}
                onPress={() => setFmt((f) => ({ ...f, italic: !f.italic }))}
              >
                <Text style={{ fontStyle: "italic" }}>I</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toolbarBtn,
                  fmt.underline && styles.toolbarBtnActive,
                ]}
                onPress={() =>
                  setFmt((f) => ({ ...f, underline: !f.underline }))
                }
              >
                <Text style={{ textDecorationLine: "underline" }}>U</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toolbarBtn}
                onPress={() =>
                  setFmt((f) => ({ ...f, fontSize: Math.max(10, f.fontSize - 2) }))
                }
              >
                <Text>A-</Text>
              </TouchableOpacity>
              <Text>{fmt.fontSize}</Text>
              <TouchableOpacity
                style={styles.toolbarBtn}
                onPress={() =>
                  setFmt((f) => ({
                    ...f,
                    fontSize: Math.min(32, f.fontSize + 2),
                  }))
                }
              >
                <Text>A+</Text>
              </TouchableOpacity>
            </View>

            {/* COLOR PICKER */}
            <ScrollView horizontal>
              {fontColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setFmt((f) => ({ ...f, fontColor: color }))}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    fmt.fontColor === color && styles.colorSwatchActive,
                  ]}
                />
              ))}
            </ScrollView>

            {/* TEXT INPUTS */}
            {Array.isArray(getLabels(selectedType)) ? (
              getLabels(selectedType).map((label: string, index: number) => (
                <View key={index}>
                  <Text style={styles.sectionLabel}>{label}</Text>
                  <TextInput
                    style={[styles.input, noteTextStyle(fmt)]}
                    multiline
                    value={multiText[index] || ""}
                    onChangeText={(v) => {
                      const updated = [...multiText];
                      updated[index] = v;
                      setMultiText(updated);
                    }}
                  />
                </View>
              ))
            ) : (
              <>
                <Text style={styles.sectionLabel}>{getLabels(selectedType)}</Text>
                <TextInput
                  style={[styles.input, noteTextStyle(fmt)]}
                  multiline
                  value={text}
                  onChangeText={setText}
                />
              </>
            )}

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: categoryColors[selectedType] },
              ]}
              onPress={handleSave}
            >
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={closeEditor}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EEF2F6" },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 12 },
  topBar: {
    marginBottom: 12,
    position: "relative",
    zIndex: 4,
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  searchField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  searchGlyph: {
    fontSize: 16,
    color: "#98A2B3",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#101828",
    paddingVertical: 11,
  },
  headerButton: {
    minHeight: 44,
    paddingHorizontal: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  sortButton: {
    minWidth: 44,
    alignItems: "center",
    paddingHorizontal: 0,
  },
  headerButtonActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
  },
  headerButtonTextOnDark: {
    color: "#FFFFFF",
  },
  sortIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#344054",
  },
  dropdownWrap: {
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 82,
  },
  dropdownCaret: {
    fontSize: 12,
    color: "#344054",
    marginLeft: 8,
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    minWidth: 136,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    zIndex: 20,
  },
  dropdownItem: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemActive: {
    backgroundColor: "#F3F4F6",
  },
  dropdownItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#101828",
    marginBottom: 2,
  },
  dropdownItemTitleActive: {
    color: "#111827",
  },
  filterRow: {
    paddingRight: 4,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#344054",
  },
  filterBtnTextActive: {
    color: "#FFFFFF",
  },
  contentShell: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingTop: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  emptyState: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#667085",
    textAlign: "center",
  },
  groupSection: {
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  groupAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  groupTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  groupCount: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  groupCountText: {
    fontSize: 12,
    fontWeight: "700",
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  noteCardSelected: {
    borderColor: "#111827",
    backgroundColor: "#F8FAFC",
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  noteSection: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#667085",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 16,
  },
  noteActionEdit: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "600",
  },
  noteActionExport: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "600",
  },
  noteActionDelete: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
  folderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftColor: "#CBD5E1",
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  folderCount: {
    fontSize: 13,
    color: "#667085",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F2F4F7",
  },
  backButtonText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 22,
    right: 22,
    backgroundColor: "#111827",
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#111827",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  fabText: { color: "white", fontSize: 34 },
  overlay1: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.16)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: "100%",
    elevation: 10,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
  },
  fullScreenEditor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F8FAFC",
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 15,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
    flexWrap: "wrap",
  },
  toolbarBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  toolbarBtnActive: { backgroundColor: "#E5E7EB" },
  colorSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },
  colorSwatchActive: { borderWidth: 2, borderColor: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 16,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  saveButton: {
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  cancelButton: { alignItems: "center", padding: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#E53935",
    borderColor: "#E53935",
  },
  bulkBar: {
    position: "absolute",
    bottom: 14,
    left: 16,
    right: 16,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
  },
  bulkExportBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bulkDeleteBtn: {
    backgroundColor: "#E53935",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
