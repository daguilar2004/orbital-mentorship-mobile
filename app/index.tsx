import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useApp } from "./context/AppContext";

export default function Home() {
  const { phases, totalXP, userRole } = useApp();

  const currentPhase = useMemo(
    () => phases.find((p) => p.status === "current"),
    [phases],
  );

  const completedPhases = useMemo(
    () => phases.filter((p) => p.status === "completed").length,
    [phases],
  );

  const totalPhases = phases.length;

  const pendingTasksCount = useMemo(() => {
    return phases
      .flatMap((p) => p.tasks)
      .filter((t) => t.status === "pending" || t.status === "submitted").length;
  }, [phases]);

  const approvedCount =
    currentPhase?.tasks.filter((t) => t.status === "approved").length ?? 0;
  const totalTasks = currentPhase?.tasks.length ?? 0;
  const progressPct =
    totalTasks > 0 ? Math.round((approvedCount / totalTasks) * 100) : 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.h1}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          {userRole === "mentee"
            ? "Continue your learning journey"
            : "Manage your mentees progress"}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="trophy"
          iconBg="#F3E8FF"
          iconColor="#7C3AED"
          label="Total XP"
          value={`${totalXP}`}
        />

        <StatCard
          icon="trending-up"
          iconBg="#DBEAFE"
          iconColor="#2563EB"
          label="Progress"
          value={`${completedPhases}/${totalPhases}`}
        />

        <StatCard
          icon="flag"
          iconBg="#DCFCE7"
          iconColor="#16A34A"
          label={userRole === "mentee" ? "Pending Tasks" : "Tasks to Review"}
          value={`${pendingTasksCount}`}
        />
      </View>

      {/* Current Phase */}
      {currentPhase ? (
        <View style={styles.card}>
          <Text style={styles.h2}>Current Phase</Text>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.h3}>{currentPhase.name}</Text>
            <Text style={styles.muted}>
              {currentPhase.startDate} - {currentPhase.endDate}
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.small}>Tasks Completed</Text>
              <Text style={[styles.small, styles.bold]}>
                {approvedCount}/{totalTasks}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressPct}%` }]}
              />
            </View>

            <Text style={styles.progressLabel}>{progressPct}%</Text>
          </View>

          <Pressable
            onPress={() => router.push("./phases")}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>View Phase Details</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Quick Actions */}
      <View style={styles.quickGrid}>
        <QuickCard
          title="View Timeline"
          desc="See your complete learning journey from start to finish"
          onPress={() => router.push("./timeline")}
        />

        <QuickCard
          title="Update Journey"
          desc="Reflect on your habits, goals, and personal growth"
          onPress={() => router.push("/journey")}
        />

        <QuickCard
          title="Onboarding"
          desc="Complete your profile setup and mentorship preferences"
          onPress={() => router.push("./onboarding")}
        />

        <QuickCard
          title="Offboarding"
          desc="Review your progress and complete your mentorship"
          onPress={() => router.push("./offboarding")}
        />
      </View>
    </ScrollView>
  );
}

function StatCard(props: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statRow}>
        <View style={[styles.iconWrap, { backgroundColor: props.iconBg }]}>
          <Ionicons name={props.icon} size={22} color={props.iconColor} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.statLabel}>{props.label}</Text>
          <Text style={styles.statValue}>{props.value}</Text>
        </View>
      </View>
    </View>
  );
}

function QuickCard(props: {
  title: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.quickCard,
        pressed && styles.quickPressed,
      ]}
    >
      <Text style={styles.h3}>{props.title}</Text>
      <Text style={styles.muted}>{props.desc}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F7FB" },
  container: { padding: 16, paddingBottom: 28, gap: 16 },

  header: { gap: 6 },
  h1: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#4B5563" },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    flexGrow: 1,
    flexBasis: 160,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { fontSize: 12, color: "#6B7280" },
  statValue: { fontSize: 22, fontWeight: "700", marginTop: 2 },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  h2: { fontSize: 18, fontWeight: "700" },
  h3: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  muted: { fontSize: 13, color: "#6B7280", lineHeight: 18 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  small: { fontSize: 13, color: "#374151" },
  bold: { fontWeight: "700" },

  progressTrack: {
    marginTop: 8,
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#7C3AED" },
  progressLabel: { marginTop: 6, fontSize: 12, color: "#6B7280" },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontSize: 14, fontWeight: "700" },
  pressed: { opacity: 0.9 },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  quickCard: {
    flexGrow: 1,
    flexBasis: 220,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quickPressed: { borderColor: "#C4B5FD" },
});
