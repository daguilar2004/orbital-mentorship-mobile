import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Phase, UserRole } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type PhaseHeaderProps = {
  phase: Phase;
  idx: number;
  isExpanded: boolean;
  isLocked: boolean;
  userRole: UserRole;
  togglePhase: (phase: Phase) => void;
  setEditingPhaseId: React.Dispatch<React.SetStateAction<string | null>>;
  setNewPhaseName: React.Dispatch<React.SetStateAction<string>>;
  setNewPhaseDescription: React.Dispatch<React.SetStateAction<string>>;
  setNewPhaseStart: React.Dispatch<React.SetStateAction<string>>;
  setNewPhaseEnd: React.Dispatch<React.SetStateAction<string>>;
  setAddingPhase: React.Dispatch<React.SetStateAction<boolean>>;
  deletePhase: (id: string) => void;
};

export default function PhaseHeader({
  phase,
  idx,
  isExpanded,
  isLocked,
  userRole,
  togglePhase,
  setEditingPhaseId,
  setNewPhaseName,
  setNewPhaseDescription,
  setNewPhaseStart,
  setNewPhaseEnd,
  setAddingPhase,
  deletePhase,
}: PhaseHeaderProps) {
  return (
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
              phase.status === "completed" && styles.bubbleCompleted,
              phase.status === "upcoming" && styles.bubbleUpcoming,
            ]}
          >
            <Text style={styles.phaseIndexText}>{idx + 1}</Text>
          </View>

          <View style={{ flex: 1 }}>
            {phase.status === "current" && (
              <View style={styles.badgeActive}>
                <Text style={styles.badgeActiveText}>Active</Text>
              </View>
            )}

            <Text style={styles.phaseTitle}>{phase.name}</Text>

            <Text style={styles.phaseDates}>
              {phase.startDateFormatted} - {phase.endDateFormatted}
            </Text>
          </View>
        </View>

        <View style={styles.phaseRight}>
          {phase.status === "completed" && (
            <Ionicons name="checkmark-circle" size={20} color="#0b0c67" />
          )}

          {isLocked ? (
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

      <TouchableOpacity
        style={styles.phaseMenuButton}
        onPress={() => {
          Alert.alert("Phase Options", "Choose an action", [
            {
              text: "Edit",
              onPress: () => {
                setEditingPhaseId(phase.id);
                setNewPhaseName(phase.name);
                setNewPhaseDescription("");
                setNewPhaseStart(phase.startDate.split("T")[0]);
                setNewPhaseEnd(phase.endDate.split("T")[0]);
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
      >
        <Ionicons name="ellipsis-vertical" size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}
