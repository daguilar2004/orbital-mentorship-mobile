import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { categoryColors, options, viewMenuModes } from "../constants";
import { SortMode, ViewMode } from "../types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  insightsMenuOpen: boolean;
  onInsightsMenuToggle: () => void;
};

export default function TopBar({
  search,
  onSearchChange,
  sortMode,
  onSortChange,
  viewMode,
  onViewChange,
  activeFilter,
  onFilterChange,
  insightsMenuOpen,
  onInsightsMenuToggle,
}: Props) {
  const handleSortPress = () => {
    if (sortMode === "az") onSortChange("za");
    else if (sortMode === "za") onSortChange("default");
    else onSortChange("az");
  };

  return (
    <View style={styles.topBar}>
      <View style={styles.toolbarRow}>
        <View style={styles.searchField}>
          <Text style={styles.searchGlyph}>⌕</Text>
          <TextInput
            placeholder="Search notes"
            placeholderTextColor="#ffffff"
            value={search}
            onChangeText={onSearchChange}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          onPress={handleSortPress}
          style={[styles.headerButton, (sortMode === "az" || sortMode === "za") && styles.headerButtonActive]}
        >
          <Text style={[styles.headerButtonText, (sortMode === "az" || sortMode === "za") && styles.headerButtonTextOnDark]}>
            {sortMode === "az" ? "A-Z" : sortMode === "za" ? "Z-A" : "⇅"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dropdownWrap}>
          <TouchableOpacity
            onPress={onInsightsMenuToggle}
            style={[styles.headerButton, styles.dropdownButton, insightsMenuOpen && styles.headerButtonActive]}
          >
            <Text style={[styles.headerButtonText, insightsMenuOpen && styles.headerButtonTextOnDark]}>
              Views
            </Text>
            <Text style={[styles.dropdownCaret, insightsMenuOpen && styles.headerButtonTextOnDark]}>▾</Text>
          </TouchableOpacity>

          {insightsMenuOpen && (
            <>
              <Pressable style={styles.dropdownOverlay} onPress={onInsightsMenuToggle} />
              <View style={styles.dropdownMenu}>
                {viewMenuModes.map((mode) => {
                  const isActive = viewMode === mode.key;
                  return (
                    <TouchableOpacity
                      key={mode.key}
                      onPress={() => { onViewChange(mode.key); onInsightsMenuToggle(); }}
                      style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    >
                      <Text style={[styles.dropdownItemTitle, isActive && styles.dropdownItemTitleActive]}>
                        {mode.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </View>

      {viewMode === "list" && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onFilterChange(activeFilter === opt ? null : opt)}
              style={[styles.filterBtn, activeFilter === opt && { backgroundColor: categoryColors[opt] }]}
            >
              <Text style={[styles.filterBtnText, activeFilter === opt && styles.filterBtnTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { marginBottom: 12, position: "relative", zIndex: 4 },
  toolbarRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  searchField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#0b0c67",
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  searchGlyph: { fontSize: 16, color: "#ffffff", marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: "#ffffff", paddingVertical: 11 },
  headerButton: {
    minHeight: 44,
    paddingHorizontal: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    backgroundColor: "#0b0c67",
    justifyContent: "center",
  },
  headerButtonActive: { backgroundColor: "#111827", borderColor: "#111827" },
  headerButtonText: { fontSize: 14, fontWeight: "600", color: "#ffffff" },
  headerButtonTextOnDark: { color: "#FFFFFF" },
  dropdownWrap: { position: "relative" },
  dropdownButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minWidth: 82 },
  dropdownCaret: { fontSize: 12, color: "#344054", marginLeft: 8 },
  dropdownOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 19 },
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
  dropdownItem: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemActive: { backgroundColor: "#F3F4F6" },
  dropdownItemTitle: { fontSize: 14, fontWeight: "600", color: "#101828", marginBottom: 2 },
  dropdownItemTitleActive: { color: "#111827" },
  filterRow: { paddingRight: 4 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  filterBtnText: { fontSize: 13, fontWeight: "600", color: "#344054" },
  filterBtnTextActive: { color: "#FFFFFF" },
});
