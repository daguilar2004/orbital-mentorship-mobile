import { Text, View } from "react-native";
import { styles } from "../../styles/accountabilityStyles";

type Props = {
  label: string;
  text: string;
};

export default function SmartGoalField({ label, text }: Props) {
  return (
    <View style={styles.smartFieldWrap}>
      <View style={styles.goalPill}>
        <Text style={styles.goalPillText}>{label}</Text>
      </View>
      <Text style={styles.smartFieldText}>{text}</Text>
    </View>
  );
}