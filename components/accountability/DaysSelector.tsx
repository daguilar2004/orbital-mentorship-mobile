import { Pressable, Text, View } from "react-native";
import { DAY_OPTIONS } from "../../constants/accountability";
import { styles } from "../../styles/accountabilityStyles";
import { DayKey } from "../../types/accountability";

type Props = {
  selected: DayKey[];
  onToggle: (day: DayKey) => void;
};

export default function DaysSelector({ selected, onToggle }: Props) {
  return (
    <View style={styles.daysRow}>
      {DAY_OPTIONS.map((day) => {
        const active = selected.includes(day.key);

        return (
          <Pressable
            key={day.key}
            onPress={() => onToggle(day.key)}
            style={[styles.dayCircle, active && styles.dayCircleActive]}
          >
            <Text
              style={[
                styles.dayCircleText,
                active && styles.dayCircleTextActive,
              ]}
            >
              {day.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}