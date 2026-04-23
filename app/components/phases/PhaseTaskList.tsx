import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Phase, Task, UserRole } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";
import TaskRow from "./TaskRow";

type PhaseTaskListProps = {
  phase: Phase;
  userRole: UserRole;
  openTask: (phase: Phase, task: Task) => void;
  deleteTask: (taskId: string) => void;
  onEditTask: (phase: Phase, task: Task) => void;
  openTaskFormForPhase: (phaseId: string) => void;
};

export default function PhaseTaskList({
  phase,
  userRole,
  openTask,
  deleteTask,
  onEditTask,
  openTaskFormForPhase,
}: PhaseTaskListProps) {
  return (
    <View style={styles.phaseBody}>
      {phase.tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          phase={phase}
          userRole={userRole}
          openTask={openTask}
          deleteTask={(taskId) => deleteTask(taskId)}
          onEditTask={onEditTask}
        />
      ))}

      <Pressable
        onPress={() => openTaskFormForPhase(phase.id)}
        style={({ pressed }) => [styles.addTaskButton, pressed && styles.pressed]}
      >
        <Ionicons name="add" size={18} color="white" />
        <Text style={styles.addTaskButtonText}>Add Task</Text>
      </Pressable>
    </View>
  );
}
