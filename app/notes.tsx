import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTES_KEY = "NOTES_STORAGE";
const LABELS_KEY = "PROMPT_LABELS";

const categoryColors = {
  Pre: "#4CAF50",
  During: "#2196F3",
  Post: "#FF9800",
  Daily: "#9C27B0",
  New: "#607D8B",
};

const defaultLabels = {
  Pre: "What is one specific thing I want clarity on by the end of this meeting?",
  During: "During Note",
  Post: "What did I learn or realize during this session?\n(New perspectives, reframes, clarity moments, or corrections to previous thinking.)",
  Daily: "1. What did I do today that mattered?",
  New: "New Note",
};

export default function Notes() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [labels, setLabels] = useState(defaultLabels);

  const options = ["Pre", "During", "Post", "Daily", "New"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedNotes = await AsyncStorage.getItem(NOTES_KEY);
    const savedLabels = await AsyncStorage.getItem(LABELS_KEY);

    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedLabels) setLabels(JSON.parse(savedLabels));
  };

  const saveNotes = async (updated) => {
    setNotes(updated);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  };

  const saveLabels = async (updated) => {
    setLabels(updated);
    await AsyncStorage.setItem(LABELS_KEY, JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!text.trim()) return;

    const today = new Date();
    const dateTitle = today.toLocaleDateString() + " " + today.toLocaleTimeString();

    const newEntry = {
      id: Date.now().toString(),
      type: selectedType,
      title: dateTitle,
      text,
    };

    saveNotes([newEntry, ...notes]);
    setText("");
    setSelectedType(null);
  };

  const groupedNotes = options.reduce((acc, category) => {
    acc[category] = notes.filter((n) => n.type === category);
    return acc;
  }, {});


  return (
  <View style={styles.container}>
    <Text style={styles.title}>Notes</Text>

    <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
      {options.map((category) =>
        groupedNotes[category]?.length ? (
          <View key={category} style={{ marginBottom: 25 }}>
            <Text
              style={[
                styles.groupTitle,
                { color: categoryColors[category] },
              ]}
            >
              {labels[category]}
            </Text>

            {groupedNotes[category].map((item) => (
              <View
                key={item.id}
                style={[
                  styles.noteCard,
                  { borderLeftColor: categoryColors[category] },
                ]}
              >
                <Text style={styles.noteDate}>{item.title}</Text>
                <Text>{item.text}</Text>
              </View>
            ))}
          </View>
        ) : null
      )}
    </ScrollView>

    {/* Floating Button */}
    <TouchableOpacity
      style={styles.fab}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>

    {/* Bottom Sheet */}
    <Modal transparent visible={modalVisible} animationType="slide">
      <Pressable
        style={styles.overlay}
        onPress={() => setModalVisible(false)}
      >
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
              <Text
                style={[
                  styles.optionText,
                  { color: categoryColors[option] },
                ]}
              >
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
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Label displayed like main view, wraps, no scroll */}
      <Text style={[styles.labelInput, { minHeight: undefined }]}>
        {labels[selectedType]}
      </Text>

      {/* Note Text Box below label */}
      <TextInput
        style={styles.input}
        multiline
        placeholder="Type your note..."
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: categoryColors[selectedType] },
        ]}
        onPress={handleSave}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setSelectedType(null)}
      >
        <Text style={{ fontSize: 16 }}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
)}
  </View> // <-- Close main container
)} // <-- Close return

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  groupTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  noteCard: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 6 },
  noteDate: { fontSize: 12, color: "#666", marginBottom: 5 },
  fab: { position: "absolute", bottom: 30, right: 30, backgroundColor: "#000", width: 65, height: 65, borderRadius: 35, justifyContent: "center", alignItems: "center" },
  fabText: { color: "white", fontSize: 34 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  bottomSheet: { backgroundColor: "white", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  option: { paddingVertical: 15 },
  optionText: { fontSize: 18 },
  fullScreenEditor: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "white", paddingTop: 60, paddingHorizontal: 20 },
  labelInput: {fontSize: 20,fontWeight: "bold",marginBottom: 15,color: "#000",lineHeight: 24,},
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, minHeight: 250, textAlignVertical: "top", marginBottom: 20 },
  saveButton: { padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 15 },
  cancelButton: { alignItems: "center", padding: 10 },
});