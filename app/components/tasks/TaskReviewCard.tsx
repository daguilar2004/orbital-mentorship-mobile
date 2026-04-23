import React from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Phase, Task } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type TaskReviewCardProps = {
  activeTask: Task | null;
  activePhase: Phase | null;
  draftFeedback: string;
  setDraftFeedback: React.Dispatch<React.SetStateAction<string>>;
  reviewTask: (
    taskId: string,
    decision: "approved" | "rejected",
    mentorFeedback: string,
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
          onPress={async () => {
            if (!activePhase || !activeTask) return;
            try {
              await Promise.resolve(
                reviewTask(activeTask.id, "rejected", draftFeedback.trim()),
              );
              Alert.alert("Task rejected", "The task was rejected.");
              closeTask();
            } catch {
              Alert.alert(
                "Review failed",
                "The task could not be rejected. Please try again.",
              );
            }
          }}
        >
          <Text style={styles.rejectBtnText}>Reject</Text>
        </Pressable>

        <Pressable
          style={styles.approveBtn}
          onPress={async () => {
            if (!activePhase || !activeTask) return;
            try {
              await Promise.resolve(
                reviewTask(activeTask.id, "approved", draftFeedback.trim()),
              );
              Alert.alert("Task accepted", "The task was accepted.");
              closeTask();
            } catch {
              Alert.alert(
                "Review failed",
                "The task could not be accepted. Please try again.",
              );
            }
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
