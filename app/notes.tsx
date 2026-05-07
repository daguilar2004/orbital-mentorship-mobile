import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  TouchableOpacity,
  View,
} from "react-native";
import FavoritesView from "@/components/notes/components/FavoritesView";
import GraphView from "@/components/notes/components/GraphView";
import NoteCard from "@/components/notes/components/NoteCard";
import NoteEditor from "@/components/notes/components/NoteEditor";
import TimelineView from "@/components/notes/components/TimelineView";
import TopBar from "@/components/notes/components/TopBar";
import { categoryColors, defaultFormatting, displayLabels, options } from "@/components/notes/constants";
import { useNotes } from "@/components/notes/hooks/useNotes";
import { Formatting, Note, SortMode, ViewMode } from "@/components/notes/types";
import { escapeHtml, formatDateKey, getLabels, getNoteId } from "@/components/notes/utils";
import { MOCK_USER_ID } from "./api/mockAuth";
import { useApp } from "./context/AppContext";

export default function Notes() {
  const { userRole } = useApp();
  const userId = MOCK_USER_ID;

  const { notes, loading, error, loadData, saveNote, deleteNote, deleteSelected, toggleFavorite } =
    useNotes(userId, userRole);

  const getLabelsForRole = (type: string | null) => getLabels(type, userRole);

  /* ── EDITOR STATE ─────────────────────────────────────── */
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [text, setText] = useState("");
  const [multiText, setMultiText] = useState<string[]>([]);
  const [fmt, setFmt] = useState<Formatting>(defaultFormatting);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  /* ── LIST/VIEW STATE ──────────────────────────────────── */
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [openedFolder, setOpenedFolder] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [insightsMenuOpen, setInsightsMenuOpen] = useState(false);

  useEffect(() => { if (userId) loadData(); }, [userId]);

  useEffect(() => {
    const onBack = () => {
      if (selectedType) { closeEditor(); return true; }
      if (modalVisible) { setModalVisible(false); return true; }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [selectedType, modalVisible]);

  /* ── EDITOR HELPERS ───────────────────────────────────── */
  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setSelectedType(note.type);
    setNoteTitle(note.title);
    setFmt(note.formatting ?? defaultFormatting);
    if (Array.isArray(note.text)) {
      const labels = getLabelsForRole(note.type);
      const expectedLen = Array.isArray(labels) ? labels.length : 1;
      const padded = [...note.text];
      while (padded.length < expectedLen) padded.push("");
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

  const handleSave = async () => {
    const finalTitle = noteTitle.trim() || new Date().toLocaleDateString();
    const labels = getLabelsForRole(selectedType);
    let noteContent: string | string[];

    if (Array.isArray(labels)) {
      if (multiText.every((t) => !t.trim())) return;
      noteContent = multiText;
    } else {
      if (!text.trim()) return;
      noteContent = text;
    }

    if (editingNote) {
      await saveNote(
        { _id: getNoteId(editingNote), type: selectedType!, title: finalTitle, text: noteContent, formatting: fmt, createdAt: editingNote.createdAt },
        "update"
      );
    } else {
      await saveNote(
        { type: selectedType!, title: finalTitle, text: noteContent, formatting: fmt },
        "create"
      );
    }
    closeEditor();
  };

  /* ── SELECT MODE ──────────────────────────────────────── */
  const toggleSelectNote = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    await deleteSelected(selectedIds);
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  /* ── PDF EXPORT ───────────────────────────────────────── */
  const sharePdf = async (uri: string, dialogTitle: string) => {
    if (!(await Sharing.isAvailableAsync())) return;
    await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle });
  };

  const generateNoteHTML = (note: Note) => {
    const dateStr = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "";
    let html = `<html><head><meta charset="utf-8"><title>${note.title}</title><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6}h1{color:#333;margin-bottom:10px}.type{color:#666;font-size:14px;margin-bottom:20px}.content{margin:20px 0;white-space:pre-wrap}.section{margin-bottom:15px}.section-label{font-weight:bold;margin-bottom:5px}.date{font-size:12px;color:#666;margin-top:30px}</style></head><body>`;
    html += `<h1>${escapeHtml(note.title)}</h1><div class="type">${escapeHtml(displayLabels[note.type] || note.type)}</div>`;
    if (Array.isArray(note.text)) {
      note.text.forEach((section, i) => {
        const label = getLabelsForRole(note.type);
        html += `<div class="section"><div class="section-label">${Array.isArray(label) ? label[i] ?? "" : label}</div><div class="content">${escapeHtml(section)}</div></div>`;
      });
    } else {
      const label = getLabelsForRole(note.type);
      html += `<div class="section"><div class="section-label">${Array.isArray(label) ? "" : (label ?? "")}</div><div class="content">${escapeHtml(note.text)}</div></div>`;
    }
    if (dateStr) html += `<div class="date">Created: ${escapeHtml(dateStr)}</div>`;
    html += "</body></html>";
    return html;
  };

  const exportNoteToPDF = async (note: Note) => {
    try {
      const { uri } = await Print.printToFileAsync({ html: generateNoteHTML(note), base64: false });
      await sharePdf(uri, "Share Note PDF");
    } catch (e) { console.error("Error generating PDF:", e); }
  };

  const exportSelectedNotesToPDF = async () => {
    const selected = notes.filter((n) => selectedIds.has(getNoteId(n)));
    if (selected.length === 0) return;
    let html = `<html><head><meta charset="utf-8"><title>Selected Notes</title><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6}.page{page-break-after:always}h1{color:#333}.type{color:#666;font-size:14px;margin-bottom:20px}.content{margin:20px 0;white-space:pre-wrap}.section{margin-bottom:15px}.section-label{font-weight:bold;margin-bottom:5px}.date{font-size:12px;color:#666;margin-top:30px}</style></head><body>`;
    selected.forEach((note) => {
      html += `<div class="page">${generateNoteHTML(note).replace(/<html>.*<body>/s, "").replace("</body></html>", "")}</div>`;
    });
    html += "</body></html>";
    try {
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await sharePdf(uri, "Share Selected Notes PDF");
    } catch (e) { console.error("Error generating PDF:", e); }
  };

  /* ── FILTER / SORT ────────────────────────────────────── */
  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    const matchTitle = (n.title ?? "").toLowerCase().includes(q);
    const matchText = Array.isArray(n.text)
      ? n.text.some((t) => t.toLowerCase().includes(q))
      : typeof n.text === "string" && n.text.toLowerCase().includes(q);
    const matchFilter = activeFilter ? n.type === activeFilter : true;
    return (matchTitle || matchText) && matchFilter;
  });

  let visibleNotes = [...filteredNotes];
  if (sortMode === "az") visibleNotes.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
  else if (sortMode === "za") visibleNotes.sort((a, b) => (b.title ?? "").localeCompare(a.title ?? ""));
  else if (sortMode === "favorites") visibleNotes = visibleNotes.filter((n) => n.favorite);

  const groupedNotes = options.reduce((acc: Record<string, Note[]>, cat) => {
    acc[cat] = visibleNotes.filter((n) => n.type === cat);
    return acc;
  }, {});

  /* ── LOADING STATE ────────────────────────────────────── */
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
            <TopBar
              search={search}
              onSearchChange={setSearch}
              sortMode={sortMode}
              onSortChange={setSortMode}
              viewMode={viewMode}
              onViewChange={setViewMode}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              insightsMenuOpen={insightsMenuOpen}
              onInsightsMenuToggle={() => setInsightsMenuOpen((o) => !o)}
            />

            <View style={styles.contentShell}>
              {/* LIST VIEW */}
              {viewMode === "list" && (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  {visibleNotes.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateTitle}>No notes found</Text>
                      <Text style={styles.emptyStateText}>Try a different search or clear the current filter.</Text>
                    </View>
                  ) : (
                    options.map((category) =>
                      groupedNotes[category]?.length ? (
                        <View key={category} style={styles.groupSection}>
                          <View style={styles.groupHeader}>
                            <View style={[styles.groupAccent, { backgroundColor: categoryColors[category] }]} />
                            <Text style={styles.groupTitle}>{displayLabels[category] ?? category}</Text>
                            <View style={[styles.groupCount, { backgroundColor: `${categoryColors[category]}18` }]}>
                              <Text style={[styles.groupCountText, { color: categoryColors[category] }]}>
                                {groupedNotes[category].length}
                              </Text>
                            </View>
                          </View>
                          {groupedNotes[category].map((item) => (
                            <NoteCard
                              key={getNoteId(item)}
                              item={item}
                              category={category}
                              selectMode={selectMode}
                              isSelected={selectedIds.has(getNoteId(item))}
                              onPress={() => selectMode ? toggleSelectNote(getNoteId(item)) : openEditNote(item)}
                              onLongPress={() => { setSelectMode(true); toggleSelectNote(getNoteId(item)); }}
                              onToggleSelect={() => toggleSelectNote(getNoteId(item))}
                              onToggleFavorite={() => toggleFavorite(getNoteId(item))}
                              getLabels={getLabelsForRole}
                            />
                          ))}
                        </View>
                      ) : null
                    )
                  )}
                </ScrollView>
              )}

              {/* TIMELINE VIEW */}
              {viewMode === "timeline" && (
                <TimelineView notes={visibleNotes} onOpenNote={openEditNote} onToggleFavorite={toggleFavorite} getLabels={getLabelsForRole} />
              )}

              {/* FAVORITES VIEW */}
              {viewMode === "favorites" && (
                <FavoritesView notes={notes} onOpenNote={openEditNote} onToggleFavorite={toggleFavorite} onExport={exportNoteToPDF} onDelete={deleteNote} getLabels={getLabelsForRole} />
              )}

              {/* GRAPH VIEW */}
              {viewMode === "graph" && (
                <GraphView notes={visibleNotes} onOpenNote={openEditNote} />
              )}

              {/* FOLDER VIEW */}
              {viewMode === "folder" && (() => {
                const folders: Record<string, Note[]> = {};
                visibleNotes.forEach((n) => {
                  const key = formatDateKey(n.createdAt, n.id);
                  if (!folders[key]) folders[key] = [];
                  folders[key].push(n);
                });
                const folderKeys = Object.keys(folders).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

                if (!openedFolder) {
                  return (
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                      {folderKeys.map((key) => (
                        <TouchableOpacity key={key} style={[styles.noteCard, styles.folderCard]} onPress={() => setOpenedFolder(key)}>
                          <Text style={styles.folderTitle}>{key}</Text>
                          <Text style={styles.folderCount}>{folders[key].length} notes</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  );
                }

                const folderNotes = (folders[openedFolder] || []).filter((n) => folderFilter ? n.type === folderFilter : true);
                return (
                  <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => { setOpenedFolder(null); setFolderFilter(null); }} style={styles.backButton}>
                      <Text style={styles.backButtonText}>‹ Back to folders</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 4 }}>
                      {options.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => setFolderFilter(folderFilter === opt ? null : opt)}
                          style={[styles.filterBtn, folderFilter === opt && { backgroundColor: categoryColors[opt] }]}
                        >
                          <Text style={[styles.filterBtnText, folderFilter === opt && { color: "#FFFFFF" }]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    {folderNotes.map((item) => (
                      <NoteCard
                        key={getNoteId(item)}
                        item={item}
                        category={item.type}
                        selectMode={selectMode}
                        isSelected={selectedIds.has(getNoteId(item))}
                        onPress={() => selectMode ? toggleSelectNote(getNoteId(item)) : openEditNote(item)}
                        onLongPress={() => { setSelectMode(true); toggleSelectNote(getNoteId(item)); }}
                        onToggleSelect={() => toggleSelectNote(getNoteId(item))}
                        onToggleFavorite={() => toggleFavorite(getNoteId(item))}
                        getLabels={getLabelsForRole}
                      />
                    ))}
                  </ScrollView>
                );
              })()}
            </View>

            {/* BULK ACTION BUTTONS */}
            {selectMode && (
              <>
                <TouchableOpacity onPress={handleDeleteSelected} disabled={selectedIds.size === 0} style={[styles.bulkTrashBtn, selectedIds.size === 0 && { opacity: 0.4 }]}>
                  <MaterialCommunityIcons name="trash-can" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={exportSelectedNotesToPDF} disabled={selectedIds.size === 0} style={[styles.bulkSatelliteBtn, { right: 42, bottom: 107, backgroundColor: "#cfc2eb" }, selectedIds.size === 0 && { opacity: 0.4 }]}>
                  <MaterialCommunityIcons name="file-export" size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedIds.size === 1) {
                      const note = notes.find((n) => getNoteId(n) === Array.from(selectedIds)[0]);
                      if (note) { openEditNote(note); setSelectMode(false); setSelectedIds(new Set()); }
                    } else {
                      Alert.alert("Edit note", "Select exactly one note to edit.");
                    }
                  }}
                  disabled={selectedIds.size !== 1}
                  style={[styles.bulkSatelliteBtn, { right: 97, bottom: 68, backgroundColor: "#e373bd" }, selectedIds.size !== 1 && { opacity: 0.4 }]}
                >
                  <MaterialCommunityIcons name="pencil" size={22} color="white" />
                </TouchableOpacity>
              </>
            )}

            {/* FAB */}
            {selectMode ? (
              <TouchableOpacity style={[styles.fab, { backgroundColor: "#0b0c67" }]} onPress={() => { setSelectMode(false); setSelectedIds(new Set()); }}>
                <MaterialCommunityIcons name="check" size={28} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>+</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* NOTE TYPE PICKER MODAL */}
        <Modal transparent visible={modalVisible} animationType="slide" presentationStyle="overFullScreen" statusBarTranslucent>
          <Pressable style={styles.overlay1} onPress={() => setModalVisible(false)}>
            <View style={styles.bottomSheet}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.option}
                  onPress={() => {
                    setSelectedType(option);
                    setModalVisible(false);
                    const labels = getLabelsForRole(option);
                    setMultiText(Array.isArray(labels) ? new Array(labels.length).fill("") : []);
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

        {/* EDITOR */}
        {selectedType && (
          <NoteEditor
            selectedType={selectedType}
            editingNote={editingNote}
            noteTitle={noteTitle}
            onTitleChange={setNoteTitle}
            text={text}
            onTextChange={setText}
            multiText={multiText}
            onMultiTextChange={setMultiText}
            fmt={fmt}
            onFmtChange={setFmt}
            onSave={handleSave}
            onCancel={closeEditor}
            getLabels={getLabelsForRole}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EEF2F6" },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 12 },
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
  scrollContent: { paddingBottom: 110 },
  emptyState: { marginTop: 80, alignItems: "center", paddingHorizontal: 24 },
  emptyStateTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 6 },
  emptyStateText: { fontSize: 14, lineHeight: 20, color: "#667085", textAlign: "center" },
  groupSection: { marginBottom: 24 },
  groupHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  groupAccent: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  groupTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: "#111827" },
  groupCount: { minWidth: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  groupCountText: { fontSize: 12, fontWeight: "700" },
  noteCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  folderCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderLeftColor: "#CBD5E1" },
  folderTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  folderCount: { fontSize: 13, color: "#667085" },
  backButton: { alignSelf: "flex-start", marginBottom: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#F2F4F7" },
  backButtonText: { color: "#1D4ED8", fontSize: 13, fontWeight: "600" },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: "#D0D5DD", marginRight: 8, backgroundColor: "#FFFFFF" },
  filterBtnText: { fontSize: 13, fontWeight: "600", color: "#344054" },
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
  overlay1: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15, 23, 42, 0.16)" },
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
  option: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#F2F4F7" },
  bulkTrashBtn: {
    position: "absolute",
    bottom: 22,
    left: 22,
    backgroundColor: "#ff3b89",
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  bulkSatelliteBtn: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});