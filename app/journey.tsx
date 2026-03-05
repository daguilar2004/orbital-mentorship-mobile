import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "habits" | "goals" | "discipline";

type Item = {
  id: string;
  title: string;
};

export default function Journey() {
  const [introDone, setIntroDone] = useState(false);
  const [reflection, setReflection] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  const [habitInput, setHabitInput] = useState("");
  const [habits, setHabits] = useState<Item[]>([
    {
      id: "h1",
      title:
        "Trigger: When I am explaining a technical concept to someone outside my discipline",
    },
    {
      id: "h2",
      title:
        "Motivation: Communicate more clearly across disciplines",
    },
    {
      id: "h3",
      title:
        "Action: Explain the concept without jargon and ask the listener to summarize it",
    },
    {
      id: "h4",
      title:
        "Reinforcement: Reflect on whether the explanation was understood",
    },
  ]);

  const [smartInput, setSmartInput] = useState("");
  const [smartGoals, setSmartGoals] = useState<Item[]>([
    { id: "sg1", title: "Complete certification by end of Q2" },
  ]);

  const [longInput, setLongInput] = useState("");
  const [longGoals, setLongGoals] = useState<Item[]>([
    { id: "lg1", title: "Become a senior developer" },
  ]);

  const [taskInput, setTaskInput] = useState("");
  const [actionTasks, setActionTasks] = useState<Item[]>([
    { id: "t1", title: "Build portfolio website" },
    { id: "t2", title: "Contribute to open source" },
  ]);

  const [obstacleInput, setObstacleInput] = useState("");
  const [obstacles, setObstacles] = useState<Item[]>([
    { id: "o1", title: "Time management" },
    { id: "o2", title: "Procrastination" },
  ]);

  const [character, setCharacter] = useState("Persistent and curious");
  const [personality, setPersonality] = useState("Analytical problem solver");

  const addTo = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setList: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    const title = input.trim();
    if (!title) return;
    setList((prev) => [{ id: String(Date.now()), title }, ...prev]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollBg}
        contentContainerStyle={styles.pagePad}
      >
        <Text style={styles.pageTitle}>My Journey</Text>
        <Text style={styles.pageSub}>Track your personal growth</Text>

        <View style={styles.tabRow}>
          <TabButton
            label="Habits"
            icon="♡"
            active={activeTab === "habits"}
            onPress={() => setActiveTab("habits")}
          />
          <TabButton
            label="Goals"
            icon="◎"
            active={activeTab === "goals"}
            onPress={() => setActiveTab("goals")}
          />
          <TabButton
            label="Discipline"
            icon="🏆"
            active={activeTab === "discipline"}
            onPress={() => setActiveTab("discipline")}
          />
        </View>

        <View style={{ height: 16 }} />

        {activeTab === "habits" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Habit Building</Text>

            <View style={styles.addRow}>
              <TextInput
                value={habitInput}
                onChangeText={setHabitInput}
                placeholder="What is one specific habit you want to practice this week that supports your identity and SMART goal?"
                style={styles.input}
              />
              <Pressable
                style={styles.addBtnPurple}
                onPress={() =>
                  addTo(habitInput, setHabitInput, setHabits)
                }
              >
                <Text style={styles.addBtnText}>＋</Text>
              </Pressable>
            </View>

            {habits.map((h) => (
              <View key={h.id} style={styles.rowPurple}>
                <Text style={styles.rowText}>{h.title}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "goals" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>SMART Goals</Text>
          </View>
        )}

        {activeTab === "discipline" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Development</Text>

            <TextInput
              value={character}
              onChangeText={setCharacter}
              multiline
              style={styles.bigInput}
            />

            <TextInput
              value={personality}
              onChangeText={setPersonality}
              multiline
              style={styles.bigInput}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TabButton(props: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={props.onPress} style={styles.tabBtn}>
      <Text style={[styles.tabLabel, props.active && styles.tabLabelActive]}>
        {props.icon} {props.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollBg: { flex: 1, backgroundColor: "#FFFFFF" },

  pagePad: { padding: 16, paddingBottom: 30 },

  pageTitle: { fontSize: 26, fontWeight: "900", color: "#111827" },
  pageSub: { marginTop: 4, fontSize: 13, color: "#6B7280" },

  tabRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  tabBtn: { paddingVertical: 8 },

  tabLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  tabLabelActive: { color: "#7C3AED" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },

  addRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },

  addBtnPurple: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },

  addBtnText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  rowPurple: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    paddingHorizontal: 12,
    marginTop: 10,
    justifyContent: "center",
  },

  rowText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  bigInput: {
    marginTop: 10,
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
});
