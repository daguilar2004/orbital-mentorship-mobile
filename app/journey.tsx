import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

type TabKey = "habits" | "goals" | "discipline";

type HabitAnswers = {
  trigger: string;
  motivation: string;
  action: string;
  reinforcement: string;
  reflection: string;
};

type GoalAnswers = {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
};

type Habit = { id: string; title: string; answers: HabitAnswers };
type Goal  = { id: string; title: string; answers: GoalAnswers };

/* ─── Habit form fields ─── */
const HABIT_FIELDS: { key: keyof HabitAnswers; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "trigger",       label: "Trigger",       placeholder: "What reminds you to do this habit?" },
  { key: "motivation",    label: "Motivation",     placeholder: "Why is this habit important?",       multiline: true },
  { key: "action",        label: "Action",         placeholder: "What action will you take?",         multiline: true },
  { key: "reinforcement", label: "Reinforcement",  placeholder: "How will you reinforce it?",         multiline: true },
  { key: "reflection",    label: "Reflection",     placeholder: "How does this help your growth?",    multiline: true },
];

/* ─── Goal form fields ─── */
const GOAL_FIELDS: { key: keyof GoalAnswers; label: string; placeholder: string; multiline?: boolean; isDate?: boolean }[] = [
  { key: "specific",   label: "Specific",       placeholder: "What action moves you toward your goal?", multiline: true },
  { key: "measurable", label: "Measurable",     placeholder: "How will you measure progress?",          multiline: true },
  { key: "achievable", label: "Achievable",     placeholder: "Why is it realistic? (optional)",         multiline: true },
  { key: "relevant",   label: "Relevant",       placeholder: "Why does this matter? (optional)",        multiline: true },
  { key: "timebound",  label: "Time / Due Date",placeholder: "When will it be completed?",              isDate: true },
];

/* ════════════════════════════════════════
   Reusable single-card form
════════════════════════════════════════ */
function ItemForm<T extends Record<string, string>>({
  heading,
  titlePlaceholder,
  fields,
  onSave,
  onCancel,
  initialTitle = "",
  initialAnswers,
}: {
  heading: string;
  titlePlaceholder: string;
  fields: { key: keyof T; label: string; placeholder: string; multiline?: boolean; isDate?: boolean }[];
  onSave: (title: string, answers: T) => void;
  onCancel: () => void;
  initialTitle?: string;
  initialAnswers?: T;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [answers, setAnswers] = useState<T>(
    initialAnswers ?? (Object.fromEntries(fields.map((f) => [f.key, ""])) as T)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const set = (key: keyof T, val: string) =>
    setAnswers((prev) => ({ ...prev, [key]: val }));

  return (
    <View style={styles.formCard}>
      <Text style={styles.formHeading}>{heading}</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={titlePlaceholder}
        placeholderTextColor="#9CA3AF"
        style={styles.formInput}
      />

      {fields.map((f) => {
        if (f.isDate) {
          return (
            <View key={String(f.key)}>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[styles.formInput, { justifyContent: "center" }]}
              >
                <Text style={{ color: answers[f.key] ? "#111827" : "#9CA3AF", fontSize: 14 }}>
                  {answers[f.key] || "Time / Due Date — When will it be completed?"}
                </Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="inline"
                  themeVariant="light"
                  accentColor="#7C3AED"
                  onChange={(event, date) => {
                    if (event.type === "dismissed") {
                      setShowDatePicker(false);
                      return;
                    }
                    if (date) {
                      setSelectedDate(date);
                      const formatted = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      set(f.key, formatted);
                      setShowDatePicker(false);
                    }
                  }}
                />
              )}
            </View>
          );
        }

        return (
          <TextInput
            key={String(f.key)}
            value={answers[f.key]}
            onChangeText={(v) => set(f.key, v)}
            placeholder={f.label + " — " + f.placeholder}
            placeholderTextColor="#9CA3AF"
            multiline={f.multiline}
            style={[styles.formInput, f.multiline && styles.formInputMulti]}
          />
        );
      })}

      <View style={styles.formActions}>
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={styles.saveFormBtn}
          onPress={() => { if (title.trim()) onSave(title.trim(), answers); }}
        >
          <Text style={styles.saveFormBtnText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════
   Main screen
════════════════════════════════════════ */
export default function Journey() {
  const [introDone, setIntroDone] = useState(false);
  const [reflection, setReflection] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals,  setGoals]  = useState<Goal[]>([]);

  const [openHabit, setOpenHabit] = useState<string | null>(null);
  const [openGoal,  setOpenGoal]  = useState<string | null>(null);

  const [addingHabit,  setAddingHabit]  = useState(false);
  const [addingGoal,   setAddingGoal]   = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editingGoal,  setEditingGoal]  = useState<string | null>(null);

  const [discipline, setDiscipline] = useState("");

  /* ── Habit CRUD ── */
  const addHabit = (title: string, answers: HabitAnswers) => {
    setHabits((p) => [...p, { id: Date.now().toString(), title, answers }]);
    setAddingHabit(false);
  };
  const saveHabitEdit = (id: string, title: string, answers: HabitAnswers) => {
    setHabits((p) => p.map((h) => (h.id === id ? { ...h, title, answers } : h)));
    setEditingHabit(null);
  };
  const deleteHabit = (id: string) => {
    Alert.alert("Delete this habit?", "", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => {
        setHabits((p) => p.filter((h) => h.id !== id));
        if (openHabit === id) setOpenHabit(null);
      }},
    ]);
  };

  /* ── Goal CRUD ── */
  const addGoal = (title: string, answers: GoalAnswers) => {
    setGoals((p) => [...p, { id: Date.now().toString(), title, answers }]);
    setAddingGoal(false);
  };
  const saveGoalEdit = (id: string, title: string, answers: GoalAnswers) => {
    setGoals((p) => p.map((g) => (g.id === id ? { ...g, title, answers } : g)));
    setEditingGoal(null);
  };
  const deleteGoal = (id: string) => {
    Alert.alert("Delete this goal?", "", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => {
        setGoals((p) => p.filter((g) => g.id !== id));
        if (openGoal === id) setOpenGoal(null);
      }},
    ]);
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
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scrollBg} contentContainerStyle={styles.pagePad}>
            <Text style={styles.pageTitle}>My Journey</Text>

            <View style={styles.tabRow}>
              <TabButton label="Habits"     active={activeTab === "habits"}     onPress={() => setActiveTab("habits")} />
              <TabButton label="Goals"      active={activeTab === "goals"}      onPress={() => setActiveTab("goals")} />
              <TabButton label="Discipline" active={activeTab === "discipline"} onPress={() => setActiveTab("discipline")} />
            </View>

            {/* ── NEW HABIT FORM ── */}
            {addingHabit && activeTab === "habits" && (
              <ItemForm<HabitAnswers>
                heading="Create New Habit"
                titlePlaceholder="Habit title"
                fields={HABIT_FIELDS}
                onSave={addHabit}
                onCancel={() => setAddingHabit(false)}
              />
            )}

            {/* ── NEW GOAL FORM ── */}
            {addingGoal && activeTab === "goals" && (
              <ItemForm<GoalAnswers>
                heading="Create New SMART Goal"
                titlePlaceholder="Goal title"
                fields={GOAL_FIELDS}
                onSave={addGoal}
                onCancel={() => setAddingGoal(false)}
              />
            )}

            {/* ── HABIT LIST ── */}
            {activeTab === "habits" && habits.map((habit) => (
              <View key={habit.id} style={styles.card}>
                {editingHabit === habit.id ? (
                  <ItemForm<HabitAnswers>
                    heading="Edit Habit"
                    titlePlaceholder="Habit title"
                    fields={HABIT_FIELDS}
                    initialTitle={habit.title}
                    initialAnswers={habit.answers}
                    onSave={(title, answers) => saveHabitEdit(habit.id, title, answers)}
                    onCancel={() => setEditingHabit(null)}
                  />
                ) : (
                  <>
                    <Pressable onPress={() => setOpenHabit(openHabit === habit.id ? null : habit.id)}>
                      <Text style={styles.cardTitle}>{habit.title}</Text>
                    </Pressable>

                    {openHabit === habit.id && (
                      <>
                        {HABIT_FIELDS.map((f) => {
                          const val = habit.answers[f.key];
                          if (!val) return null;
                          return (
                            <View key={String(f.key)} style={styles.answerBlock}>
                              <Text style={styles.answerLabel}>{f.label}</Text>
                              <Text style={styles.answerText}>{val}</Text>
                            </View>
                          );
                        })}
                        <View style={styles.actionRow}>
                          <Pressable style={styles.editBtn} onPress={() => setEditingHabit(habit.id)}>
                            <Text style={styles.actionText}>Edit</Text>
                          </Pressable>
                          <Pressable style={styles.deleteBtn} onPress={() => deleteHabit(habit.id)}>
                            <Text style={styles.actionText}>Delete</Text>
                          </Pressable>
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
            ))}

            {/* ── GOAL LIST ── */}
            {activeTab === "goals" && goals.map((goal) => (
              <View key={goal.id} style={styles.card}>
                {editingGoal === goal.id ? (
                  <ItemForm<GoalAnswers>
                    heading="Edit Goal"
                    titlePlaceholder="Goal title"
                    fields={GOAL_FIELDS}
                    initialTitle={goal.title}
                    initialAnswers={goal.answers}
                    onSave={(title, answers) => saveGoalEdit(goal.id, title, answers)}
                    onCancel={() => setEditingGoal(null)}
                  />
                ) : (
                  <>
                    <Pressable onPress={() => setOpenGoal(openGoal === goal.id ? null : goal.id)}>
                      <Text style={styles.cardTitle}>{goal.title}</Text>
                    </Pressable>

                    {openGoal === goal.id && (
                      <>
                        {GOAL_FIELDS.map((f) => {
                          const val = goal.answers[f.key];
                          if (!val) return null;
                          return (
                            <View key={String(f.key)} style={styles.answerBlock}>
                              <Text style={styles.answerLabel}>{f.label}</Text>
                              <Text style={styles.answerText}>{val}</Text>
                            </View>
                          );
                        })}
                        <View style={styles.actionRow}>
                          <Pressable style={styles.editBtn} onPress={() => setEditingGoal(goal.id)}>
                            <Text style={styles.actionText}>Edit</Text>
                          </Pressable>
                          <Pressable style={styles.deleteBtn} onPress={() => deleteGoal(goal.id)}>
                            <Text style={styles.actionText}>Delete</Text>
                          </Pressable>
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
            ))}

            {/* ── DISCIPLINE ── */}
            {activeTab === "discipline" && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  What is the smallest thing you can do today to get closer to your goal?
                </Text>
                <TextInput
                  value={discipline}
                  onChangeText={setDiscipline}
                  multiline
                  style={styles.bigInput}
                />
              </View>
            )}
          </ScrollView>

          {activeTab === "habits" && (
            <Pressable style={styles.fab} onPress={() => setAddingHabit(true)}>
              <Text style={styles.fabText}>＋</Text>
            </Pressable>
          )}
          {activeTab === "goals" && (
            <Pressable style={styles.fab} onPress={() => setAddingGoal(true)}>
              <Text style={styles.fabText}>＋</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

/* ─── Sub-components ─── */

function WelcomeScreen(props: any) {
  return (
    <ScrollView style={styles.scrollBg} contentContainerStyle={styles.centerWrap}>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome to Your Journey</Text>
        <Text style={styles.welcomeSub}>Reflect on who you are today and who you want to become.</Text>
        <TextInput
          value={props.reflection}
          onChangeText={props.setReflection}
          placeholder="Share your thoughts..."
          multiline
          style={styles.textArea}
        />
        <Pressable style={styles.primaryBtn} onPress={props.onBegin}>
          <Text style={styles.primaryBtnText}>Begin Journey</Text>
        </Pressable>
        <Pressable onPress={props.onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function TabButton(props: any) {
  return (
    <Pressable onPress={props.onPress}>
      <Text style={[styles.tabLabel, props.active && styles.tabLabelActive]}>{props.label}</Text>
    </Pressable>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: "#FFF" },
  scrollBg: { flex: 1, backgroundColor: "#F9FAFB" },
  pagePad:  { padding: 16, paddingBottom: 100 },

  pageTitle: { fontSize: 26, fontWeight: "900", color: "#111827" },

  tabRow:         { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  tabLabel:       { fontSize: 14, color: "#9CA3AF", fontWeight: "700" },
  tabLabelActive: { color: "#7C3AED" },

  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },

  answerBlock: { marginTop: 12 },
  answerLabel: { fontSize: 12, fontWeight: "700", color: "#7C3AED", marginBottom: 2 },
  answerText:  { fontSize: 13, color: "#374151" },

  actionRow:  { flexDirection: "row", gap: 10, marginTop: 16 },
  editBtn:    { flex: 1, backgroundColor: "#6366F1", padding: 10, borderRadius: 10, alignItems: "center" },
  deleteBtn:  { flex: 1, backgroundColor: "#EF4444", padding: 10, borderRadius: 10, alignItems: "center" },
  actionText: { color: "#FFF", fontWeight: "700" },

  /* form card */
  formCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  formHeading: { fontSize: 16, fontWeight: "800", color: "#7C3AED", marginBottom: 14 },
  formInput: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },
  formInputMulti: { minHeight: 80, textAlignVertical: "top" },

  formActions:     { flexDirection: "row", gap: 10, marginTop: 6 },
  cancelBtn:       { flex: 1, height: 46, borderRadius: 14, borderWidth: 1, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" },
  cancelBtnText:   { fontWeight: "700", color: "#6B7280" },
  saveFormBtn:     { flex: 2, height: 46, borderRadius: 14, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center" },
  saveFormBtnText: { fontWeight: "800", color: "#FFF", fontSize: 15 },

  bigInput: { marginTop: 12, minHeight: 120, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 10 },

  fab: {
    position: "absolute", bottom: 30, right: 25,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#7C3AED",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#7C3AED", shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: "#FFF", fontSize: 30, fontWeight: "bold" },

  centerWrap:     { padding: 18, flexGrow: 1, justifyContent: "center" },
  welcomeCard:    { backgroundColor: "#FFF", borderRadius: 22, padding: 20, borderWidth: 1, borderColor: "#F1F5F9" },
  welcomeTitle:   { fontSize: 24, fontWeight: "800", textAlign: "center" },
  welcomeSub:     { marginTop: 8, fontSize: 13, color: "#6B7280", textAlign: "center" },
  textArea:       { marginTop: 14, minHeight: 120, borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 12 },
  primaryBtn:     { marginTop: 16, height: 52, borderRadius: 16, backgroundColor: "#EC4899", alignItems: "center", justifyContent: "center" },
  primaryBtnText: { color: "#FFF", fontWeight: "800" },
  skipText:       { textAlign: "center", marginTop: 10, color: "#6B7280" },
});
