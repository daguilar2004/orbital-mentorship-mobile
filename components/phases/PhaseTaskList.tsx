import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Phase, Task, UserRole } from "../../app/context/AppContext";
import { styles } from "../../app/styles/homeStyles";
import TaskRow from "./TaskRow";

type PhaseTaskListProps = {
  phase: Phase;
  userRole: UserRole;
  openTask: (phase: Phase, task: Task) => void;
  deleteTask: (phaseId: string, taskId: string) => void;
  setAddingTaskToPhaseId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function PhaseTaskList({
  phase,
  userRole,
  openTask,
  deleteTask,
  setAddingTaskToPhaseId,
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
          deleteTask={deleteTask}
        />
      ))}

      {userRole === "mentee" && (
        <Pressable
          onPress={() => setAddingTaskToPhaseId(phase.id)}
          style={({ pressed }) => [
            styles.addTaskButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="add" size={18} color="white" />
          <Text style={styles.addTaskButtonText}>Add Task</Text>
        </Pressable>
      )}
    </View>
  );
}
