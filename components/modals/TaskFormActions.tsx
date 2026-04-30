import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/homeStyles";

type TaskFormActionsProps = {
  editingTaskId: string | null;
  onSave: () => void;
  onCancel: () => void;
};

export default function TaskFormActions({
  editingTaskId,
  onSave,
  onCancel,
}: TaskFormActionsProps) {
  return (
    <View style={styles.rowGap}>
      <Pressable style={styles.primaryBtn} onPress={onSave}>
        <Text style={styles.primaryBtnText}>
          {editingTaskId ? "Update Task" : "Add Task"}
        </Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={onCancel}>
        <Text style={styles.secondaryBtnText}>Cancel</Text>
      </Pressable>
    </View>
  );
}
