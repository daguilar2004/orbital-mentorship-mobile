import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Platform,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useApp, Phase, Task } from "./context/AppContext";
import Constants from "expo-constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAvoidingView } from "react-native";

export default function Home() {
  const {
    phases,
    totalXP,
    xpGoal,
    userRole,
    addPhase,
    editPhase,
    deletePhase,
    addTaskToPhase,
    editTask,
    deleteTask,
    submitTask,
    addMockAttachment,
    updateTaskDescription,
    reviewTask,
  } = useApp();

  // State for adding phase/task
  const [addingPhase, setAddingPhase] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseDescription, setNewPhaseDescription] = useState("");
  const [newPhaseStart, setNewPhaseStart] = useState("");
  const [newPhaseEnd, setNewPhaseEnd] = useState("");
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [addingTaskToPhaseId, setAddingTaskToPhaseId] = useState<string | null>(
    null,
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskExpectedTimeValue, setNewTaskExpectedTimeValue] = useState("");
  const [newTaskExpectedTimeUnit, setNewTaskExpectedTimeUnit] = useState<
    "hours" | "days" | "weeks"
  >("hours");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [newTaskResources, setNewTaskResources] = useState<
    {
      type: "link" | "file";
      value: string;
      label?: string;
      fileInfo?: {
        name: string;
        size: number;
        uri: string;
        mimeType?: string;
      };
    }[]
  >([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskPhaseId, setEditingTaskPhaseId] = useState<string | null>(
    null,
  );
  const [newTaskSkills, setNewTaskSkills] = useState("");
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const xpPercent = Math.min(100, Math.round((totalXP / xpGoal) * 100));

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
  const [menuTask, setMenuTask] = useState<{
    task: Task;
    phaseId: string;
  } | null>(null);

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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<
    "task" | "phase" | "start" | "end" | null
  >(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
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
            iconColor="#FF3B89"
            label="Total XP"
            value={`${totalXP}`}
            progress={xpPercent}
            progressMax={xpGoal}
          />
          <StatCard
            icon="trending-up"
            iconBg="#F3E8FF"
            iconColor="#2563EB"
            label="Progress"
            value={`${completedPhases}/${totalPhases}`}
          />
          <StatCard
            icon="flag"
            iconBg="#F3E8FF"
            iconColor="#47f888"
            label={userRole === "mentee" ? "Pending Tasks" : "Tasks to Review"}
            value={`${pendingTasksCount}`}
          />
        </View>

        {/* Phases on Home */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Phases</Text>
          {userRole === "mentee" && (
            <Pressable
              onPress={() => setAddingPhase(true)}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="add-circle" size={24} color="#FF3B89" />
            </Pressable>
          )}
        </View>

        <View style={{ gap: 12 }}>
          {phases.map((phase, idx) => {
            const isExpanded = expanded.has(phase.id);
            const isLocked = phase.status === "upcoming";

            const approvedCount = phase.tasks.filter(
              (t) => t.status === "approved",
            ).length;
            const totalTasks = phase.tasks.length;
            const progressPct =
              totalTasks > 0
                ? Math.round((approvedCount / totalTasks) * 100)
                : 0;

            const cardStyle =
              phase.status === "current"
                ? styles.phaseCardCurrent
                : phase.status === "completed"
                  ? styles.phaseCardCompleted
                  : styles.phaseCardUpcoming;

            return (
              <View key={phase.id} style={[styles.phaseCardBase, cardStyle]}>
                <View style={styles.phaseHeaderRow}>
                  <Pressable
                    onPress={() => togglePhase(phase)}
                    style={({ pressed }) => [
                      styles.phaseContent,
                      pressed && !isLocked && styles.pressed,
                    ]}
                  >
                    <View style={styles.phaseLeft}>
                      <View
                        style={[
                          styles.phaseIndexBubble,
                          phase.status === "current" && styles.bubbleCurrent,
                          phase.status === "completed" &&
                            styles.bubbleCompleted,
                          phase.status === "upcoming" && styles.bubbleUpcoming,
                        ]}
                      >
                        <Text style={styles.phaseIndexText}>{idx + 1}</Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        {phase.status === "current" ? (
                          <View style={styles.badgeActive}>
                            <Text style={styles.badgeActiveText}>Active</Text>
                          </View>
                        ) : null}
                        <Text style={styles.phaseTitle}>{phase.name}</Text>

                        <Text style={styles.phaseDates}>
                          {phase.startDate} - {phase.endDate}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.phaseRight}>
                      {phase.status === "completed" ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#47f888"
                        />
                      ) : null}

                      {phase.status === "upcoming" ? (
                        <Ionicons
                          name="lock-closed"
                          size={18}
                          color="#9CA3AF"
                        />
                      ) : (
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#6B7280"
                        />
                      )}
                    </View>
                  </Pressable>

                  {userRole === "mentee" && (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert("Phase Options", "Choose an action", [
                          {
                            text: "Edit",
                            onPress: () => {
                              setEditingPhaseId(phase.id);
                              setNewPhaseName(phase.name);
                              setNewPhaseDescription("");
                              setNewPhaseStart(phase.startDate);
                              setNewPhaseEnd(phase.endDate);
                              setAddingPhase(true);
                            },
                          },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => {
                              Alert.alert(
                                "Delete Phase",
                                "Are you sure you want to delete this phase?",
                                [
                                  { text: "Cancel", style: "cancel" },
                                  {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => deletePhase(phase.id),
                                  },
                                ],
                              );
                            },
                          },
                          { text: "Cancel", style: "cancel" },
                        ]);
                      }}
                      style={styles.phaseMenuButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={16}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  )}
                </View>

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
                          ? { backgroundColor: "#47f888" }
                          : { backgroundColor: "#7C3AED" },
                        { width: `${progressPct}%` },
                      ]}
                    />
                  </View>
                </View>

                {isExpanded && !isLocked ? (
                  <View style={styles.phaseBody}>
                    {phase.tasks.map((task) => (
                      <View key={task.id} style={styles.taskRow}>
                        <Pressable
                          onPress={() => openTask(phase, task)}
                          style={({ pressed }) => [
                            styles.taskContent,
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

                        {userRole === "mentee" && (
                          <TouchableOpacity
                            onPress={() => {
                              Alert.alert("Task Options", "Choose an action", [
                                {
                                  text: "Edit",
                                  onPress: () => {
                                    setEditingTaskId(task.id);
                                    setEditingTaskPhaseId(phase.id);
                                    setNewTaskTitle(task.title);
                                    setNewTaskDueDate(task.dueDate);
                                    setNewTaskExpectedTimeValue(
                                      task.expectedTime?.value?.toString() ||
                                        "",
                                    );
                                    setNewTaskExpectedTimeUnit(
                                      task.expectedTime?.unit || "hours",
                                    );
                                    setNewTaskSkills(
                                      task.skills?.join(", ") || "",
                                    );
                                    setNewTaskResources(task.resources || []);
                                    setAddingTaskToPhaseId(phase.id);
                                  },
                                },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: () => {
                                    Alert.alert(
                                      "Delete Task",
                                      "Are you sure you want to delete this task?",
                                      [
                                        { text: "Cancel", style: "cancel" },
                                        {
                                          text: "Delete",
                                          style: "destructive",
                                          onPress: () =>
                                            deleteTask(phase.id, task.id),
                                        },
                                      ],
                                    );
                                  },
                                },
                                { text: "Cancel", style: "cancel" },
                              ]);
                            }}
                            style={styles.taskMenuButton}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="ellipsis-vertical"
                              size={14}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                    {userRole === "mentee" && (
                      <Pressable
                        onPress={() => setAddingTaskToPhaseId(phase.id)}
                        style={({ pressed }) => [
                          styles.addTaskButton,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Ionicons name="add" size={18} color="#FF3B89" />
                        <Text style={styles.addTaskButtonText}>Add Task</Text>
                      </Pressable>
                    )}
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
          animationType="fade"
          onRequestClose={closeTask}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeTask} />
            <View style={styles.modalCenterContainer}>
              <View
                style={[
                  styles.modalPopupContent,
                  {
                    maxHeight: "90%",
                    paddingHorizontal: 28,
                    paddingVertical: 32,
                  },
                ]}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  {/* Status chip */}
                  <View style={{ alignItems: "center", marginBottom: 10 }}>
                    <View
                      style={[
                        styles.statusChip,
                        {
                          borderColor: taskStatusColor(
                            activeTask?.status ?? "pending",
                          ),
                        },
                      ]}
                    >
                      <Ionicons
                        name={taskStatusIcon(activeTask?.status ?? "pending")}
                        size={16}
                        color={taskStatusColor(activeTask?.status ?? "pending")}
                      />
                      <Text
                        style={[
                          styles.statusChipText,
                          {
                            color: taskStatusColor(
                              activeTask?.status ?? "pending",
                            ),
                          },
                        ]}
                      >
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
                          placeholderTextColor="#6B7280"
                        />
                        <Pressable
                          style={styles.primaryBtn}
                          onPress={() => {
                            if (!activePhase || !activeTask) return;
                            updateTaskDescription(
                              activePhase.id,
                              activeTask.id,
                              draftDesc.trim(),
                            );
                          }}
                        >
                          <Text style={styles.primaryBtnText}>
                            Save Description
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      <Text style={styles.bodyText}>
                        {activeTask?.description || "No description."}
                      </Text>
                    )}

                    {/* Skills Required */}
                    {activeTask?.skills && activeTask.skills.length > 0 && (
                      <View style={{ marginTop: 16 }}>
                        <Text style={[styles.cardHeading, { marginBottom: 8 }]}>
                          Skills Required
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 8,
                          }}
                        >
                          {activeTask.skills.map((skill, index) => (
                            <View key={index} style={styles.skillBubble}>
                              <Text style={styles.skillBubbleText}>
                                {skill}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Expected Time */}
                    {activeTask?.expectedTime && (
                      <View style={{ marginTop: 16 }}>
                        <Text style={[styles.cardHeading, { marginBottom: 4 }]}>
                          Expected Time
                        </Text>
                        <Text style={styles.bodyText}>
                          {activeTask.expectedTime.value}{" "}
                          {activeTask.expectedTime.unit}
                        </Text>
                      </View>
                    )}

                    {/* Resources */}
                    {activeTask?.resources &&
                      activeTask.resources.length > 0 && (
                        <View style={{ marginTop: 16 }}>
                          <Text
                            style={[styles.cardHeading, { marginBottom: 8 }]}
                          >
                            Resources
                          </Text>
                          <View style={{ gap: 8 }}>
                            {activeTask.resources.map((resource, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  if (resource.type === "link") {
                                    // Open link (would need Linking from react-native)
                                    Alert.alert(
                                      "Open Link",
                                      `Open ${resource.value}?`,
                                    );
                                  } else {
                                    // Handle file download/view
                                    Alert.alert(
                                      "File",
                                      `File: ${resource.fileInfo?.name || resource.label}\nSize: ${(resource.fileInfo?.size || 0) / 1024} KB`,
                                    );
                                  }
                                }}
                                style={styles.resourceItem}
                              >
                                <Ionicons
                                  name={
                                    resource.type === "link"
                                      ? "link"
                                      : "document"
                                  }
                                  size={16}
                                  color="#7C3AED"
                                />
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.resourceText}>
                                    {resource.fileInfo?.name ||
                                      resource.label ||
                                      (resource.type === "link"
                                        ? "Link"
                                        : "File")}
                                  </Text>
                                  {resource.fileInfo?.size && (
                                    <Text
                                      style={{ fontSize: 12, color: "#6B7280" }}
                                    >
                                      {(resource.fileInfo.size / 1024).toFixed(
                                        1,
                                      )}{" "}
                                      KB
                                    </Text>
                                  )}
                                </View>
                                <Ionicons
                                  name="chevron-forward"
                                  size={16}
                                  color="#6B7280"
                                />
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}

                    <View style={styles.metaRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text style={styles.metaText}>
                        Due: {activeTask?.dueDate}
                      </Text>

                      <Ionicons
                        name="ribbon-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text
                        style={[
                          styles.metaText,
                          { color: "#7C3AED", fontWeight: "800" },
                        ]}
                      >
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
                          placeholderTextColor="#6B7280"
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
                            <Text style={styles.secondaryBtnText}>
                              Add Attachment
                            </Text>
                          </Pressable>

                          <Pressable
                            style={styles.primaryBtn}
                            onPress={() => {
                              if (!activePhase || !activeTask) return;
                              submitTask(
                                activePhase.id,
                                activeTask.id,
                                draftResponse.trim(),
                              );
                            }}
                          >
                            <Text style={styles.primaryBtnText}>
                              {activeTask?.status === "submitted"
                                ? "Resubmit"
                                : "Submit"}
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

                    {activeTask?.attachments &&
                    activeTask.attachments.length > 0 ? (
                      <View style={{ gap: 10, marginTop: 8 }}>
                        {activeTask.attachments.map((a) => (
                          <View key={a.id} style={styles.fileRow}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                flex: 1,
                              }}
                            >
                              <Ionicons
                                name="document-outline"
                                size={18}
                                color="#6B7280"
                              />
                              <View style={{ flex: 1 }}>
                                <Text style={styles.fileName}>{a.name}</Text>
                                <Text style={styles.fileSize}>
                                  {a.sizeLabel}
                                </Text>
                              </View>
                            </View>

                            {/* download icon placeholder */}
                            <Pressable onPress={() => {}}>
                              <Ionicons
                                name="download-outline"
                                size={18}
                                color="#2563EB"
                              />
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
                        placeholderTextColor="#6B7280"
                      />

                      <View style={styles.reviewBtnRow}>
                        <Pressable
                          style={styles.rejectBtn}
                          onPress={() => {
                            if (!activePhase || !activeTask) return;
                            reviewTask(
                              activePhase.id,
                              activeTask.id,
                              "rejected",
                              draftFeedback.trim(),
                            );
                            closeTask();
                          }}
                        >
                          <Text style={styles.rejectBtnText}>Reject</Text>
                        </Pressable>

                        <Pressable
                          style={styles.approveBtn}
                          onPress={() => {
                            if (!activePhase || !activeTask) return;
                            reviewTask(
                              activePhase.id,
                              activeTask.id,
                              "approved",
                              draftFeedback.trim(),
                            );
                            closeTask();
                          }}
                        >
                          <Text style={styles.approveBtnText}>Accept</Text>
                        </Pressable>
                      </View>

                      {activeTask?.reviewedAt ? (
                        <Text style={styles.smallMuted}>
                          Reviewed on {activeTask.reviewedAt}
                        </Text>
                      ) : null}
                    </View>
                  ) : // Mentee sees feedback if exists
                  activeTask?.mentorFeedback ? (
                    <View style={styles.modalCard}>
                      <Text style={styles.cardHeading}>Mentor Feedback</Text>
                      <Text style={styles.bodyText}>
                        {activeTask.mentorFeedback}
                      </Text>
                      {activeTask.reviewedAt ? (
                        <Text style={styles.smallMuted}>
                          Reviewed on {activeTask.reviewedAt}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}

                  {/* Close */}
                  <Pressable
                    onPress={closeTask}
                    style={[
                      styles.secondaryBtn,
                      { marginTop: 10, justifyContent: "center" },
                    ]}
                  >
                    <Text style={styles.secondaryBtnText}>Close</Text>
                  </Pressable>
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for adding a new phase */}
        <Modal visible={addingPhase} transparent animationType="fade">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalOverlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setAddingPhase(false)}
              />
              <View style={styles.modalCenterContainer}>
                <View style={styles.modalPopupContent}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    <Text style={styles.modalTitle}>
                      {editingPhaseId ? "Edit Phase" : "Add New Phase"}
                    </Text>

                    <Text style={styles.label}>Phase Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Advanced Skills"
                      value={newPhaseName}
                      onChangeText={setNewPhaseName}
                      placeholderTextColor="#6B7280"
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Phase description"
                      placeholderTextColor="#6B7280"
                      value={newPhaseDescription}
                      onChangeText={setNewPhaseDescription}
                      multiline
                    />

                    <Text style={styles.label}>Start Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={newPhaseStart}
                      onChangeText={setNewPhaseStart}
                    />
                    <Text>
                      {newPhaseStart ? newPhaseStart : "Select Start Date"}
                    </Text>

                    <Text style={styles.label}>End Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={newPhaseEnd}
                      onChangeText={setNewPhaseEnd}
                    />

                    <View style={styles.rowGap}>
                      <Pressable
                        style={styles.primaryBtn}
                        onPress={() => {
                          if (newPhaseName.trim()) {
                            if (editingPhaseId) {
                              editPhase(
                                editingPhaseId,
                                newPhaseName,
                                newPhaseStart,
                                newPhaseEnd,
                              );
                            } else {
                              addPhase(
                                newPhaseName,
                                newPhaseStart,
                                newPhaseEnd,
                              );
                            }
                            setAddingPhase(false);
                            setEditingPhaseId(null);
                            setNewPhaseName("");
                            setNewPhaseDescription("");
                            setNewPhaseStart("");
                            setNewPhaseEnd("");
                          }
                        }}
                      >
                        <Text style={styles.primaryBtnText}>
                          {editingPhaseId ? "Update Phase" : "Add Phase"}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.secondaryBtn}
                        onPress={() => {
                          setAddingPhase(false);
                          setEditingPhaseId(null);
                          setNewPhaseName("");
                          setNewPhaseDescription("");
                          setNewPhaseStart("");
                          setNewPhaseEnd("");
                        }}
                      >
                        <Text style={styles.secondaryBtnText}>Cancel</Text>
                      </Pressable>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Modal for adding a new task */}
        <Modal visible={!!addingTaskToPhaseId} transparent animationType="fade">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalOverlay}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setAddingTaskToPhaseId(null)}
              />
              <View style={styles.modalCenterContainer}>
                <View style={styles.modalPopupContent}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    <Text style={styles.modalTitle}>
                      {editingTaskId ? "Edit Task" : "Add New Task"}
                    </Text>
                    <Text style={styles.label}>Task Title</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Complete project"
                      value={newTaskTitle}
                      onChangeText={setNewTaskTitle}
                      placeholderTextColor="#6B7280"
                    />
                    <Text style={styles.label}>Due Date</Text>*{" "}
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={newTaskDueDate}
                      onChangeText={setNewTaskDueDate}
                      placeholderTextColor="#6B7280"
                    />
                    <Text style={styles.label}>Expected Time Required</Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TextInput
                        style={[styles.input]}
                        placeholder="e.g. 2"
                        value={newTaskExpectedTimeValue}
                        onChangeText={setNewTaskExpectedTimeValue}
                        keyboardType="numeric"
                        placeholderTextColor="#6B7280"
                      />{" "}
                      {/* was styles.input */}
                      <View>
                        <Pressable
                          style={styles.input}
                          onPress={() => setShowUnitPicker(true)}
                        >
                          <Text>
                            {newTaskExpectedTimeUnit
                              ? newTaskExpectedTimeUnit
                                  .charAt(0)
                                  .toUpperCase() +
                                newTaskExpectedTimeUnit.slice(1)
                              : "Select Unit"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    <Text style={styles.label}>Skills Required</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. JavaScript, React, Problem Solving"
                      placeholderTextColor="#6B7280"
                      value={newTaskSkills}
                      onChangeText={setNewTaskSkills}
                      multiline
                    />
                    {/* 
              <View style={styles.skillsContainer}>
                <View style={styles.skillsWrapper}>
                  {skills.map((skill, index) => (
                    <View key={index} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                      <Pressable
                        onPress={() => {
                          setSkills(skills.filter((_, i) => i !== index));
                        }}
                      >
                        <Text style={styles.removeSkill}>×</Text>
                      </Pressable>
                    </View>
                  ))}

                  <TextInput
                    value={skillInput}
                    onChangeText={setSkillInput}
                    placeholder="Add skill..."
                    style={styles.skillInput}
                    onSubmitEditing={() => {
                      if (skillInput.trim()) {
                        setSkills([...skills, skillInput.trim()]);
                        setSkillInput("");
                      }
                    }}
                  />
                </View>
              </View> */}
                    <Modal
                      visible={showUnitPicker}
                      transparent
                      animationType="fade"
                    >
                      <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setShowUnitPicker(false)}
                      >
                        <View style={styles.modalPopupContent}>
                          {["hours", "days", "weeks"].map((unit) => (
                            <Pressable
                              key={unit}
                              style={{ padding: 12 }}
                              onPress={() => {
                                setNewTaskExpectedTimeUnit(unit as any);
                                setShowUnitPicker(false);
                              }}
                            >
                              <Text style={{ fontSize: 16 }}>
                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                      </Pressable>
                    </Modal>
                    <Text style={styles.label}>
                      Resources{" "}
                      {newTaskResources.length > 0 &&
                        `(${newTaskResources.length})`}
                    </Text>
                    <View style={{ gap: 8 }}>
                      {newTaskResources.map((resource, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: "#F9FAFB",
                            padding: 12,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                          }}
                        >
                          <Ionicons
                            name={
                              resource.type === "link" ? "link" : "document"
                            }
                            size={20}
                            color="#6B7280"
                          />
                          <View style={{ flex: 1 }}>
                            {resource.type === "link" ? (
                              <TextInput
                                style={[
                                  styles.input,
                                  {
                                    marginBottom: 0,
                                    borderWidth: 0,
                                    padding: 0,
                                  },
                                ]}
                                placeholder="https://..."
                                placeholderTextColor="#6B7280"
                                value={resource.value}
                                onChangeText={(text) => {
                                  const updated = [...newTaskResources];
                                  updated[index].value = text;
                                  setNewTaskResources(updated);
                                }}
                              />
                            ) : (
                              <View>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: "500",
                                    color: "#111827",
                                  }}
                                >
                                  {resource.fileInfo?.name || resource.label}
                                </Text>
                                {resource.fileInfo?.size && (
                                  <Text
                                    style={{ fontSize: 12, color: "#6B7280" }}
                                  >
                                    {(resource.fileInfo.size / 1024).toFixed(1)}{" "}
                                    KB
                                  </Text>
                                )}
                              </View>
                            )}
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              const updated = newTaskResources.filter(
                                (_, i) => i !== index,
                              );
                              setNewTaskResources(updated);
                            }}
                            style={{ padding: 4 }}
                          >
                            <Ionicons name="trash" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setNewTaskResources([
                              ...newTaskResources,
                              { type: "link", value: "", label: "Link" },
                            ]);
                          }}
                          style={[styles.secondaryBtn, { flex: 1 }]}
                        >
                          <Ionicons name="link" size={16} color="#111827" />
                          <Text style={styles.secondaryBtnText}>Add Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={async () => {
                            console.log("Upload File button pressed");
                            console.log("Platform.OS:", Platform.OS);
                            console.log(
                              "Constants.appOwnership:",
                              Constants.appOwnership,
                            );

                            if (Platform.OS === "web") {
                              // Web-compatible file upload using HTML5 file input
                              if (typeof document === "undefined") {
                                Alert.alert(
                                  "Error",
                                  "File upload is not available in this environment",
                                );
                                return;
                              }

                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "*/*";
                              input.multiple = false;

                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) {
                                  console.log(
                                    "File selected on web:",
                                    file.name,
                                  );

                                  // Create a data URL for the file
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const dataUrl = event.target
                                      ?.result as string;
                                    const newResource = {
                                      type: "file" as const,
                                      value: dataUrl,
                                      label: file.name,
                                      fileInfo: {
                                        name: file.name,
                                        size: file.size,
                                        uri: dataUrl,
                                        mimeType: file.type,
                                      },
                                    };

                                    setNewTaskResources((prev) => {
                                      const updated = [...prev, newResource];
                                      console.log(
                                        "Updated resources array length:",
                                        updated.length,
                                      );
                                      return updated;
                                    });

                                    Alert.alert(
                                      "File Added",
                                      `Successfully added: ${file.name}`,
                                    );
                                  };

                                  reader.readAsDataURL(file);
                                }
                              };

                              input.click();
                              return;
                            }

                            // Check if running on Expo Go (limited native module support)
                            const isExpoGo =
                              !Constants.appOwnership ||
                              Constants.appOwnership === "expo";
                            console.log("isExpoGo:", isExpoGo);

                            if (isExpoGo) {
                              Alert.alert(
                                "Limited Support",
                                "File upload has limited support in Expo Go. For full functionality, please use a development build or standalone app.",
                                [
                                  {
                                    text: "Continue Anyway",
                                    onPress: () => pickDocument(),
                                  },
                                  { text: "Cancel", style: "cancel" },
                                ],
                              );
                              return;
                            }

                            await pickDocument();

                            async function pickDocument() {
                              try {
                                console.log("Opening document picker...");
                                Alert.alert(
                                  "Opening",
                                  "File picker should open now...",
                                );

                                const result =
                                  await DocumentPicker.getDocumentAsync({
                                    type: "*/*",
                                  });

                                console.log("Document picker result:", result);

                                if (result.type === "success") {
                                  console.log(
                                    "File selected successfully:",
                                    result.name,
                                  );
                                  const newResource = {
                                    type: "file" as const,
                                    value: result.uri,
                                    label: result.name,
                                    fileInfo: {
                                      name: result.name,
                                      size: result.size,
                                      uri: result.uri,
                                      mimeType: result.mimeType,
                                    },
                                  };
                                  console.log("Adding resource:", newResource);
                                  setNewTaskResources((prev) => {
                                    const updated = [...prev, newResource];
                                    console.log(
                                      "Updated resources array length:",
                                      updated.length,
                                    );
                                    return updated;
                                  });
                                  Alert.alert(
                                    "File Added",
                                    `Successfully added: ${result.name}`,
                                  );
                                } else if (result.type === "cancel") {
                                  console.log(
                                    "Document picker cancelled by user",
                                  );
                                  Alert.alert(
                                    "Cancelled",
                                    "File selection was cancelled",
                                  );
                                } else {
                                  console.log("Document picker failed");
                                  Alert.alert("Error", "Failed to select file");
                                }
                              } catch (err) {
                                console.error("Document picker error:", err);
                                Alert.alert(
                                  "Error",
                                  `Failed to pick document: ${err?.message || "Unknown error"}`,
                                );
                              }
                            }
                          }}
                          style={[styles.secondaryBtn, { flex: 1 }]}
                        >
                          <Ionicons name="document" size={16} color="#111827" />
                          <Text style={styles.secondaryBtnText}>
                            Upload File
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.rowGap}>
                      <Pressable
                        style={styles.primaryBtn}
                        onPress={() => {
                          if (newTaskTitle.trim() && addingTaskToPhaseId) {
                            const expectedTime = newTaskExpectedTimeValue.trim()
                              ? {
                                  value: parseInt(newTaskExpectedTimeValue),
                                  unit: newTaskExpectedTimeUnit,
                                }
                              : undefined;

                            const skills = newTaskSkills.trim()
                              ? newTaskSkills
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((s) => s.length > 0)
                              : undefined;

                            //      const skillsData = skills.length > 0 ? skills : undefined;

                            if (editingTaskId) {
                              editTask(
                                addingTaskToPhaseId,
                                editingTaskId,
                                newTaskTitle,
                                newTaskDueDate,
                                expectedTime,
                                skills,
                                newTaskResources.length > 0
                                  ? newTaskResources
                                  : undefined,
                              );
                            } else {
                              addTaskToPhase(
                                addingTaskToPhaseId,
                                newTaskTitle,
                                newTaskDueDate,
                                expectedTime,
                                skills,
                                newTaskResources.length > 0
                                  ? newTaskResources
                                  : undefined,
                              );
                            }
                            setAddingTaskToPhaseId(null);
                            setEditingTaskId(null);
                            setEditingTaskPhaseId(null);
                            setNewTaskTitle("");
                            setNewTaskDueDate("");
                            setNewTaskExpectedTimeValue("");
                            setNewTaskExpectedTimeUnit("hours");
                            setNewTaskSkills("");
                            setNewTaskResources([]);
                          }
                        }}
                      >
                        <Text style={styles.primaryBtnText}>
                          {editingTaskId ? "Update Task" : "Add Task"}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.secondaryBtn}
                        onPress={() => {
                          setAddingTaskToPhaseId(null);
                          setEditingTaskId(null);
                          setEditingTaskPhaseId(null);
                          setNewTaskTitle("");
                          setNewTaskDueDate("");
                          setNewTaskExpectedTimeValue("");
                          setNewTaskExpectedTimeUnit("hours");
                          setNewTaskSkills("");
                          setNewTaskResources([]);
                        }}
                      >
                        <Text style={styles.secondaryBtnText}>Cancel</Text>
                      </Pressable>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </>
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

function taskStatusIcon(
  status: Task["status"],
): keyof typeof Ionicons.glyphMap {
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
      return "#47f888";
    case "submitted":
      return "#FF3B89";
    case "rejected":
      return "#DC2626";
    case "pending":
    default:
      return "#646c7c";
  }
}

function StatCard(props: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  progress?: number; // percentage 0-100
  progressMax?: number; // max value for display
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statRow}>
        <View style={[styles.iconWrap, { backgroundColor: props.iconBg }]}>
          <Ionicons name={props.icon} size={22} color="#FF3B89" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.statLabel}>{props.label}</Text>
          <Text style={styles.statValue}>{props.value}</Text>
        </View>
      </View>
      {typeof props.progress === "number" && (
        <>
          <View style={[styles.progressBar, { marginTop: 8 }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${props.progress}%`,
                  backgroundColor: props.iconColor,
                },
              ]}
            />
          </View>
          <Text
            style={[styles.progressLabel, { marginTop: 4, textAlign: "right" }]}
          >
            {props.progress}%{" "}
            {props.progressMax ? `(${props.progressMax} XP goal)` : ""}
          </Text>
        </>
      )}
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
  statValue: { fontSize: 22, fontWeight: "800", marginTop: 2 },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%" },
  progressLabel: { fontSize: 11, color: "#6B7280" },

  phaseCardBase: {
    backgroundColor: "#0B0C67",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  phaseCardCompleted: { borderColor: "#47f888" },
  phaseCardCurrent: { borderColor: "#C4B5FD" },
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
    backgroundColor: "#E5E7EB",
  },
  bubbleCompleted: { backgroundColor: "#DCFCE7" },
  bubbleCurrent: { backgroundColor: "#EDE9FE" },
  bubbleUpcoming: { backgroundColor: "#F3F4F6" },
  phaseIndexText: { fontWeight: "800", color: "#111827" },

  phaseTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  phaseTitle: { fontSize: 16, fontWeight: "800", color: "white" },
  phaseDates: { fontSize: 12, color: "#E5E7EB", marginTop: 2 },

  badgeActive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#FFE4EF",
    alignSelf: "flex-start",
  },
  badgeActiveText: { fontSize: 12, fontWeight: "800", color: "#FF3B89" },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  small: { fontSize: 13, color: "white" },
  smallMuted: { fontSize: 13, color: "#E5E7EB" },
  bold: { fontWeight: "800" },

  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },

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
    borderColor: "#FF3B89",
    backgroundColor: "#fefdfe",
  },
  addTaskButtonText: {
    fontSize: 13,
    color: "#FF3B89",
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
  xpText: { color: "#FF3B89", fontWeight: "800" },

  pressed: { opacity: 0.9 },

  // Modal
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },

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

  modalContent: {
    paddingBottom: 24, // lets you scroll past the last button
  },
  modalGrabber: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginBottom: 10,
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

  // New styles for task requirements
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
  skillsContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
  },

  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },

  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  skillText: {
    color: "#5B21B6",
    fontSize: 13,
    marginRight: 6,
  },

  removeSkill: {
    color: "#5B21B6",
    fontWeight: "bold",
  },

  skillInput: {
    minWidth: 80,
    padding: 4,
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
