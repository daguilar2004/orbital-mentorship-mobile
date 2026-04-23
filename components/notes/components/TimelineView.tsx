import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categoryColors, displayLabels } from "../constants";
import { Note } from "../types";
import HeartButton from "./HeartButton";

type Props = {
  notes: Note[];
  onOpenNote: (note: Note) => void;
  onToggleFavorite?: (id: string) => void;
  getLabels: (type: string | null) => any;
};

export default function TimelineView({ notes, onOpenNote, onToggleFavorite }: Props) {
  const sorted = [...notes].sort((a, b) => {
    const ta = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : (a.createdAt ?? Number(a.id) ?? 0);
    const tb = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : (b.createdAt ?? Number(b.id) ?? 0);
    return (tb as number) - (ta as number);
  });

  const groups: { dateKey: string; notes: Note[] }[] = [];
  sorted.forEach((n) => {
    const ts = n.createdAt ?? (Number(n.id) ? Number(n.id) : Date.now());
    const dateKey = new Date(ts).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
    const existing = groups.find((g) => g.dateKey === dateKey);
    if (existing) existing.notes.push(n);
    else groups.push({ dateKey, notes: [n] });
  });

  if (groups.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No notes yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      {groups.map((group, gi) => (
        <View key={group.dateKey} style={styles.group}>
          <View style={styles.dateRow}>
            <View style={styles.dateDot} />
            <Text style={styles.dateLabel}>{group.dateKey}</Text>
          </View>

          {group.notes.map((item) => (
            <View key={item.id} style={styles.noteRow}>
              <View style={styles.rail}>
                <View style={styles.railLine} />
                <View style={[styles.railDot, { backgroundColor: categoryColors[item.type] ?? "#999" }]} />
              </View>

              <TouchableOpacity
                onPress={() => onOpenNote(item)}
                style={[styles.card, { borderLeftColor: categoryColors[item.type] ?? "#999" }]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: categoryColors[item.type] + "22" }]}>
                    <Text style={[styles.typeBadgeText, { color: categoryColors[item.type] }]}>
                      {displayLabels[item.type] ?? item.type}
                    </Text>
                  </View>

                  {onToggleFavorite ? (
                    <HeartButton
                      selected={!!item.favorite}
                      onPress={() => onToggleFavorite(item._id || item.id || "")}
                    />
                  ) : item.favorite ? (
                    <MaterialCommunityIcons name="heart" size={18} color="#ff3b89" />
                  ) : null}
                </View>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.notePreview} numberOfLines={2}>
                  {Array.isArray(item.text) ? item.text.find((t) => t.trim()) : item.text}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {gi < groups.length - 1 && <View style={styles.groupConnector} />}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80 },
  emptyText: { color: "#98A2B3", fontSize: 16 },
  group: { marginBottom: 6 },
  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dateDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#111827", marginRight: 10 },
  dateLabel: { fontSize: 13, fontWeight: "600", color: "#111827" },
  noteRow: { flexDirection: "row", marginBottom: 8 },
  rail: { width: 32, alignItems: "center", paddingTop: 4 },
  railLine: { position: "absolute", top: 0, bottom: 0, left: 15, width: 2, backgroundColor: "#e5e7eb" },
  railDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6, zIndex: 1 },
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
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  typeBadgeText: { fontSize: 11, fontWeight: "600" },
  noteTitle: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 4 },
  notePreview: { fontSize: 12, color: "#667085", lineHeight: 18 },
  groupConnector: { width: 2, height: 12, backgroundColor: "#e5e7eb", marginLeft: 15 },
});
