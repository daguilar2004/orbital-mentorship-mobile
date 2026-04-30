import React from "react";
import { Text, TextInput } from "react-native";
import { styles } from "../../styles/homeStyles";

type PhaseFormFieldsProps = {
  newPhaseName: string;
  setNewPhaseName: React.Dispatch<React.SetStateAction<string>>;
  newPhaseDescription: string;
  setNewPhaseDescription: React.Dispatch<React.SetStateAction<string>>;
  newPhaseStart: string;
  setNewPhaseStart: React.Dispatch<React.SetStateAction<string>>;
  newPhaseEnd: string;
  setNewPhaseEnd: React.Dispatch<React.SetStateAction<string>>;
};

export default function PhaseFormFields({
  newPhaseName,
  setNewPhaseName,
  newPhaseDescription,
  setNewPhaseDescription,
  newPhaseStart,
  setNewPhaseStart,
  newPhaseEnd,
  setNewPhaseEnd,
}: PhaseFormFieldsProps) {
  return (
    <>
      <Text style={styles.label}>Phase Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Advanced Skills"
        value={newPhaseName}
        onChangeText={setNewPhaseName}
        placeholderTextColor="#6B7280"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Phase description"
        placeholderTextColor="#6B7280"
        value={newPhaseDescription}
        onChangeText={setNewPhaseDescription}
        multiline
      />

      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={newPhaseStart}
        onChangeText={setNewPhaseStart}
        placeholderTextColor="#6B7280"
      />
      <Text>{newPhaseStart ? newPhaseStart : "Select Start Date"}</Text>

      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={newPhaseEnd}
        onChangeText={setNewPhaseEnd}
        placeholderTextColor="#6B7280"
      />
    </>
  );
}
