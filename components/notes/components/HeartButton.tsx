import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

type Props = {
  selected: boolean;
  onPress: () => void;
};

export default function HeartButton({ selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <MaterialCommunityIcons
        name={selected ? "heart" : "heart-outline"}
        size={24}
        color={selected ? "#ff3b89" : "#9ca3af"}
      />
    </Pressable>
  );
}
