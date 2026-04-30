import { Text, View } from "react-native";
import { Phase } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type PhaseProgressProps = {
  approvedCount: number;
  totalTasks: number;
  progressPct: number;
  status: Phase["status"];
};

export default function PhaseProgress({
  approvedCount,
  totalTasks,
  progressPct,
  status,
}: PhaseProgressProps) {
  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.rowBetween}>
        <Text style={styles.smallMuted}>Tasks Progress</Text>
        <Text style={[styles.small, styles.bold]}>
          {approvedCount}/{totalTasks}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPct}%`,
              backgroundColor: status === "completed" ? "#0b0c67" : "#7C3AED",
            },
          ]}
        />
      </View>
    </View>
  );
}
