import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Connect() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Connect</Text>
      <Text style={styles.subtitle}>
        Connect with mentors or mentees to get started.
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Finish Onboarding</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => router.push("/onboarding2/profile-setup")}
        >
          <Text style={styles.secondaryText}>Back to Onboarding 2</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#6B7280", marginBottom: 24 },
  actions: { marginTop: 20 },
  button: {
    backgroundColor: "#0b0c67",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { backgroundColor: "#F3F4F6" },
  secondaryText: { color: "#374151", fontWeight: "600" },
});