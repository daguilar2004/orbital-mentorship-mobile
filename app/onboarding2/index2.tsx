import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";

const CircleButton = ({
  label,
  icon,
  to,
}: {
  label: string;
  icon: any;
  to: Href;
}) => (
  <Pressable style={styles.circleWrap} onPress={() => router.push(to)}>
    <View style={styles.circle}>
      <Ionicons name={icon} size={32} color="#ffffff" />
    </View>
    <Text style={styles.circleLabel}>{label}</Text>
  </Pressable>
);

export default function Onboarding2Hub() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Onboarding 2</Text>
        <Text style={styles.subtitle}>Choose a step to begin</Text>
      </View>

      <View style={styles.grid}>
        <CircleButton
          label="Role selection"
          icon="person"
          to="/onboarding2/role-selection"
        />
        <CircleButton
          label="Questionnaire"
          icon="chatbubbles"
          to="/onboarding2/questionnaire"
        />
        <CircleButton
          label="Profile setup"
          icon="person-circle"
          to="/onboarding2/profile-setup"
        />
        <CircleButton label="Connect" icon="link" to="/onboarding2/connect" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 6 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
  circleWrap: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  circleLabel: { textAlign: "center", color: "#111827", fontWeight: "600" },
});
