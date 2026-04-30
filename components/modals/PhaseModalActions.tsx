import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/homeStyles";

type PhaseModalActionsProps = {
  editingPhaseId: string | null;
  onSave: () => void;
  onCancel: () => void;
};

export default function PhaseModalActions({
  editingPhaseId,
  onSave,
  onCancel,
}: PhaseModalActionsProps) {
  return (
    <View style={styles.rowGap}>
      <Pressable style={styles.primaryBtn} onPress={onSave}>
        <Text style={styles.primaryBtnText}>
          {editingPhaseId ? "Update Phase" : "Add Phase"}
        </Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={onCancel}>
        <Text style={styles.secondaryBtnText}>Cancel</Text>
      </Pressable>
    </View>
  );
}
