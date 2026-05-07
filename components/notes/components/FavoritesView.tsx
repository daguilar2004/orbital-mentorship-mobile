import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categoryColors, displayLabels } from "../constants";
import { Note } from "../types";
import HeartButton from "./HeartButton";

type Props = {
  notes: Note[];
  onOpenNote: (note: Note) => void;
  onToggleFavorite: (id: string) => void;
  onExport: (note: Note) => void;
  onDelete: (id: string) => void;
  getLabels: (type: string | null) => any;
};

export default function FavoritesView({ notes, onOpenNote, onToggleFavorite }: Props) {
  const favNotes = notes
    .filter((n) => n.favorite)
    .sort((a, b) => {
      const ta = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : (a.createdAt ?? Number(a.id) ?? 0);
      const tb = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : (b.createdAt ?? Number(b.id) ?? 0);
      return (tb as number) - (ta as number);
    });

  if (favNotes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.heart}>♥</Text>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptySubtitle}>Tap the heart on any note to add it here</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.count}>{favNotes.length} favorited notes</Text>
      {favNotes.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onOpenNote(item)}
          style={[styles.card, { borderLeftColor: categoryColors[item.type] ?? "#999" }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: categoryColors[item.type] + "22" }]}>
              <Text style={[styles.badgeText, { color: categoryColors[item.type] }]}>
                {displayLabels[item.type] ?? item.type}
              </Text>
            </View>
            <HeartButton
              selected={!!item.favorite}
              onPress={() => onToggleFavorite(item._id || item.id || "")}
            />
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.preview} numberOfLines={3}>
            {Array.isArray(item.text) ? item.text.find((t) => t.trim()) : item.text}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 80, gap: 8 },
  heart: { fontSize: 48, color: "#ff3b89" },
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  title: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 4 },
  preview: { fontSize: 13, color: "#667085", lineHeight: 20 },
});
