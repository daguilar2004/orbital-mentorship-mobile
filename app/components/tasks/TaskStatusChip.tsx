import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Task } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type TaskStatusChipProps = {
  activeTask: Task | null;
  taskStatusColor: (status: Task["status"]) => string;
  taskStatusIcon: (status: Task["status"]) => keyof typeof Ionicons.glyphMap;
  statusLabel: (status: Task["status"]) => string;
};

export default function TaskStatusChip({
  activeTask,
  taskStatusColor,
  taskStatusIcon,
  statusLabel,
}: TaskStatusChipProps) {
  const status = activeTask?.status ?? "pending";
  const color = taskStatusColor(status);

  return (
    <View style={{ alignItems: "center", marginBottom: 10 }}>
      <View
        style={[
          styles.statusChip,
          {
            borderColor: color,
          },
        ]}
      >
        <Ionicons name={taskStatusIcon(status)} size={16} color={color} />
        <Text style={[styles.statusChipText, { color }]}>
          {statusLabel(status)}
        </Text>
      </View>
    </View>
  );
}
