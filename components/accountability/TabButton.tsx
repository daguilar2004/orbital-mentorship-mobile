import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/accountabilityStyles";

type Props = {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
};

export default function TabButton({ label, icon, active, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
      {active && <View style={styles.simpleUnderline} />}
    </Pressable>
  );
}