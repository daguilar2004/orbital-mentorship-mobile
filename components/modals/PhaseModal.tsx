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
import { styles } from "../../styles/homeStyles";
import PhaseFormFields from "./PhaseFormFields";
import PhaseModalActions from "./PhaseModalActions";

type PhaseModalProps = {
  addingPhase: boolean;
  editingPhaseId: string | null;
  newPhaseName: string;
  setNewPhaseName: React.Dispatch<React.SetStateAction<string>>;
  newPhaseDescription: string;
  setNewPhaseDescription: React.Dispatch<React.SetStateAction<string>>;
  newPhaseStart: string;
  setNewPhaseStart: React.Dispatch<React.SetStateAction<string>>;
  newPhaseEnd: string;
  setNewPhaseEnd: React.Dispatch<React.SetStateAction<string>>;
  setAddingPhase: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingPhaseId: React.Dispatch<React.SetStateAction<string | null>>;
  addPhase: (name: string, startDate: string, endDate: string) => void;
  editPhase: (
    id: string,
    name: string,
    startDate: string,
    endDate: string,
  ) => void;
};

export default function PhaseModal({
  addingPhase,
  editingPhaseId,
  newPhaseName,
  setNewPhaseName,
  newPhaseDescription,
  setNewPhaseDescription,
  newPhaseStart,
  setNewPhaseStart,
  newPhaseEnd,
  setNewPhaseEnd,
  setAddingPhase,
  setEditingPhaseId,
  addPhase,
  editPhase,
}: PhaseModalProps) {
  const resetPhaseForm = () => {
    setAddingPhase(false);
    setEditingPhaseId(null);
    setNewPhaseName("");
    setNewPhaseDescription("");
    setNewPhaseStart("");
    setNewPhaseEnd("");
  };

  const handleSave = () => {
    if (!newPhaseName.trim()) return;

    if (editingPhaseId) {
      editPhase(editingPhaseId, newPhaseName, newPhaseStart, newPhaseEnd);
    } else {
      addPhase(newPhaseName, newPhaseStart, newPhaseEnd);
    }

    resetPhaseForm();
  };

  return (
    <Modal visible={addingPhase} transparent animationType="fade">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={resetPhaseForm} />

          <View style={styles.modalCenterContainer}>
            <View style={styles.modalPopupContent}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.modalTitle}>
                  {editingPhaseId ? "Edit Phase" : "Add New Phase"}
                </Text>

                <PhaseFormFields
                  newPhaseName={newPhaseName}
                  setNewPhaseName={setNewPhaseName}
                  newPhaseDescription={newPhaseDescription}
                  setNewPhaseDescription={setNewPhaseDescription}
                  newPhaseStart={newPhaseStart}
                  setNewPhaseStart={setNewPhaseStart}
                  newPhaseEnd={newPhaseEnd}
                  setNewPhaseEnd={setNewPhaseEnd}
                />

                <PhaseModalActions
                  editingPhaseId={editingPhaseId}
                  onSave={handleSave}
                  onCancel={resetPhaseForm}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
