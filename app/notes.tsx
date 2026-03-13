import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "./context/AppContext"; // App context with userRole
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";


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
    "What decision, next step, or mindset shift would help me most right now?"
  ],
  During: [
    "What would make this session valuable today? What are the one or two things we should focus on? What does success look like by the end of this session?",
    "What has gone well since our last session? What challenges came up? What did you learn from those experiences?",
    "What are some possible ways to move forward? What else could you try? If there were no constraints, what would you do?",
    "Which option feels best right now? What specific action will you take? By when will you complete it? How will you measure progress?",
    "What is your biggest takeaway from today? What are you committing to before next time? When should we check in again?"
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
    textDecorationLine: format.underline ? ("underline" as const) : ("none" as const),
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
  createdAt?: number;
};

export default function Notes() {
  const { userRole } = useApp(); // mentor or mentee

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

  const [folderView, setFolderView] = useState(false);
  const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);

  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleDeleteOne = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
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

  const handleDeleteSelected = () => {
    const updated = notes.filter((n) => !selectedIds.has(n.id));
    saveNotes(updated);
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

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

  const formatDateKey = (createdAt?: number, id?: string) => {
    const ts = createdAt ?? (Number(id) ? Number(id) : undefined);
    if (!ts) return "Unknown";
    return new Date(ts).toLocaleDateString();
  };

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

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>');
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

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [selectedType, modalVisible]);

  const exportNoteToPDF = async (note: Note) => {
    const htmlContent = generateNoteHTML(note);
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Note PDF',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const exportSelectedNotesToPDF = async () => {
    const selectedNotes = notes.filter((n) => selectedIds.has(n.id));
    if (selectedNotes.length === 0) return;

    const htmlContent = generateMultiPageNoteHTML(selectedNotes);
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Selected Notes PDF',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const generateNoteHTML = (note: Note) => {
    const date = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '';
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

    if (date) {
      html += `<div class="date">Created: ${escapeHtml(date)}</div>`;
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

  /* MODE-SENSITIVE LABELS */
  const getLabels = (type: string | null) => {
    if (!type) return [];
    if (type === "Pre") {
      return userRole === "mentor"
        ? [
          "What do I want to meaningfully practice or strengthen in myself as a mentor during this meeting?",
          "What tendency of mine should I be mindful of in this conversation?",
          "How can I guide this conversation in a way that builds the mentee’s independent thinking not reliance on me?",
          "What would “showing up well” as a mentor look like in this meeting, regardless of the outcome?"
        ]
        : defaultLabels.Pre;
    }
    return (defaultLabels as any)[type];
  };

  /* SAVE NOTE */
  const handleSave = () => {
    // If title is empty, use current date
    const finalTitle = noteTitle.trim() || new Date().toLocaleDateString();

    let noteContent: string | string[] = text;
    const labels = getLabels(selectedType);

    if (Array.isArray(labels)) {
      if (multiText.every((t) => !t.trim())) return;
      noteContent = multiText;
    } else {
      if (!text.trim()) return;
      noteContent = text;
    }
    if (editingNote) {
      const updatedNote: Note = {
        id: editingNote.id,
        type: selectedType!,
        title: finalTitle,
        text: noteContent,
        formatting: fmt,
        createdAt: editingNote.createdAt ?? Date.now(),
      };
      const updated = notes.map((n) => (n.id === editingNote.id ? updatedNote : n));
      saveNotes(updated);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        type: selectedType!,
        title: finalTitle,
        text: noteContent,
        formatting: fmt,
        createdAt: Date.now(),
      };
      saveNotes([newNote, ...notes]);
    }

    // Reset editor state
    closeEditor();
  };
  

  /* FILTER NOTES */
  const filteredNotes = notes.filter((n) => {
    const searchLower = search.toLowerCase();
    const titleText = n.title ?? "";
    const matchesTitle = titleText.toLowerCase().includes(searchLower);

    let matchesText = false;
    if (Array.isArray(n.text)) {
      matchesText = n.text.some((t) => (t ?? "").toLowerCase().includes(searchLower));
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <TextInput
            placeholder="Search notes..."
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { flex: 1, marginBottom: 0 }]}
          />
          <TouchableOpacity
            onPress={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
            style={[
              styles.selectBtn,
              selectMode && { backgroundColor: "#E53935" },
            ]}
          >
            <Text style={{ color: selectMode ? "white" : "#333", fontSize: 13 }}>
              {selectMode ? "Cancel" : "Select"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFolderView((v) => {
                const next = !v;
                if (!next) {
                  setOpenedFolder(null);
                  setFolderFilter(null);
                }
                return next;
              });
            }}
            style={[
              styles.selectBtn,
              folderView && { backgroundColor: "#1E88E5" },
            ]}
          >
            <Text style={{ color: folderView ? "white" : "#333", fontSize: 13 }}>
              {folderView ? "Folders (On)" : "Folders"}
            </Text>
          </TouchableOpacity>
        </View>
        {!folderView && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setActiveFilter(activeFilter === opt ? null : opt)}
                style={[
                  styles.filterBtn,
                  activeFilter === opt && { backgroundColor: categoryColors[opt] },
                ]}
              >
                <Text style={{ color: activeFilter === opt ? "white" : "#333" }}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* NOTES LIST OR FOLDER VIEW */}
      {!folderView ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {options.map((category) =>
            groupedNotes[category]?.length ? (
              <View key={category} style={{ marginBottom: 25 }}>
                <Text style={[styles.groupTitle, { color: categoryColors[category] }]}>
                  {displayLabels[category] ?? category}
                </Text>

                {groupedNotes[category].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => (selectMode ? toggleSelectNote(item.id) : openEditNote(item))}
                    onLongPress={() => {
                      setSelectMode(true);
                      toggleSelectNote(item.id);
                    }}
                    style={[styles.noteCard, { borderLeftColor: categoryColors[category], flexDirection: "row", alignItems: "flex-start" }]}
                  >
                    {selectMode && (
                      <TouchableOpacity
                        onPress={() => toggleSelectNote(item.id)}
                        style={[styles.checkbox, selectedIds.has(item.id) && styles.checkboxSelected, { marginRight: 12 }]}
                      />
                    )}

                    <View style={{ flex: 1 }}>
                      <Text style={styles.noteTitle}>{item.title}</Text>

                      {Array.isArray(item.text)
                        ? item.text.map((section, index) => (
                          <View key={index} style={{ marginBottom: 10 }}>
                            <Text style={styles.sectionLabel}>
                              {getLabels(category)[index]}
                            </Text>
                            <Text style={noteTextStyle(item.formatting)}>{section}</Text>
                          </View>
                        ))
                        : (
                          <>
                            <Text style={styles.sectionLabel}>
                              {getLabels(category)}
                            </Text>
                            <Text style={noteTextStyle(item.formatting)}>{item.text}</Text>
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

                          <TouchableOpacity onPress={() => handleDeleteOne(item.id)}>
                            <Text style={{ color: "#E53935" }}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          )}
        </ScrollView>
      ) : (
        // Folder view
        (() => {
          const folders: Record<string, Note[]> = {};
          notes.forEach((n) => {
            const key = formatDateKey(n.createdAt, n.id);
            if (!folders[key]) folders[key] = [];
            folders[key].push(n);
          });

          const folderKeys = Object.keys(folders).sort((a, b) => {
            // sort by newest first using Date parse where possible
            const ta = new Date(a).getTime();
            const tb = new Date(b).getTime();
            return tb - ta;
          });

          if (!openedFolder) {
            return (
              <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                {folderKeys.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.noteCard, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
                    onPress={() => setOpenedFolder(key)}
                  >
                    <Text style={{ fontSize: 16 }}>{key}</Text>
                    <Text style={{ color: "#666" }}>{folders[key].length} notes</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            );
          }

          // opened folder: show all notes in that folder
          const folderNotesAll = folders[openedFolder] || [];
          const folderNotes = folderFilter ? folderNotesAll.filter((n) => n.type === folderFilter) : folderNotesAll;

          return (
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              <TouchableOpacity onPress={() => { setOpenedFolder(null); setFolderFilter(null); }} style={{ marginBottom: 12 }}>
                <Text style={{ color: "#1E88E5" }}>&lt; Back to folders</Text>
              </TouchableOpacity>

              {/* Folder-level type filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setFolderFilter(folderFilter === opt ? null : opt)}
                    style={[
                      styles.filterBtn,
                      folderFilter === opt && { backgroundColor: categoryColors[opt] },
                    ]}
                  >
                    <Text style={{ color: folderFilter === opt ? "white" : "#333" }}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {folderNotes.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => (selectMode ? toggleSelectNote(item.id) : openEditNote(item))}
                  onLongPress={() => {
                    setSelectMode(true);
                    toggleSelectNote(item.id);
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
                      onPress={() => toggleSelectNote(item.id)}
                      style={[
                        styles.checkbox,
                        selectedIds.has(item.id) && styles.checkboxSelected,
                        { marginRight: 12 },
                      ]}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={styles.noteTitle}>{item.title}</Text>

                    {Array.isArray(item.text)
                      ? item.text.map((section, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                          <Text style={styles.sectionLabel}>
                            {getLabels(item.type)?.[index]}
                          </Text>

                          <Text style={noteTextStyle(item.formatting)}>
                            {section}
                          </Text>
                        </View>
                      ))
                      : (
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

                        <TouchableOpacity onPress={() => handleDeleteOne(item.id)}>
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

      {/* BULK DELETE BAR */}
      {selectMode && (
        <View style={styles.bulkBar}>
          <Text style={{ color: "white", fontSize: 14 }}>
            {selectedIds.size} selected
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={exportSelectedNotesToPDF}
              disabled={selectedIds.size === 0}
              style={[styles.bulkExportBtn, selectedIds.size === 0 && { opacity: 0.4 }]}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteSelected}
              disabled={selectedIds.size === 0}
              style={[styles.bulkDeleteBtn, selectedIds.size === 0 && { opacity: 0.4 }]}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* FAB */}
      {!selectMode && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* BOTTOM SHEET */}
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
                  if (Array.isArray(labels)) setMultiText(new Array(labels.length).fill(""));
                  else setMultiText([]);
                }}
              >
                <Text style={{ fontSize: 18, color: categoryColors[option] }}>
                  {displayLabels[option] ?? option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* FULL SCREEN EDITOR */}
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
            {Array.isArray(getLabels(selectedType)) ? (
              getLabels(selectedType).map((label: string, index: number) => (
                <View key={index}>
                  <Text style={styles.sectionLabel}>{label}</Text>
                  <TextInput
                    style={[styles.input, noteTextStyle(fmt)]}
                    multiline
                    value={multiText[index] || ""}
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
              style={[styles.saveButton, { backgroundColor: categoryColors[selectedType] }]}
              onPress={handleSave}
            >
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeEditor}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// Styles remain unchanged
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
    bottom: 20,
    right: 20,
    backgroundColor: "#000",
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { color: "white", fontSize: 34 },
  overlay1: { flex: 1, justifyContent: "flex-end" },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    elevation: 10,
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
  selectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
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
  bulkBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  editBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
});