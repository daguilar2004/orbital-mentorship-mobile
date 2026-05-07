import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { styles } from "../../app/styles/homeStyles";
import TaskFormActions from "./TaskFormActions";
import TaskFormFields from "./TaskFormFields";
import TaskResourcesSection from "./TaskResourcesSection";

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

type TaskFormModalProps = {
  addingTaskToPhaseId: string | null;
  editingTaskId: string | null;
  closeTaskModal: () => void;
  handleSaveTask: () => void;

  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  newTaskDueDate: string;
  setNewTaskDueDate: React.Dispatch<React.SetStateAction<string>>;
  newTaskExpectedTimeValue: string;
  setNewTaskExpectedTimeValue: React.Dispatch<React.SetStateAction<string>>;
  newTaskExpectedTimeUnit: "hours" | "days" | "weeks";
  setNewTaskExpectedTimeUnit: React.Dispatch<
    React.SetStateAction<"hours" | "days" | "weeks">
  >;
  newTaskSkills: string;
  setNewTaskSkills: React.Dispatch<React.SetStateAction<string>>;
  newTaskResources: TaskResource[];
  setNewTaskResources: React.Dispatch<React.SetStateAction<TaskResource[]>>;
  showUnitPicker: boolean;
  setShowUnitPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TaskFormModal({
  addingTaskToPhaseId,
  editingTaskId,
  closeTaskModal,
  handleSaveTask,
  ...props
}: TaskFormModalProps) {
  return (
    <Modal visible={!!addingTaskToPhaseId} transparent animationType="fade">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeTaskModal} />

          <View style={styles.modalCenterContainer}>
            <View style={styles.modalPopupContent}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.modalTitle}>
                  {editingTaskId ? "Edit Task" : "Add New Task"}
                </Text>

                <TaskFormFields {...props} />

                <TaskResourcesSection {...props} />

                <TaskFormActions
                  editingTaskId={editingTaskId}
                  onSave={handleSaveTask}
                  onCancel={closeTaskModal}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
