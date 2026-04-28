import React from "react";
import { View } from "react-native";
import { Phase, Task, UserRole } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";
import PhaseHeader from "./PhaseHeader";
import PhaseProgress from "./PhaseProgress";
import PhaseTaskList from "./PhaseTaskList";

type PhaseCardProps = {
  phase: Phase;
  idx: number;
  isExpanded: boolean;
  userRole: UserRole;
  togglePhase: (phase: Phase) => void;
  setAddingPhase: React.Dispatch<React.SetStateAction<boolean>>;
  openTask: (phase: Phase, task: Task) => void;
  deleteTask: (taskId: string) => void;
  onEditTask: (phase: Phase, task: Task) => void;
  openTaskFormForPhase: (phaseId: string) => void;
  setEditingPhaseId: React.Dispatch<React.SetStateAction<string | null>>;
  setNewPhaseName: React.Dispatch<React.SetStateAction<string>>;
  setNewPhaseDescription: React.Dispatch<React.SetStateAction<string>>;
  setNewPhaseStart: React.Dispatch<React.SetStateAction<string>>;
  setNewPhaseEnd: React.Dispatch<React.SetStateAction<string>>;
  deletePhase: (id: string) => void;
};

export default function PhaseCard({
  phase,
  idx,
  isExpanded,
  userRole,
  togglePhase,
  ...handlers
}: PhaseCardProps) {
  const isLocked = phase.status === "upcoming";

  const approvedCount = phase.tasks.filter(
    (t) => t.status === "approved",
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
    <View style={[styles.phaseCardBase, cardStyle]}>
      <PhaseHeader
        phase={phase}
        idx={idx}
        isExpanded={isExpanded}
        isLocked={isLocked}
        userRole={userRole}
        togglePhase={togglePhase}
        {...handlers}
      />

      <PhaseProgress
        approvedCount={approvedCount}
        totalTasks={totalTasks}
        progressPct={progressPct}
        status={phase.status}
      />

      {isExpanded && !isLocked && (
        <PhaseTaskList phase={phase} userRole={userRole} {...handlers} />
      )}
    </View>
  );
}
