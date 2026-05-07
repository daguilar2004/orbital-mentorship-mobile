import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Phase, Task } from "../../app/context/AppContext";
import { styles } from "../../app/styles/homeStyles";

type UserRole = "mentor" | "mentee";

type SubmittedResponseCardProps = {
  activeTask: Task | null;
  activePhase: Phase | null;
  userRole: UserRole;
  draftResponse: string;
  setDraftResponse: React.Dispatch<React.SetStateAction<string>>;
  addMockAttachment: (phaseId: string, taskId: string) => void;
  submitTask: (taskId: string, response: string) => void;
};

export default function SubmittedResponseCard({
  activeTask,
  activePhase,
  userRole,
  draftResponse,
  setDraftResponse,
  addMockAttachment,
  submitTask,
}: SubmittedResponseCardProps) {
  return (
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
              <Text style={styles.secondaryBtnText}>Add Attachment</Text>
            </Pressable>

            <Pressable
              style={styles.primaryBtn}
              onPress={async () => {
                if (!activePhase || !activeTask) return;
                try {
                  await Promise.resolve(submitTask(activeTask.id, draftResponse));
                  Alert.alert("Task submitted", "Your response was submitted.");
                } catch {
                  Alert.alert(
                    "Submission failed",
                    "Your task could not be submitted. Please try again.",
                  );
                }
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
  );
}
