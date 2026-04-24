import React from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../../styles/homeStyles";

type TaskFormFieldsProps = {
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
  showUnitPicker: boolean;
  setShowUnitPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TaskFormFields({
  newTaskTitle,
  setNewTaskTitle,
  newTaskDueDate,
  setNewTaskDueDate,
  newTaskExpectedTimeValue,
  setNewTaskExpectedTimeValue,
  newTaskExpectedTimeUnit,
  setNewTaskExpectedTimeUnit,
  newTaskSkills,
  setNewTaskSkills,
  showUnitPicker,
  setShowUnitPicker,
}: TaskFormFieldsProps) {
  return (
    <>
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Complete project"
        value={newTaskTitle}
        onChangeText={setNewTaskTitle}
        placeholderTextColor="#6B7280"
      />

      <Text style={styles.label}>Due Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={newTaskDueDate}
        onChangeText={setNewTaskDueDate}
        placeholderTextColor="#6B7280"
      />

      <Text style={styles.label}>Expected Time Required</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="e.g. 2"
          value={newTaskExpectedTimeValue}
          onChangeText={setNewTaskExpectedTimeValue}
          keyboardType="numeric"
          placeholderTextColor="#6B7280"
        />

        <View style={{ flex: 1 }}>
          <Pressable
            style={styles.input}
            onPress={() => setShowUnitPicker(true)}
          >
            <Text>
              {newTaskExpectedTimeUnit
                ? newTaskExpectedTimeUnit.charAt(0).toUpperCase() +
                  newTaskExpectedTimeUnit.slice(1)
                : "Select Unit"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.label}>Skills Required</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. JavaScript, React, Problem Solving"
        value={newTaskSkills}
        onChangeText={setNewTaskSkills}
        placeholderTextColor="#6B7280"
        multiline
      />

      <Modal visible={showUnitPicker} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowUnitPicker(false)}
        >
          <View style={styles.modalPopupContent}>
            {["hours", "days", "weeks"].map((unit) => (
              <Pressable
                key={unit}
                style={{ padding: 12 }}
                onPress={() => {
                  setNewTaskExpectedTimeUnit(
                    unit as "hours" | "days" | "weeks",
                  );
                  setShowUnitPicker(false);
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
