import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { styles } from "../../styles/accountabilityStyles";

type Props = {
  reflection: string;
  setReflection: (v: string) => void;
  onBegin: () => void;
  onSkip: () => void;
};

export default function WelcomeScreen({
  reflection,
  setReflection,
  onBegin,
  onSkip,
}: Props) {
  return (
    <ScrollView
      style={styles.scrollBg}
      contentContainerStyle={styles.centerWrap}
    >
      <View style={styles.welcomeCard}>
        <View style={styles.heartCircle}>
          <Text style={styles.heart}>✓</Text>
        </View>

        <Text style={styles.welcomeTitle}>Welcome to Accountability</Text>
        <Text style={styles.welcomeSub}>
          Before you begin, take a second to think about what you want to stay
          consistent with.
        </Text>

        <Text style={styles.promptTitle}>
          What are you trying{"\n"}to hold yourself to?
        </Text>

        <TextInput
          value={reflection}
          onChangeText={setReflection}
          placeholder="Write a quick note to yourself..."
          placeholderTextColor="#9CA3AF"
          multiline
          style={styles.textArea}
          textAlignVertical="top"
        />

        <Pressable style={styles.primaryBtn} onPress={onBegin}>
          <Text style={styles.primaryBtnText}>Open Accountability</Text>
          <Text style={styles.primaryBtnArrow}>→</Text>
        </Pressable>

        <Pressable onPress={onSkip} style={styles.skipWrap}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}