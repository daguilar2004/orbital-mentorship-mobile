import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* STORAGE */
const NOTES_KEY = "NOTES_STORAGE";

/* CATEGORY COLORS */
const categoryColors: Record<string, string> = {
  Pre: "#4CAF50",
  During: "#2196F3",
  Post: "#FF9800",
  Daily: "#9C27B0",
  New: "#607D8B",
};

const options = ["Pre", "During", "Post", "Daily", "New"];

/* LABELS (CHANGE HERE ONLY) */
const defaultLabels = {
  Pre: "What is one specific thing I want clarity on?",
  During: "During Note",
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
    fontWeight: format.bold ? "bold" : "normal",
    fontStyle: format.italic ? "italic" : "normal",
    textDecorationLine: format.underline ? "underline" : "none",
    fontSize: format.fontSize,
    color: format.fontColor,
  };
}

type Note = {
  id: string;
  type: string;
  title: string;
  text: string | string[];
  formatting?: Formatting;
};

export default function Notes() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [text, setText] = useState("");
  const [multiText, setMultiText] = useState(["", "", ""]);
  const [fmt, setFmt] = useState(defaultFormatting);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedNotes = await AsyncStorage.getItem(NOTES_KEY);
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        formatting: note.formatting ?? defaultFormatting,
      }));
      setNotes(parsed);
    }
  };

  const saveNotes = async (updated: Note[]) => {
    setNotes(updated);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  };

  /* FIXED handleSave to properly save multiText */
  const handleSave = () => {
    if (!noteTitle.trim()) return;

    let noteContent: string | string[] = text;

    if (selectedType === "Post" || selectedType === "Daily") {
      if (multiText.every((t) => !t.trim())) return;
      noteContent = multiText;
    } else {
      if (!text.trim()) return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      type: selectedType!,
      title: noteTitle,
      text: noteContent,
      formatting: fmt,
    };

    saveNotes([newNote, ...notes]);

    setText("");
    setMultiText(["", "", ""]);
    setNoteTitle("");
    setSelectedType(null);
    setFmt(defaultFormatting);
  };

  /* Filter notes based on search and active filter */
  const filteredNotes = notes.filter((n) => {
  const searchLower = search.toLowerCase();

  // Safe title check
  const titleText = n.title ?? "";
  const matchesTitle = titleText.toLowerCase().includes(searchLower);

  // Safe text check
  let matchesText = false;
  if (Array.isArray(n.text)) {
    matchesText = n.text.some(
      (t) => (t ?? "").toLowerCase().includes(searchLower)
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

  return (
    <View style={styles.container}>
      {/* SEARCH + FILTER BAR */}
      <View style={styles.topBar}>
        <TextInput
          placeholder="Search notes..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() =>
                setActiveFilter(activeFilter === opt ? null : opt)
              }
              style={[
                styles.filterBtn,
                activeFilter === opt && { backgroundColor: categoryColors[opt] },
              ]}
            >
              <Text
                style={{
                  color: activeFilter === opt ? "white" : "#333",
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* NOTES LIST */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {options.map((category) =>
          groupedNotes[category]?.length ? (
            <View key={category} style={{ marginBottom: 25 }}>
              <Text style={[styles.groupTitle, { color: categoryColors[category] }]}>
                {category}
              </Text>

              {groupedNotes[category].map((item) => (
                <View
                  key={item.id}
                  style={[styles.noteCard, { borderLeftColor: categoryColors[category] }]}
                >
                  <Text style={styles.noteTitle}>{item.title}</Text>

                  {Array.isArray(item.text)
                    ? item.text.map((section, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                          <Text style={styles.sectionLabel}>
                            {(defaultLabels as any)[category][index]}
                          </Text>
                          <Text style={noteTextStyle(item.formatting)}>{section}</Text>
                        </View>
                      ))
                    : (
                      <>
                        <Text style={styles.sectionLabel}>
                          {(defaultLabels as any)[category]}
                        </Text>
                        <Text style={noteTextStyle(item.formatting)}>{item.text}</Text>
                      </>
                    )}
                </View>
              ))}
            </View>
          ) : null
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.bottomSheet}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  setSelectedType(option);
                  setModalVisible(false);
                }}
              >
                <Text style={{ fontSize: 18, color: categoryColors[option] }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* FULL SCREEN EDITOR */}
      {selectedType && (
        <View style={styles.fullScreenEditor}>
          <ScrollView>
            {/* TITLE */}
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
                style={[styles.toolbarBtn, fmt.italic && styles.toolbarBtnActive]}
                onPress={() => setFmt((f) => ({ ...f, italic: !f.italic }))}
              >
                <Text style={{ fontStyle: "italic" }}>I</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toolbarBtn, fmt.underline && styles.toolbarBtnActive]}
                onPress={() => setFmt((f) => ({ ...f, underline: !f.underline }))}
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
                  setFmt((f) => ({ ...f, fontSize: Math.min(32, f.fontSize + 2) }))
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
            {(selectedType === "Daily") ? (
              multiText.map((value, index) => (
                <View key={index}>
                  <Text style={styles.sectionLabel}>
                    {(defaultLabels as any)[selectedType][index]}
                  </Text>
                  <TextInput
                    style={[styles.input, noteTextStyle(fmt)]}
                    multiline
                    value={value}
                    onChangeText={(textValue) => {
                      const updated = [...multiText];
                      updated[index] = textValue;
                      setMultiText(updated);
                    }}
                  />
                </View>
              ))
            ) : (
              <>
                <Text style={styles.sectionLabel}>
                  {(defaultLabels as any)[selectedType]}
                </Text>
                <TextInput
                  style={[styles.input, noteTextStyle(fmt)]}
                  multiline
                  value={text}
                  onChangeText={setText}
                />
              </>
            )}

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: categoryColors[selectedType] }]}
              onPress={handleSave}
            >
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedType(null)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  topBar: { marginBottom: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  groupTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  noteCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 6,
  },
  noteTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  sectionLabel: { fontWeight: "bold", marginBottom: 4 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#000",
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { color: "white", fontSize: 34 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  option: { paddingVertical: 15 },
  fullScreenEditor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "bold",
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  toolbar: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  toolbarBtn: { padding: 6, borderWidth: 1, borderColor: "#ccc", borderRadius: 6 },
  toolbarBtnActive: { backgroundColor: "#ddd" },
  colorSwatch: { width: 26, height: 26, borderRadius: 13, marginRight: 8 },
  colorSwatchActive: { borderWidth: 2, borderColor: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  saveButton: { padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  cancelButton: { alignItems: "center", padding: 10 },
});