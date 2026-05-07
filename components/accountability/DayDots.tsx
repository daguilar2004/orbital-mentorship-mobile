import { Text, View } from "react-native";
import { DAY_OPTIONS } from "../../constants/accountability";
import { styles } from "../../styles/accountabilityStyles";
import { DayKey } from "../../types/accountability";

type Props = {
  days: DayKey[];
  compact?: boolean;
};

export default function DayDots({ days, compact = false }: Props) {
  return (
    <View style={[styles.dayDotsRow, compact && styles.dayDotsRowCompact]}>
      {DAY_OPTIONS.map((day) => {
        const active = days.includes(day.key);

        return (
          <View
            key={day.key}
            style={[
              styles.dayDot,
              compact && styles.dayDotCompact,
              active && styles.dayDotActive,
            ]}
          >
            <Text
              style={[
                styles.dayDotText,
                compact && styles.dayDotTextCompact,
                active && styles.dayDotTextActive,
              ]}
            >
              {day.short}
            </Text>
          </View>
        );
      })}
    </View>
  );
}