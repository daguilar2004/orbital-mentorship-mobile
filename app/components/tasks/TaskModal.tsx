import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Phase, Task, UserRole } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";
import AttachedFilesCard from "./AttachedFilesCard";
import MentorFeedbackCard from "./MentorFeedbackCard";
import SubmittedResponseCard from "./SubmittedResponseCard";
import TaskDetailsCard from "./TaskDetailsCard";
import TaskReviewCard from "./TaskReviewCard";
import TaskStatusChip from "./TaskStatusChip";

type TaskModalProps = {
  activeTask: Task | null;
  activePhase: Phase | null;
  userRole: UserRole;
  draftDesc: string;
  setDraftDesc: React.Dispatch<React.SetStateAction<string>>;
  draftResponse: string;
  setDraftResponse: React.Dispatch<React.SetStateAction<string>>;
  draftFeedback: string;
  setDraftFeedback: React.Dispatch<React.SetStateAction<string>>;
  closeTask: () => void;
  updateTaskDescription: (taskId: string, description: string) => void;
  submitTask: (taskId: string, response: string) => void;
  addMockAttachment: (phaseId: string, taskId: string) => void;
  reviewTask: (
    taskId: string,
    decision: "approved" | "rejected",
    feedback: string,
  ) => void;
  taskStatusColor: (status: Task["status"]) => string;
  taskStatusIcon: (
    status: Task["status"],
  ) => keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  statusLabel: (status: Task["status"]) => string;
};

export default function TaskModal({
  activeTask,
  activePhase,
  userRole,
  draftDesc,
  setDraftDesc,
  draftResponse,
  setDraftResponse,
  draftFeedback,
  setDraftFeedback,
  closeTask,
  updateTaskDescription,
  submitTask,
  addMockAttachment,
  reviewTask,
  taskStatusColor,
  taskStatusIcon,
  statusLabel,
}: TaskModalProps) {
  return (
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
              <TaskStatusChip
                activeTask={activeTask}
                taskStatusColor={taskStatusColor}
                taskStatusIcon={taskStatusIcon}
                statusLabel={statusLabel}
              />

              <Text style={styles.modalTitle}>{activeTask?.title}</Text>

              <TaskDetailsCard
                activeTask={activeTask}
                activePhase={activePhase}
                userRole={userRole}
                draftDesc={draftDesc}
                setDraftDesc={setDraftDesc}
                updateTaskDescription={updateTaskDescription}
              />

              <SubmittedResponseCard
                activeTask={activeTask}
                activePhase={activePhase}
                userRole={userRole}
                draftResponse={draftResponse}
                setDraftResponse={setDraftResponse}
                addMockAttachment={addMockAttachment}
                submitTask={submitTask}
              />

              <AttachedFilesCard activeTask={activeTask} />

              {userRole === "mentor" ? (
                <TaskReviewCard
                  activeTask={activeTask}
                  activePhase={activePhase}
                  draftFeedback={draftFeedback}
                  setDraftFeedback={setDraftFeedback}
                  reviewTask={reviewTask}
                  closeTask={closeTask}
                />
              ) : activeTask?.mentorFeedback ? (
                <MentorFeedbackCard activeTask={activeTask} />
              ) : null}

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
  );
}
