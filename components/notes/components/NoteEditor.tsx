import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { categoryColors, fontColors } from "../constants";
import { Formatting, Note } from "../types";
import { noteTextStyle } from "../utils";

type Props = {
  selectedType: string;
  editingNote: Note | null;
  noteTitle: string;
  onTitleChange: (v: string) => void;
  text: string;
  onTextChange: (v: string) => void;
  multiText: string[];
  onMultiTextChange: (texts: string[]) => void;
  fmt: Formatting;
  onFmtChange: (fmt: Formatting) => void;
  onSave: () => void;
  onCancel: () => void;
  getLabels: (type: string | null) => any;
};

export default function NoteEditor({
  selectedType,
  noteTitle,
  onTitleChange,
  text,
  onTextChange,
  multiText,
  onMultiTextChange,
  fmt,
  onFmtChange,
  onSave,
  onCancel,
  getLabels,
}: Props) {
  const labels = getLabels(selectedType);

  return (
    <View style={styles.fullScreenEditor}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter Title..."
          value={noteTitle}
          onChangeText={onTitleChange}
        />

        {/* Formatting toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.toolbarBtn, fmt.bold && styles.toolbarBtnActive]}
            onPress={() => onFmtChange({ ...fmt, bold: !fmt.bold })}
          >
            <Text style={{ fontWeight: "bold" }}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolbarBtn, fmt.italic && styles.toolbarBtnActive]}
            onPress={() => onFmtChange({ ...fmt, italic: !fmt.italic })}
          >
            <Text style={{ fontStyle: "italic" }}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolbarBtn, fmt.underline && styles.toolbarBtnActive]}
            onPress={() => onFmtChange({ ...fmt, underline: !fmt.underline })}
          >
            <Text style={{ textDecorationLine: "underline" }}>U</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={() => onFmtChange({ ...fmt, fontSize: Math.max(10, fmt.fontSize - 2) })}
          >
            <Text>A-</Text>
          </TouchableOpacity>
          <Text>{fmt.fontSize}</Text>
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={() => onFmtChange({ ...fmt, fontSize: Math.min(32, fmt.fontSize + 2) })}
          >
            <Text>A+</Text>
          </TouchableOpacity>
        </View>

        {/* Color picker */}
        <ScrollView horizontal style={{ marginBottom: 10 }}>
          {fontColors.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => onFmtChange({ ...fmt, fontColor: color })}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                fmt.fontColor === color && styles.colorSwatchActive,
              ]}
            />
          ))}
        </ScrollView>

        {/* Text inputs */}
        {Array.isArray(labels) ? (
          labels.map((label: string, index: number) => (
            <View key={index}>
              <Text style={styles.sectionLabel}>{label}</Text>
              <TextInput
                style={[styles.input, noteTextStyle(fmt)]}
                multiline
                value={multiText[index] || ""}
                onChangeText={(v) => {
                  const updated = [...multiText];
                  updated[index] = v;
                  onMultiTextChange(updated);
                }}
              />
            </View>
          ))
        ) : (
          <>
            <Text style={styles.sectionLabel}>{labels}</Text>
            <TextInput
              style={[styles.input, noteTextStyle(fmt)]}
              multiline
              value={text}
              onChangeText={onTextChange}
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: categoryColors[selectedType] }]}
          onPress={onSave}
        >
          <Text style={{ color: "white" }}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  toolbar: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10, flexWrap: "wrap" },
  toolbarBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  toolbarBtnActive: { backgroundColor: "#E5E7EB" },
  colorSwatch: { width: 26, height: 26, borderRadius: 13, marginRight: 8 },
  colorSwatchActive: { borderWidth: 2, borderColor: "#000" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#667085",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
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
  saveButton: { padding: 14, borderRadius: 16, alignItems: "center", marginBottom: 15 },
  cancelButton: { alignItems: "center", padding: 10 },
});
