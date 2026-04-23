import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Phase, Task, UserRole } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type TaskRowProps = {
  task: Task;
  phase: Phase;
  userRole: UserRole;
  openTask: (phase: Phase, task: Task) => void;
  deleteTask: (taskId: string) => void;
  onEditTask: (phase: Phase, task: Task) => void;
};

function taskStatusIcon(
  status: Task["status"],
): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "approved":
      return "checkmark-circle";
    case "submitted":
      return "time";
    case "rejected":
      return "close-circle";
    case "pending":
    default:
      return "ellipse-outline";
  }
}

function taskStatusColor(status: Task["status"]) {
  switch (status) {
    case "approved":
      return "#0b0c67";
    case "submitted":
      return "#ff3b89";
    case "rejected":
      return "#DC2626";
    case "pending":
    default:
      return "#646c7c";
  }
}

export default function TaskRow({
  task,
  phase,
  userRole,
  openTask,
  deleteTask,
  onEditTask,
}: TaskRowProps) {
  return (
    <View style={styles.taskRow}>
      <Pressable
        onPress={() => openTask(phase, task)}
        style={({ pressed }) => [
          styles.taskContent,
          pressed && styles.taskPressed,
        ]}
      >
        <View style={styles.taskLeft}>
          <Ionicons
            name={taskStatusIcon(task.status)}
            size={18}
            color={taskStatusColor(task.status)}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{task.title}</Text>

            <Text style={styles.taskMeta}>
              <Text style={styles.xpText}>{task.xp} XP</Text>
              {"  •  "}
              Due {task.dueDateFormatted}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </Pressable>

      <TouchableOpacity
        style={styles.taskMenuButton}
        onPress={() => {
          Alert.alert("Task Options", "Choose an action", [
            {
              text: "Edit",
              onPress: () => onEditTask(phase, task),
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => deleteTask(task.id),
            },

            { text: "Cancel", style: "cancel" },
          ]);
        }}
      >
        <Ionicons name="ellipsis-vertical" size={14} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}
