import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categoryColors } from "../constants";
import { Note } from "../types";
import { getNoteId, noteTextStyle } from "../utils";
import HeartButton from "./HeartButton";

type Props = {
  item: Note;
  category: string;
  selectMode: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onToggleSelect: () => void;
  onToggleFavorite: () => void;
  getLabels: (type: string | null) => any;
};

export default function NoteCard({
  item,
  category,
  selectMode,
  isSelected,
  onPress,
  onLongPress,
  onToggleSelect,
  onToggleFavorite,
  getLabels,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.noteCard,
        { borderLeftColor: categoryColors[category], flexDirection: "row", alignItems: "flex-start" },
      ]}
    >
      {selectMode && (
        <TouchableOpacity
          onPress={onToggleSelect}
          style={[styles.checkbox, isSelected && styles.checkboxSelected, { marginRight: 12 }]}
        />
      )}

      <View style={{ flex: 1 }}>
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle}>{item.title}</Text>
          {!selectMode && (
            <HeartButton selected={!!item.favorite} onPress={onToggleFavorite} />
          )}
        </View>

        {Array.isArray(item.text) ? (
          item.text.map((section, index) => (
            <View key={index} style={styles.noteSection}>
              <Text style={styles.sectionLabel}>{getLabels(category)?.[index]}</Text>
              <Text style={noteTextStyle(item.formatting)}>{section}</Text>
            </View>
          ))
        ) : (
          <>
            <Text style={styles.sectionLabel}>{getLabels(category)}</Text>
            <Text style={noteTextStyle(item.formatting)}>{item.text}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  noteSection: { marginBottom: 10 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#667085",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
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
});
