import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const {
    phases,
    totalXP,
    userRole,
    submitTask,
    addMockAttachment,
    updateTaskDescription,
    reviewTask,
  } = useApp();

  const currentPhase = useMemo(
    () => phases.find((p) => p.status === "current"),
    [phases],
  );

  // accordion
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // modal
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // local draft fields for modal
  const [draftDesc, setDraftDesc] = useState("");
  const [draftResponse, setDraftResponse] = useState("");
  const [draftFeedback, setDraftFeedback] = useState("");

  useEffect(() => {
    if (currentPhase) setExpanded(new Set([currentPhase.id]));
  }, [currentPhase?.id]);

  const completedPhases = phases.filter((p) => p.status === "completed").length;
  const totalPhases = phases.length;

  const pendingTasksCount = useMemo(() => {
    return phases
      .flatMap((p) => p.tasks)
      .filter((t) => t.status === "pending" || t.status === "submitted").length;
  }, [phases]);

  const activePhase = useMemo(() => {
    if (!activePhaseId) return null;
    return phases.find((p) => p.id === activePhaseId) ?? null;
  }, [activePhaseId, phases]);

  const activeTask = useMemo(() => {
    if (!activePhase || !activeTaskId) return null;
    return activePhase.tasks.find((t) => t.id === activeTaskId) ?? null;
  }, [activePhase, activeTaskId]);

  // When opening a task, seed drafts from state
  useEffect(() => {
    if (!activeTask) return;
    setDraftDesc(activeTask.description ?? "");
    setDraftResponse(activeTask.submittedResponse ?? "");
    setDraftFeedback(activeTask.mentorFeedback ?? "");
  }, [activeTask?.id]);

  function togglePhase(phase: Phase) {
    if (phase.status === "upcoming") return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(phase.id)) next.delete(phase.id);
      else next.add(phase.id);
      return next;
    });
  }

  function openTask(phase: Phase, task: Task) {
    setActivePhaseId(phase.id);
    setActiveTaskId(task.id);
  }

  function closeTask() {
    setActivePhaseId(null);
    setActiveTaskId(null);
    setDraftDesc("");
    setDraftResponse("");
    setDraftFeedback("");
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.h1}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          {userRole === "mentee"
            ? "Continue your learning journey"
            : "Manage your mentees progress"}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="trophy"
          iconBg="#F3E8FF"
          iconColor="#7C3AED"
          label="Total XP"
          value={`${totalXP}`}
        />
        <StatCard
          icon="trending-up"
          iconBg="#DBEAFE"
          iconColor="#2563EB"
          label="Progress"
          value={`${completedPhases}/${totalPhases}`}
        />
        <StatCard
          icon="flag"
          iconBg="#DCFCE7"
          iconColor="#16A34A"
          label={userRole === "mentee" ? "Pending Tasks" : "Tasks to Review"}
          value={`${pendingTasksCount}`}
        />
      </View>

      {/* Phases on Home */}
      <Text style={styles.sectionTitle}>Phases</Text>

      <View style={{ gap: 12 }}>
        {phases.map((phase, idx) => {
          const isExpanded = expanded.has(phase.id);
          const isLocked = phase.status === "upcoming";

          const approvedCount = phase.tasks.filter(
            (t) => t.status === "approved"
          ).length;
          const totalTasks = phase.tasks.length;
          const progressPct =
            totalTasks > 0 ? Math.round((approvedCount / totalTasks) * 100) : 0;

          const cardStyle =
            phase.status === "current"
              ? styles.phaseCardCurrent
              : phase.status === "completed"
              ? styles.phaseCardCompleted
              : styles.phaseCardUpcoming;

          return (
            <View key={phase.id} style={[styles.phaseCardBase, cardStyle]}>
              <Pressable
                onPress={() => togglePhase(phase)}
                style={({ pressed }) => [
                  styles.phaseHeaderRow,
                  pressed && !isLocked && styles.pressed,
                ]}
              >
                <View style={styles.phaseLeft}>
                  <View
                    style={[
                      styles.phaseIndexBubble,
                      phase.status === "current" && styles.bubbleCurrent,
                      phase.status === "completed" && styles.bubbleCompleted,
                      phase.status === "upcoming" && styles.bubbleUpcoming,
                    ]}
                  >
                    <Text style={styles.phaseIndexText}>{idx + 1}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.phaseTitleRow}>
                      <Text style={styles.phaseTitle}>{phase.name}</Text>
                      {phase.status === "current" ? (
                        <View style={styles.badgeActive}>
                          <Text style={styles.badgeActiveText}>Active</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.phaseDates}>
                      {phase.startDate} - {phase.endDate}
                    </Text>
                  </View>
                </View>

                <View style={styles.phaseRight}>
                  {phase.status === "completed" ? (
                    <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  ) : null}

                  {phase.status === "upcoming" ? (
                    <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
                  ) : (
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#6B7280"
                    />
                  )}
                </View>
              </Pressable>

              <View style={{ marginTop: 10 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.smallMuted}>Tasks Progress</Text>
                  <Text style={[styles.small, styles.bold]}>
                    {approvedCount}/{totalTasks}
                  </Text>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      phase.status === "completed"
                        ? { backgroundColor: "#16A34A" }
                        : { backgroundColor: "#7C3AED" },
                      { width: `${progressPct}%` },
                    ]}
                  />
                </View>
              </View>

              {isExpanded && !isLocked ? (
                <View style={styles.phaseBody}>
                  {phase.tasks.map((task) => (
                    <Pressable
                      key={task.id}
                      onPress={() => openTask(phase, task)}
                      style={({ pressed }) => [
                        styles.taskRow,
                        pressed && styles.taskPressed,
                      ]}
                    >
                      <View style={styles.taskLeft}>
                        <Ionicons
                          name={taskStatusIcon(task.status)}
                          size={18}
                          color={taskStatusColor(task.status)}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.taskTitle}>{task.title}</Text>
                          <Text style={styles.taskMeta}>
                            <Text style={styles.xpText}>{task.xp} XP</Text>
                            {"  •  "}
                            Due {task.dueDate}
                          </Text>
                        </View>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#9CA3AF"
                      />
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* ------------------ TASK MODAL ------------------ */}
      <Modal
        visible={!!activeTask}
        transparent
        animationType="slide"
        onRequestClose={closeTask}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeTask} />

        <View style={styles.modalSheet}>
          <View style={styles.modalGrabber} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* Status chip */}
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <View style={[styles.statusChip, { borderColor: taskStatusColor(activeTask?.status ?? "pending") }]}>
                <Ionicons
                  name={taskStatusIcon(activeTask?.status ?? "pending")}
                  size={16}
                  color={taskStatusColor(activeTask?.status ?? "pending")}
                />
                <Text style={[styles.statusChipText, { color: taskStatusColor(activeTask?.status ?? "pending") }]}>
                  {statusLabel(activeTask?.status ?? "pending")}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.modalTitle}>{activeTask?.title}</Text>

            {/* Description (mentor can edit, mentee view-only) */}
            <View style={styles.modalCard}>
              <Text style={styles.cardHeading}>Task Description</Text>

              {userRole === "mentor" ? (
                <>
                  <TextInput
                    value={draftDesc}
                    onChangeText={setDraftDesc}
                    multiline
                    style={styles.textArea}
                    placeholder="Write the task description…"
                  />
                  <Pressable
                    style={styles.primaryBtn}
                    onPress={() => {
                      if (!activePhase || !activeTask) return;
                      updateTaskDescription(activePhase.id, activeTask.id, draftDesc.trim());
                    }}
                  >
                    <Text style={styles.primaryBtnText}>Save Description</Text>
                  </Pressable>
                </>
              ) : (
                <Text style={styles.bodyText}>
                  {activeTask?.description || "No description."}
                </Text>
              )}

              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={styles.metaText}>Due: {activeTask?.dueDate}</Text>

                <Ionicons name="ribbon-outline" size={16} color="#6B7280" />
                <Text style={[styles.metaText, { color: "#7C3AED", fontWeight: "800" }]}>
                  {activeTask?.xp} XP
                </Text>
              </View>
            </View>

            {/* Submitted Response (mentee can edit/submit, mentor read-only) */}
            <View style={styles.modalCard}>
              <Text style={styles.cardHeading}>Submitted Response</Text>

              {userRole === "mentee" ? (
                <>
                  <TextInput
                    value={draftResponse}
                    onChangeText={setDraftResponse}
                    multiline
                    style={styles.textArea}
                    placeholder="Write your response…"
                  />
                  <View style={styles.rowGap}>
                    <Pressable
                      style={styles.secondaryBtn}
                      onPress={() => {
                        if (!activePhase || !activeTask) return;
                        addMockAttachment(activePhase.id, activeTask.id);
                      }}
                    >
                      <Ionicons name="attach" size={16} color="#111827" />
                      <Text style={styles.secondaryBtnText}>Add Attachment</Text>
                    </Pressable>

                    <Pressable
                      style={styles.primaryBtn}
                      onPress={() => {
                        if (!activePhase || !activeTask) return;
                        submitTask(activePhase.id, activeTask.id, draftResponse.trim());
                      }}
                    >
                      <Text style={styles.primaryBtnText}>
                        {activeTask?.status === "submitted" ? "Resubmit" : "Submit"}
                      </Text>
                    </Pressable>
                  </View>

                  {activeTask?.submittedAt ? (
                    <Text style={styles.smallMuted}>
                      Submitted on {activeTask.submittedAt}
                    </Text>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={styles.bodyText}>
                    {activeTask?.submittedResponse
                      ? activeTask.submittedResponse
                      : "No response submitted yet."}
                  </Text>
                  {activeTask?.submittedAt ? (
                    <Text style={styles.smallMuted}>
                      Submitted on {activeTask.submittedAt}
                    </Text>
                  ) : null}
                </>
              )}
            </View>

            {/* Attachments */}
            <View style={styles.modalCard}>
              <Text style={styles.cardHeading}>Attached Files</Text>

              {activeTask?.attachments && activeTask.attachments.length > 0 ? (
                <View style={{ gap: 10, marginTop: 8 }}>
                  {activeTask.attachments.map((a) => (
                    <View key={a.id} style={styles.fileRow}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                        <Ionicons name="document-outline" size={18} color="#6B7280" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.fileName}>{a.name}</Text>
                          <Text style={styles.fileSize}>{a.sizeLabel}</Text>
                        </View>
                      </View>

                      {/* download icon placeholder */}
                      <Pressable onPress={() => {}}>
                        <Ionicons name="download-outline" size={18} color="#2563EB" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.smallMuted}>No files attached.</Text>
              )}
            </View>

            {/* Mentor Review Section */}
            {userRole === "mentor" ? (
              <View style={styles.modalCard}>
                <Text style={styles.cardHeading}>Task Review</Text>

                <TextInput
                  value={draftFeedback}
                  onChangeText={setDraftFeedback}
                  multiline
                  style={styles.textArea}
                  placeholder="Leave feedback for the mentee…"
                />

                <View style={styles.reviewBtnRow}>
                  <Pressable
                    style={styles.rejectBtn}
                    onPress={() => {
                      if (!activePhase || !activeTask) return;
                      reviewTask(activePhase.id, activeTask.id, "rejected", draftFeedback.trim());
                    }}
                  >
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </Pressable>

                  <Pressable
                    style={styles.approveBtn}
                    onPress={() => {
                      if (!activePhase || !activeTask) return;
                      reviewTask(activePhase.id, activeTask.id, "approved", draftFeedback.trim());
                    }}
                  >
                    <Text style={styles.approveBtnText}>Accept</Text>
                  </Pressable>
                </View>

                {activeTask?.reviewedAt ? (
                  <Text style={styles.smallMuted}>Reviewed on {activeTask.reviewedAt}</Text>
                ) : null}
              </View>
            ) : (
              // Mentee sees feedback if exists
              activeTask?.mentorFeedback ? (
                <View style={styles.modalCard}>
                  <Text style={styles.cardHeading}>Mentor Feedback</Text>
                  <Text style={styles.bodyText}>{activeTask.mentorFeedback}</Text>
                  {activeTask.reviewedAt ? (
                    <Text style={styles.smallMuted}>Reviewed on {activeTask.reviewedAt}</Text>
                  ) : null}
                </View>
              ) : null
            )}

            {/* Close */}
            <Pressable onPress={closeTask} style={[styles.secondaryBtn, { marginTop: 10, justifyContent: "center" }]}>
              <Text style={styles.secondaryBtnText}>Close</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ---------- UI helpers ---------- */

function statusLabel(status: Task["status"]) {
  switch (status) {
    case "submitted":
      return "Pending Review";
    case "approved":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "pending":
    default:
      return "Not Submitted";
  }
}

function taskStatusIcon(status: Task["status"]): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "approved":
      return "checkmark-circle";
    case "submitted":
      return "time";
    case "rejected":
      return "close-circle";
    case "pending":
    default:
      return "ellipse-outline";
  }
}

function taskStatusColor(status: Task["status"]) {
  switch (status) {
    case "approved":
      return "#16A34A";
    case "submitted":
      return "#2563EB";
    case "rejected":
      return "#DC2626";
    case "pending":
    default:
      return "#6B7280";
  }
}

function StatCard(props: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statRow}>
        <View style={[styles.iconWrap, { backgroundColor: props.iconBg }]}>
          <Ionicons name={props.icon} size={22} color={props.iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.statLabel}>{props.label}</Text>
          <Text style={styles.statValue}>{props.value}</Text>
        </View>
      </View>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  
  screen: { flex: 1, backgroundColor: "#F7F7FB" },
  container: { padding: 16, paddingBottom: 28, gap: 16 },

  header: { gap: 6 },
  h1: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, color: "#4B5563" },

  sectionTitle: { fontSize: 18, fontWeight: "800" },

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
  statValue: { fontSize: 22, fontWeight: "800", marginTop: 2 },

  phaseCardBase: { backgroundColor: "white", borderRadius: 16, padding: 14, borderWidth: 1 },
  phaseCardCompleted: { borderColor: "#86EFAC" },
  phaseCardCurrent: { borderColor: "#C4B5FD" },
  phaseCardUpcoming: { borderColor: "#E5E7EB", opacity: 0.75 },

  phaseHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  phaseLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  phaseRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  phaseIndexBubble: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E7EB" },
  bubbleCompleted: { backgroundColor: "#DCFCE7" },
  bubbleCurrent: { backgroundColor: "#EDE9FE" },
  bubbleUpcoming: { backgroundColor: "#F3F4F6" },
  phaseIndexText: { fontWeight: "800", color: "#111827" },

  phaseTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  phaseTitle: { fontSize: 16, fontWeight: "800" },
  phaseDates: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  badgeActive: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: "#EDE9FE" },
  badgeActiveText: { fontSize: 12, fontWeight: "800", color: "#7C3AED" },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  small: { fontSize: 13, color: "#374151" },
  smallMuted: { fontSize: 13, color: "#6B7280" },
  bold: { fontWeight: "800" },

  progressTrack: { height: 8, backgroundColor: "#E5E7EB", borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999 },

  phaseBody: { marginTop: 12, gap: 10 },

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
  taskPressed: { borderColor: "#C4B5FD" },
  taskLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: "800", color: "#111827" },
  taskMeta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  xpText: { color: "#7C3AED", fontWeight: "800" },

  pressed: { opacity: 0.9 },

  // Modal
    modalRoot: {
  flex: 1,
  justifyContent: "flex-end",
  },

  modalContent: {
    paddingBottom: 24, // lets you scroll past the last button
  },

  modalSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "92%",
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  modalGrabber: { alignSelf: "center", width: 48, height: 5, borderRadius: 999, backgroundColor: "#E5E7EB", marginBottom: 10 },

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

  modalTitle: { fontSize: 18, fontWeight: "900", color: "#111827", marginBottom: 10 },

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
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
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

  rowGap: { flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" },

  primaryBtn: { backgroundColor: "#7C3AED", paddingVertical: 12, borderRadius: 12, alignItems: "center", flex: 1 },
  primaryBtnText: { color: "white", fontWeight: "900" },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
  },
  secondaryBtnText: { color: "#111827", fontWeight: "900" },

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
  rejectBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#FCA5A5", alignItems: "center" },
  rejectBtnText: { fontWeight: "900", color: "#DC2626" },
  approveBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#16A34A", alignItems: "center" },
  approveBtnText: { fontWeight: "900", color: "white" },
});