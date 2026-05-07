import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Phase, Task, UserRole } from "../../app/context/AppContext";
import { styles } from "../../app/styles/homeStyles";
import PhaseCard from "./PhaseCard";

type PhasesSectionProps = {
  phases: Phase[];
  userRole: UserRole;
  expanded: Set<string>;
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

export default function PhasesSection({
  phases,
  userRole,
  expanded,
  togglePhase,
  setAddingPhase,
  ...handlers
}: PhasesSectionProps) {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Phases</Text>

        <Pressable
          onPress={() => setAddingPhase(true)}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Ionicons name="add-circle" size={24} color="#FF3B89" />
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        {phases.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            idx={idx}
            isExpanded={expanded.has(phase.id)}
            userRole={userRole}
            togglePhase={togglePhase}
            setAddingPhase={setAddingPhase}
            {...handlers}
          />
        ))}
      </View>
    </>
  );
}
