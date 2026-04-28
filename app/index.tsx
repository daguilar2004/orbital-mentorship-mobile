import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Phase, Task, useApp } from "./context/AppContext";
import { styles } from "./styles/homeStyles";

import PhaseModal from "./components/modals/PhaseModal";
import TaskFormModal from "./components/modals/TaskFormModal";
import PhasesSection from "./components/phases/PhasesSection";
import TaskModal from "./components/tasks/TaskModal";

type TaskResource = {
  type: "link" | "file";
  value: string;
  label?: string;
  fileInfo?: {
    name: string;
    size: number;
    uri: string;
    mimeType?: string;
  };
};

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

  const [addingPhase, setAddingPhase] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseDescription, setNewPhaseDescription] = useState("");
  const [newPhaseStart, setNewPhaseStart] = useState("");
  const [newPhaseEnd, setNewPhaseEnd] = useState("");
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

  const [addingTaskToPhaseId, setAddingTaskToPhaseId] = useState<string | null>(
    null,
  );
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskPhaseId, setEditingTaskPhaseId] = useState<string | null>(
    null,
  );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskExpectedTimeValue, setNewTaskExpectedTimeValue] = useState("");
  const [newTaskExpectedTimeUnit, setNewTaskExpectedTimeUnit] = useState<
    "hours" | "days" | "weeks"
  >("hours");
  const [newTaskSkills, setNewTaskSkills] = useState("");
  const [newTaskResources, setNewTaskResources] = useState<TaskResource[]>([]);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [draftDesc, setDraftDesc] = useState("");
  const [draftResponse, setDraftResponse] = useState("");
  const [draftFeedback, setDraftFeedback] = useState("");
  const [lastAutoExpandedPhaseId, setLastAutoExpandedPhaseId] = useState<
    string | null
  >(null);

  const xpPercent = Math.min(100, Math.round((totalXP / xpGoal) * 100));

  const currentPhase = useMemo(
    () => phases.find((p) => p.status === "current"),
    [phases],
  );

  useEffect(() => {
    const firstAccessiblePhase = phases.find((p) => p.status !== "upcoming");
    const phaseToExpand = currentPhase ?? firstAccessiblePhase;

    if (!phaseToExpand) return;

    if (lastAutoExpandedPhaseId !== phaseToExpand.id) {
      setExpanded(new Set([phaseToExpand.id]));
      setLastAutoExpandedPhaseId(phaseToExpand.id);
      return;
    }

    setExpanded((prev) => {
      if (prev.size > 0) return prev;
      return new Set([phaseToExpand.id]);
    });
  }, [currentPhase?.id, phases, lastAutoExpandedPhaseId]);

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

  function resetTaskForm() {
    setAddingTaskToPhaseId(null);
    setEditingTaskId(null);
    setEditingTaskPhaseId(null);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    setNewTaskExpectedTimeValue("");
    setNewTaskExpectedTimeUnit("hours");
    setNewTaskSkills("");
    setNewTaskResources([]);
    setShowUnitPicker(false);
  }

  function openTaskFormForPhase(phaseId: string) {
    resetTaskForm();
    setAddingTaskToPhaseId(phaseId);
  }

  async function handleSaveTask() {
    if (!newTaskTitle.trim()) {
      Alert.alert("Missing title", "Please enter a task title.");
      return;
    }

    if (!addingTaskToPhaseId) {
      Alert.alert("Task not ready", "Please reopen the task form and try again.");
      return;
    }

    const expectedTime = newTaskExpectedTimeValue.trim()
      ? {
          value: parseInt(newTaskExpectedTimeValue, 10),
          unit: newTaskExpectedTimeUnit,
        }
      : undefined;

    const skills =
      newTaskSkills.trim().length > 0
        ? newTaskSkills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : undefined;

    const resources =
      newTaskResources.length > 0 ? newTaskResources : undefined;

    try {
      if (editingTaskId) {
        await editTask(
          addingTaskToPhaseId,
          editingTaskId,
          newTaskTitle,
          newTaskDueDate,
          expectedTime,
          skills,
          resources,
        );
      } else {
        await addTaskToPhase(
          addingTaskToPhaseId,
          newTaskTitle,
          newTaskDueDate,
          expectedTime,
          skills,
          resources,
        );
      }

      Alert.alert(
        editingTaskId ? "Task updated" : "Task created",
        editingTaskId
          ? "Your task was updated successfully."
          : "Your task was added successfully.",
      );
      resetTaskForm();
    } catch {
      Alert.alert(
        editingTaskId ? "Task update failed" : "Task creation failed",
        "Your task could not be saved. Please try again.",
      );
    }
  }

  function handleEditTask(phase: Phase, task: Task) {
    setAddingTaskToPhaseId(phase.id);
    setEditingTaskId(task.id);
    setEditingTaskPhaseId(phase.id);
    setNewTaskTitle(task.title);
    setNewTaskDueDate(task.dueDate.split("T")[0]);

    // expected time (convert object → form state)
    setNewTaskExpectedTimeValue(task.expectedTime?.value?.toString() || "");
    setNewTaskExpectedTimeUnit(task.expectedTime?.unit || "days");

    // skills (array → string)
    setNewTaskSkills(task.skills?.join(", ") || "");

    setNewTaskResources(task.resources || []);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          {userRole === "mentee"
            ? "Continue your learning journey"
            : "Manage your mentees progress"}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="trophy"
          iconBg="#0b0c67"
          iconColor="#F3E8FF"
          label="Total XP"
          value={`${totalXP}`}
          progress={xpPercent}
          progressMax={xpGoal}
        />
        <StatCard
          icon="trending-up"
          iconBg="#0b0c67"
          iconColor="#F3E8FF"
          label="Progress"
          value={`${completedPhases}/${totalPhases}`}
        />
        <StatCard
          icon="flag"
          iconBg="#0b0c67"
          iconColor="#F3E8FF"
          label={userRole === "mentee" ? "Pending Tasks" : "Tasks to Review"}
          value={`${pendingTasksCount}`}
        />
      </View>

      <PhasesSection
        phases={phases}
        userRole={userRole}
        expanded={expanded}
        togglePhase={togglePhase}
        setAddingPhase={setAddingPhase}
        openTask={openTask}
        deleteTask={deleteTask}
        onEditTask={handleEditTask}
        openTaskFormForPhase={openTaskFormForPhase}
        setEditingPhaseId={setEditingPhaseId}
        setNewPhaseName={setNewPhaseName}
        setNewPhaseDescription={setNewPhaseDescription}
        setNewPhaseStart={setNewPhaseStart}
        setNewPhaseEnd={setNewPhaseEnd}
        deletePhase={deletePhase}
      />

      <TaskModal
        activeTask={activeTask}
        activePhase={activePhase}
        userRole={userRole}
        draftDesc={draftDesc}
        setDraftDesc={setDraftDesc}
        draftResponse={draftResponse}
        setDraftResponse={setDraftResponse}
        draftFeedback={draftFeedback}
        setDraftFeedback={setDraftFeedback}
        closeTask={closeTask}
        updateTaskDescription={updateTaskDescription}
        submitTask={submitTask}
        addMockAttachment={addMockAttachment}
        reviewTask={reviewTask}
        taskStatusColor={taskStatusColor}
        taskStatusIcon={taskStatusIcon}
        statusLabel={statusLabel}
      />

      <PhaseModal
        addingPhase={addingPhase}
        editingPhaseId={editingPhaseId}
        newPhaseName={newPhaseName}
        setNewPhaseName={setNewPhaseName}
        newPhaseDescription={newPhaseDescription}
        setNewPhaseDescription={setNewPhaseDescription}
        newPhaseStart={newPhaseStart}
        setNewPhaseStart={setNewPhaseStart}
        newPhaseEnd={newPhaseEnd}
        setNewPhaseEnd={setNewPhaseEnd}
        setAddingPhase={setAddingPhase}
        setEditingPhaseId={setEditingPhaseId}
        addPhase={addPhase}
        editPhase={editPhase}
      />

      <TaskFormModal
        addingTaskToPhaseId={addingTaskToPhaseId}
        editingTaskId={editingTaskId}
        closeTaskModal={resetTaskForm}
        handleSaveTask={handleSaveTask}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskDueDate={newTaskDueDate}
        setNewTaskDueDate={setNewTaskDueDate}
        newTaskExpectedTimeValue={newTaskExpectedTimeValue}
        setNewTaskExpectedTimeValue={setNewTaskExpectedTimeValue}
        newTaskExpectedTimeUnit={newTaskExpectedTimeUnit}
        setNewTaskExpectedTimeUnit={setNewTaskExpectedTimeUnit}
        newTaskSkills={newTaskSkills}
        setNewTaskSkills={setNewTaskSkills}
        newTaskResources={newTaskResources}
        setNewTaskResources={setNewTaskResources}
        showUnitPicker={showUnitPicker}
        setShowUnitPicker={setShowUnitPicker}
      />
    </ScrollView>
  );
}

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
      return "#0b0c67";
    case "submitted":
      return "#ff3b89";
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
  progress?: number;
  progressMax?: number;
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

      {typeof props.progress === "number" && (
        <>
          <View style={[styles.progressBar, { marginTop: 8 }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${props.progress}%`,
                  backgroundColor: "#0B0C67",
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
