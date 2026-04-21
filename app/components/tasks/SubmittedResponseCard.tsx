import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Phase, Task } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type UserRole = "mentor" | "mentee";

type SubmittedResponseCardProps = {
  activeTask: Task | null;
  activePhase: Phase | null;
  userRole: UserRole;
  draftResponse: string;
  setDraftResponse: React.Dispatch<React.SetStateAction<string>>;
  addMockAttachment: (phaseId: string, taskId: string) => void;
  submitTask: (phaseId: string, taskId: string, response: string) => void;
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
  );
}
