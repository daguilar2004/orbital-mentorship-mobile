import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7FB" },
  container: { padding: 16, paddingBottom: 28, gap: 16 },

  header: { gap: 6 },
  h1: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: "#4B5563" },

  sectionTitle: { fontSize: 18, fontWeight: "800" },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    padding: 4,
  },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    flexGrow: 1,
    flexBasis: 160,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { fontSize: 12, color: "#6B7280" },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
    color: "#111827",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },
  progressLabel: { fontSize: 11, color: "#374151" },

  phaseCardBase: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  phaseCardCompleted: { borderColor: "#c4c5ef" },
  phaseCardCurrent: { borderColor: "#f5e8f2" },
  phaseCardUpcoming: { borderColor: "#E5E7EB", opacity: 0.75 },

  phaseHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phaseContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  phaseMenuButton: {
    padding: 8,
    marginRight: 8,
  },
  phaseLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  phaseRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  phaseIndexBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbd4f2",
  },
  bubbleCompleted: { backgroundColor: "#c4c5ef" },
  bubbleCurrent: { backgroundColor: "#f7e6f3" },
  bubbleUpcoming: { backgroundColor: "#F3F4F6" },
  phaseIndexText: { fontWeight: "800", color: "#111827" },

  phaseTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  phaseDates: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  badgeActive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#f7e6f3",
    alignSelf: "flex-start",
  },
  badgeActiveText: { fontSize: 12, fontWeight: "800", color: "#ff3b89" },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  small: { fontSize: 13, color: "#374151" },
  smallMuted: { fontSize: 13, color: "#6B7280" },
  bold: { fontWeight: "800" },

  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },

  phaseBody: { marginTop: 12, gap: 10 },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0B0C67",
    backgroundColor: "#0B0C67",
  },
  addTaskButtonText: {
    fontSize: 13,
    color: "white",
    fontWeight: "600",
  },

  taskRow: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  taskMenuButton: {
    padding: 6,
    marginLeft: 8,
  },
  taskPressed: { borderColor: "#C4B5FD" },
  taskLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: "800", color: "#111827" },
  taskMeta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  xpText: { color: "#ff3b89", fontWeight: "800" },

  pressed: { opacity: 0.9 },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  modalCenterContainer: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 50,
  },

  modalPopupContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 36,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#F8FAFC",
  },
  statusChipText: { fontSize: 12, fontWeight: "900" },

  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 10,
  },

  modalCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  cardHeading: { fontSize: 14, fontWeight: "900", color: "#111827" },

  bodyText: { fontSize: 13, color: "#111827", lineHeight: 19 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  metaText: { fontSize: 12, color: "#6B7280" },

  textArea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 10,
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  rowGap: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },

  primaryBtn: {
    backgroundColor: "#FF3B89",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  primaryBtnText: { color: "white", fontWeight: "900", fontSize: 12 },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtnText: { color: "#111827", fontWeight: "900", fontSize: 12 },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 10,
  },
  fileName: { fontSize: 13, fontWeight: "900", color: "#111827" },
  fileSize: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  reviewBtnRow: { flexDirection: "row", gap: 10 },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignItems: "center",
  },
  rejectBtnText: { fontWeight: "900", color: "#DC2626" },
  approveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    alignItems: "center",
  },
  approveBtnText: { fontWeight: "900", color: "white" },

  skillBubble: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  skillBubbleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C3AED",
  },

  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  resourceText: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
  },

  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    justifyContent: "center",
    height: 50,
    overflow: "hidden",
  },
});
