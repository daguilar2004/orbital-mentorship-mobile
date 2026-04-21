import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Phase, Task } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type TaskReviewCardProps = {
  activeTask: Task | null;
  activePhase: Phase | null;
  draftFeedback: string;
  setDraftFeedback: React.Dispatch<React.SetStateAction<string>>;
  reviewTask: (
    phaseId: string,
    taskId: string,
    decision: "approved" | "rejected",
    feedback: string,
  ) => void;
  closeTask: () => void;
};

export default function TaskReviewCard({
  activeTask,
  activePhase,
  draftFeedback,
  setDraftFeedback,
  reviewTask,
  closeTask,
}: TaskReviewCardProps) {
  return (
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
  );
}
