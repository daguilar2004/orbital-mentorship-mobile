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
  // Intro
  const [introDone, setIntroDone] = useState(false);
  const [reflection, setReflection] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  // Habits
  const [habitInput, setHabitInput] = useState("");
  const [habits, setHabits] = useState<Item[]>([
    { id: "h1", title: "Morning meditation" },
    { id: "h2", title: "Daily coding practice" },
  ]);

  // Discipline
  const [character, setCharacter] = useState("Persistent and curious");
  const [personality, setPersonality] = useState("Analytical problem solver");

  const addHabit = () => {
    const title = habitInput.trim();
    if (!title) return;
    setHabits((prev) => [{ id: String(Date.now()), title }, ...prev]);
    setHabitInput("");
  };

  const removeHabit = (id: string) => {
    setHabits((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {!introDone ? (
        <WelcomeScreen
          reflection={reflection}
          setReflection={setReflection}
          onBegin={() => setIntroDone(true)}
          onSkip={() => setIntroDone(true)}
        />
      ) : (
        <MyJourneyScreen
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          // habits
          habitInput={habitInput}
          setHabitInput={setHabitInput}
          habits={habits}
          addHabit={addHabit}
          removeHabit={removeHabit}
          // discipline
          character={character}
          setCharacter={setCharacter}
          personality={personality}
          setPersonality={setPersonality}
        />
      )}
    </SafeAreaView>
  );
}

function WelcomeScreen(props: {
  reflection: string;
  setReflection: (v: string) => void;
  onBegin: () => void;
  onSkip: () => void;
}) {
  const { reflection, setReflection, onBegin, onSkip } = props;

  return (
    <ScrollView style={styles.scrollBg} contentContainerStyle={styles.centerWrap}>
      <View style={styles.welcomeCard}>
        <View style={styles.heartCircle}>
          <Text style={styles.heart}>♡</Text>
        </View>

        <Text style={styles.welcomeTitle}>Welcome to Your Journey</Text>
        <Text style={styles.welcomeSub}>
          Before we begin, take a moment to reflect on your transformation
        </Text>

        <Text style={styles.promptTitle}>
          Who you are now,{"\n"}and who you want to become?
        </Text>

        <TextInput
          value={reflection}
          onChangeText={setReflection}
          placeholder="Share your thoughts... Where are you now, and where do you see yourself going?"
          placeholderTextColor="#9CA3AF"
          multiline
          style={styles.textArea}
          textAlignVertical="top"
        />

        <Pressable style={styles.primaryBtn} onPress={onBegin}>
          <Text style={styles.primaryBtnText}>Begin Your Journey</Text>
          <Text style={styles.primaryBtnArrow}>→</Text>
        </Pressable>

        <Pressable onPress={onSkip} style={styles.skipWrap}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function MyJourneyScreen(props: {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;

  habitInput: string;
  setHabitInput: (v: string) => void;
  habits: Item[];
  addHabit: () => void;
  removeHabit: (id: string) => void;

  character: string;
  setCharacter: (v: string) => void;
  personality: string;
  setPersonality: (v: string) => void;
}) {
  const {
    activeTab,
    setActiveTab,

    habitInput,
    setHabitInput,
    habits,
    addHabit,
    removeHabit,

    character,
    setCharacter,
    personality,
    setPersonality,
  } = props;

  return (
    <ScrollView style={styles.scrollBg} contentContainerStyle={styles.pagePad}>
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

      {activeTab === "habits" ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Habits</Text>
          <Text style={styles.cardSub}>Positive habits you maintain daily</Text>

          <View style={styles.addRow}>
            <TextInput
              value={habitInput}
              onChangeText={setHabitInput}
              placeholder="Add a new habit..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={addHabit}
            />
            <Pressable style={styles.addBtnPurple} onPress={addHabit}>
              <Text style={styles.addBtnText}>＋</Text>
            </Pressable>
          </View>

          <View style={{ height: 10 }} />

          {habits.map((h) => (
            <View key={h.id} style={styles.rowPurple}>
              <Text style={styles.rowText}>{h.title}</Text>
              <Pressable onPress={() => removeHabit(h.id)} style={styles.rowXBtn}>
                <Text style={styles.rowXText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : activeTab === "goals" ? (
        <View style={{ gap: 14 }}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weekly SMART Goal</Text>

            <Text style={styles.sectionSub}>Why you’re setting a SMART goal:</Text>
            <Text style={styles.goalInfoText}>
              Setting a SMART goal helps turn intention into action by making your focus
              clear, specific, and measurable. People are far more likely to follow through
              when goals are concrete, time-bound, and tied to a specific action rather than
              vague intentions.
            </Text>

            <View style={{ height: 12 }} />

            <GoalQuestion
              label="Specific"
              question="What is one specific action you can take this week that moves you closer to the professional role or leadership style you described above?"
              example='“I want to practice explaining technical ideas in plain language so they are easily understood by someone outside my discipline.”'
            />

            <GoalQuestion
              label="Measurable"
              question="How will you know that you made progress on this by the end of the week?"
              example='“Someone outside my technical background can accurately summarize my explanation without needing additional clarification.”'
            />

            <GoalQuestion
              label="Achievable"
              question="Why is this goal realistic to complete within the next 7 days?"
              example='“This is achievable because I will have at least one opportunity this week to explain a technical idea to a non-technical audience and reflect on how clearly I communicated.”'
            />

            <GoalQuestion
              label="Relevant"
              question="How does this goal support the type of professional you want to become?"
              example='“This supports the kind of professional I want to be because effective collaboration and leadership require the ability to communicate ideas clearly across different backgrounds.”'
            />

            <GoalQuestion
              label="Time-bound"
              question="When will you work on or complete this goal within the next 7 days?"
              example='“I will work on this during my mentorship session this week and refine it by the end of the week.”'
            />
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Development</Text>

          <Text style={styles.subHeader}>Character</Text>
          <Text style={styles.sectionSub}>Your core values and character traits</Text>
          <TextInput
            value={character}
            onChangeText={setCharacter}
            multiline
            style={styles.bigInput}
            textAlignVertical="top"
          />

          <Text style={[styles.subHeader, { marginTop: 16 }]}>Personality</Text>
          <Text style={styles.sectionSub}>Your personality strengths and style</Text>
          <TextInput
            value={personality}
            onChangeText={setPersonality}
            multiline
            style={styles.bigInput}
            textAlignVertical="top"
          />

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 Regular reflection helps you stay aligned with your goals and maintain discipline.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function GoalQuestion(props: { label: string; question: string; example: string }) {
  const { label, question, example } = props;
  const [answer, setAnswer] = useState("");

  return (
    <View style={styles.goalBlock}>
      {/* Mini “SMART” tab-style label */}
      <View style={styles.goalLabelRow}>
        <View style={styles.goalPill}>
          <Text style={styles.goalPillText}>{label}</Text>
        </View>
      </View>

      {/* Removed the word "Prompt:" — just show the question */}
      <Text style={styles.goalQuestionText}>{question}</Text>

      <Text style={[styles.goalMetaTitle, { marginTop: 10 }]}>Example:</Text>
      <Text style={styles.goalMetaText}>{example}</Text>

      <TextInput
        value={answer}
        onChangeText={setAnswer}
        placeholder="Short answer text"
        placeholderTextColor="#9CA3AF"
        style={styles.goalAnswerInput}
        returnKeyType="done"
      />
    </View>
  );
}

function TabButton(props: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  const { label, icon, active, onPress } = props;

  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {active && <View style={styles.simpleUnderline} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollBg: { flex: 1, backgroundColor: "#FFFFFF" },

  // welcome
  centerWrap: { padding: 18, flexGrow: 1, justifyContent: "center" },
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  heartCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A855F7",
  },
  heart: { fontSize: 30, color: "#FFFFFF", marginTop: 2 },
  welcomeTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  welcomeSub: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    textAlign: "center",
  },
  promptTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: "#7C3AED",
    textAlign: "center",
  },
  textArea: {
    marginTop: 14,
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  primaryBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  primaryBtnArrow: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: -1,
  },
  skipWrap: { marginTop: 14, alignItems: "center" },
  skipText: { color: "#6B7280", fontSize: 13, fontWeight: "600" },

  // page
  pagePad: { padding: 16, paddingBottom: 30 },
  pageTitle: { fontSize: 26, fontWeight: "900", color: "#111827" },
  pageSub: { marginTop: 4, fontSize: 13, color: "#6B7280" },

  // tabs
  tabRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  tabBtn: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 90,
  },
  tabIcon: { fontSize: 18, color: "#9CA3AF" },
  tabIconActive: { color: "#7C3AED" },
  tabLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  tabLabelActive: { color: "#7C3AED" },
  simpleUnderline: {
    marginTop: 8,
    height: 3,
    width: 60,
    borderRadius: 999,
    backgroundColor: "#7C3AED",
  },

  // cards + inputs
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
  cardSub: { marginTop: 4, fontSize: 12, color: "#6B7280" },
  sectionTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
  sectionSub: { marginTop: 4, fontSize: 12, color: "#6B7280" },
  subHeader: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "900",
    color: "#111827",
  },

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
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
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

  // add buttons
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
    marginTop: -1,
  },

  // rows
  rowText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    paddingRight: 10,
  },
  rowXBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowXText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#9CA3AF",
    marginTop: -2,
  },

  rowPurple: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    paddingHorizontal: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  // tip box
  tipBox: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    padding: 12,
  },
  tipText: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },

  // GOALS tab styles
  goalInfoText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: "#374151",
  },
  goalBlock: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginTop: 12,
  },
  goalLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  // soft purple mini-tab/pill (matches your Habits purple vibe)
  goalPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  goalPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#7C3AED",
  },

  goalQuestionText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#111827",
    fontWeight: "600",
  },
  goalMetaTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
  goalMetaText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: "#374151",
  },
  goalAnswerInput: {
    marginTop: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    fontSize: 12,
    color: "#111827",
    paddingVertical: 6,
  },
});