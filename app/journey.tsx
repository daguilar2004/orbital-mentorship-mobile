import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "habits" | "goals";
type DayKey = "S" | "M" | "T" | "W" | "T2" | "F" | "S2";

type DailyHabit = {
  id: string;
  title: string;
  days: DayKey[];
  completedOn?: string | null;
  linkedGoalId?: string;
};

type SmartGoal = {
  id: string;
  title: string;
  time: string;
  specific: string;
  measurable: string;
  achievable?: string;
  relevant?: string;
  timeBound: string;
  completed: boolean;
  linkedHabitId?: string;
};

const DAY_OPTIONS: { key: DayKey; label: string; short: string }[] = [
  { key: "S", label: "Sunday", short: "S" },
  { key: "M", label: "Monday", short: "M" },
  { key: "T", label: "Tuesday", short: "T" },
  { key: "W", label: "Wednesday", short: "W" },
  { key: "T2", label: "Thursday", short: "T" },
  { key: "F", label: "Friday", short: "F" },
  { key: "S2", label: "Saturday", short: "S" },
];

const COLORS = {
  bg: "#F7F4FB",
  card: "#FFFFFF",
  text: "#1F2340",
  subtext: "#7F8198",
  primary: "#23205E",
  primarySoft: "#ECE7FB",
  pinkSoft: "#FFE3EF",
  pinkText: "#ff3b89",
  border: "#E8E0F0",
  borderSoft: "#F0EBF6",
  active: "#ff3b89",
  white: "#FFFFFF",
};

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayDayKey(): DayKey {
  const day = new Date().getDay();
  const map: DayKey[] = ["S", "M", "T", "W", "T2", "F", "S2"];
  return map[day];
}

export default function Journey() {
  const [introDone, setIntroDone] = useState(false);
  const [reflection, setReflection] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  const todayKey = getTodayKey();
  const todayDayKey = getTodayDayKey();

  const [habits, setHabits] = useState<DailyHabit[]>([
    {
      id: "h1",
      title: "Morning meditation",
      days: ["S", "M", "T", "W", "T2", "F", "S2"],
      completedOn: null,
    },
    {
      id: "h2",
      title: "Daily coding practice",
      days: ["S", "M", "T", "W", "T2", "F", "S2"],
      completedOn: null,
    },
  ]);

  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDays, setHabitDays] = useState<DayKey[]>([]);

  const [goals, setGoals] = useState<SmartGoal[]>([
    {
      id: "g1",
      title: "Practice clear communication",
      time: "This week",
      specific:
        "Explain one technical concept in simple language to someone outside my field.",
      measurable:
        "They can repeat the idea back accurately without extra clarification.",
      achievable:
        "I have at least one opportunity this week to explain a concept to someone.",
      relevant:
        "Clear communication supports the kind of professional and leader I want to become.",
      timeBound: "Complete by Sunday evening.",
      completed: false,
      linkedHabitId: "g1-habit",
    },
  ]);

  useEffect(() => {
    setHabits((prev) => {
      const exists = prev.some((habit) => habit.id === "g1-habit");
      if (exists) return prev;
      return [
        ...prev,
        {
          id: "g1-habit",
          title: "Practice explaining one idea clearly",
          days: ["M", "W", "F"],
          completedOn: null,
          linkedGoalId: "g1",
        },
      ];
    });
  }, []);

  const [expandedGoalId, setExpandedGoalId] = useState<string | null>("g1");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const [goalTitle, setGoalTitle] = useState("");
  const [goalTime, setGoalTime] = useState("");
  const [goalSpecific, setGoalSpecific] = useState("");
  const [goalMeasurable, setGoalMeasurable] = useState("");
  const [goalAchievable, setGoalAchievable] = useState("");
  const [goalRelevant, setGoalRelevant] = useState("");
  const [goalTimeBound, setGoalTimeBound] = useState("");

  const [goalHabitTitle, setGoalHabitTitle] = useState("");
  const [goalHabitDays, setGoalHabitDays] = useState<DayKey[]>([]);

  const [showGoalsHelp, setShowGoalsHelp] = useState(false);
  const [hasSeenGoalsHelp, setHasSeenGoalsHelp] = useState(false);

  useEffect(() => {
    if (activeTab === "goals" && !hasSeenGoalsHelp) {
      setShowGoalsHelp(true);
      setHasSeenGoalsHelp(true);
    }
  }, [activeTab, hasSeenGoalsHelp]);

  const clearHabitForm = () => {
    setHabitTitle("");
    setHabitDays([]);
    setEditingHabitId(null);
  };

  const cancelHabitForm = () => {
    setShowHabitForm(false);
    clearHabitForm();
  };

  const addHabit = () => {
    if (!habitTitle.trim() || habitDays.length === 0) return;

    const newHabit: DailyHabit = {
      id: String(Date.now()),
      title: habitTitle.trim(),
      days: habitDays,
      completedOn: null,
    };

    setHabits((prev) => [newHabit, ...prev]);
    setShowHabitForm(false);
    clearHabitForm();
  };

  const startEditHabit = (habit: DailyHabit) => {
    setEditingHabitId(habit.id);
    setHabitTitle(habit.title);
    setHabitDays(habit.days);
    setShowHabitForm(true);
  };

  const saveEditedHabit = () => {
    if (!editingHabitId || !habitTitle.trim() || habitDays.length === 0) return;

    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === editingHabitId
          ? {
              ...habit,
              title: habitTitle.trim(),
              days: habitDays,
            }
          : habit,
      ),
    );

    setShowHabitForm(false);
    clearHabitForm();
  };

  const removeHabit = (id: string) => {
    const linkedGoal = goals.find((goal) => goal.linkedHabitId === id);

    Alert.alert("Delete daily habit?", "Do you want to delete this daily habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setHabits((prev) => prev.filter((habit) => habit.id !== id));
          if (linkedGoal) {
            setGoals((prev) =>
              prev.map((goal) =>
                goal.id === linkedGoal.id
                  ? { ...goal, linkedHabitId: undefined }
                  : goal,
              ),
            );
          }
        },
      },
    ]);
  };

  const toggleHabitCompletion = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        const isDoneToday = habit.completedOn === todayKey;
        return {
          ...habit,
          completedOn: isDoneToday ? null : todayKey,
        };
      }),
    );
  };

  const toggleDay = (
    day: DayKey,
    selected: DayKey[],
    setSelected: (days: DayKey[]) => void,
  ) => {
    if (selected.includes(day)) {
      setSelected(selected.filter((d) => d !== day));
    } else {
      setSelected([...selected, day]);
    }
  };

  const clearGoalForm = () => {
    setGoalTitle("");
    setGoalTime("");
    setGoalSpecific("");
    setGoalMeasurable("");
    setGoalAchievable("");
    setGoalRelevant("");
    setGoalTimeBound("");
    setGoalHabitTitle("");
    setGoalHabitDays([]);
    setEditingGoalId(null);
  };

  const cancelGoalForm = () => {
    setShowGoalForm(false);
    clearGoalForm();
  };

  const addGoal = () => {
    if (
      !goalTitle.trim() ||
      !goalTime.trim() ||
      !goalSpecific.trim() ||
      !goalMeasurable.trim() ||
      !goalTimeBound.trim()
    ) {
      return;
    }

    const newGoalId = String(Date.now());
    let linkedHabitId: string | undefined;

    if (goalHabitTitle.trim() && goalHabitDays.length > 0) {
      linkedHabitId = `${newGoalId}-habit`;

      const linkedHabit: DailyHabit = {
        id: linkedHabitId,
        title: goalHabitTitle.trim(),
        days: goalHabitDays,
        completedOn: null,
        linkedGoalId: newGoalId,
      };

      setHabits((prev) => [linkedHabit, ...prev]);
    }

    const newGoal: SmartGoal = {
      id: newGoalId,
      title: goalTitle.trim(),
      time: goalTime.trim(),
      specific: goalSpecific.trim(),
      measurable: goalMeasurable.trim(),
      achievable: goalAchievable.trim() || undefined,
      relevant: goalRelevant.trim() || undefined,
      timeBound: goalTimeBound.trim(),
      completed: false,
      linkedHabitId,
    };

    setGoals((prev) => [newGoal, ...prev]);
    setExpandedGoalId(newGoal.id);
    setSelectedGoalId(null);
    setShowGoalForm(false);
    clearGoalForm();
  };

  const startEditGoal = (goal: SmartGoal) => {
    setEditingGoalId(goal.id);
    setGoalTitle(goal.title);
    setGoalTime(goal.time);
    setGoalSpecific(goal.specific);
    setGoalMeasurable(goal.measurable);
    setGoalAchievable(goal.achievable ?? "");
    setGoalRelevant(goal.relevant ?? "");
    setGoalTimeBound(goal.timeBound);

    const linkedHabit = habits.find((habit) => habit.id === goal.linkedHabitId);
    setGoalHabitTitle(linkedHabit?.title ?? "");
    setGoalHabitDays(linkedHabit?.days ?? []);

    setExpandedGoalId(goal.id);
    setSelectedGoalId(null);
    setShowGoalForm(true);
  };

  const saveEditedGoal = () => {
    if (
      !editingGoalId ||
      !goalTitle.trim() ||
      !goalTime.trim() ||
      !goalSpecific.trim() ||
      !goalMeasurable.trim() ||
      !goalTimeBound.trim()
    ) {
      return;
    }

    const existingGoal = goals.find((goal) => goal.id === editingGoalId);
    const existingLinkedHabit = habits.find(
      (habit) => habit.id === existingGoal?.linkedHabitId,
    );

    let nextLinkedHabitId = existingGoal?.linkedHabitId;

    if (goalHabitTitle.trim() && goalHabitDays.length > 0) {
      if (existingLinkedHabit) {
        setHabits((prev) =>
          prev.map((habit) =>
            habit.id === existingLinkedHabit.id
              ? {
                  ...habit,
                  title: goalHabitTitle.trim(),
                  days: goalHabitDays,
                }
              : habit,
          ),
        );
      } else {
        const newLinkedHabitId = `${editingGoalId}-habit`;
        nextLinkedHabitId = newLinkedHabitId;

        setHabits((prev) => [
          {
            id: newLinkedHabitId,
            title: goalHabitTitle.trim(),
            days: goalHabitDays,
            completedOn: null,
            linkedGoalId: editingGoalId,
          },
          ...prev,
        ]);
      }
    } else if (existingLinkedHabit) {
      setHabits((prev) =>
        prev.filter((habit) => habit.id !== existingLinkedHabit.id),
      );
      nextLinkedHabitId = undefined;
    }

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === editingGoalId
          ? {
              ...goal,
              title: goalTitle.trim(),
              time: goalTime.trim(),
              specific: goalSpecific.trim(),
              measurable: goalMeasurable.trim(),
              achievable: goalAchievable.trim() || undefined,
              relevant: goalRelevant.trim() || undefined,
              timeBound: goalTimeBound.trim(),
              linkedHabitId: nextLinkedHabitId,
            }
          : goal,
      ),
    );

    setShowGoalForm(false);
    clearGoalForm();
  };

  const removeGoal = (id: string) => {
    const goal = goals.find((item) => item.id === id);

    if (goal?.linkedHabitId) {
      setHabits((prev) => prev.filter((habit) => habit.id !== goal.linkedHabitId));
    }

    setGoals((prev) => prev.filter((goalItem) => goalItem.id !== id));
    if (expandedGoalId === id) setExpandedGoalId(null);
    if (selectedGoalId === id) setSelectedGoalId(null);
    if (editingGoalId === id) cancelGoalForm();
  };

  const toggleGoal = (id: string) => {
    if (selectedGoalId) return;
    setExpandedGoalId((prev) => (prev === id ? null : id));
  };

  const selectGoal = (id: string) => {
    setSelectedGoalId(id);
  };

  const clearSelectedGoal = () => {
    setSelectedGoalId(null);
  };

  const markSelectedGoalCompleted = () => {
    if (!selectedGoalId) return;

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === selectedGoalId
          ? { ...goal, completed: !goal.completed }
          : goal,
      ),
    );

    setSelectedGoalId(null);
  };

  const deleteSelectedGoal = () => {
    if (!selectedGoalId) return;

    const selected = goals.find((goal) => goal.id === selectedGoalId);
    Alert.alert(
      "Delete SMART goal?",
      selected ? `Delete "${selected.title}"?` : "Delete this SMART goal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeGoal(selectedGoalId),
        },
      ],
    );
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
        <AccountabilityScreen
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          todayDayKey={todayDayKey}
          todayKey={todayKey}
          habits={habits}
          showHabitForm={showHabitForm}
          setShowHabitForm={setShowHabitForm}
          habitTitle={habitTitle}
          setHabitTitle={setHabitTitle}
          habitDays={habitDays}
          setHabitDays={setHabitDays}
          editingHabitId={editingHabitId}
          addHabit={addHabit}
          saveEditedHabit={saveEditedHabit}
          cancelHabitForm={cancelHabitForm}
          startEditHabit={startEditHabit}
          removeHabit={removeHabit}
          toggleHabitCompletion={toggleHabitCompletion}
          goals={goals}
          expandedGoalId={expandedGoalId}
          selectedGoalId={selectedGoalId}
          toggleGoal={toggleGoal}
          selectGoal={selectGoal}
          clearSelectedGoal={clearSelectedGoal}
          showGoalForm={showGoalForm}
          setShowGoalForm={setShowGoalForm}
          goalTitle={goalTitle}
          setGoalTitle={setGoalTitle}
          goalTime={goalTime}
          setGoalTime={setGoalTime}
          goalSpecific={goalSpecific}
          setGoalSpecific={setGoalSpecific}
          goalMeasurable={goalMeasurable}
          setGoalMeasurable={setGoalMeasurable}
          goalAchievable={goalAchievable}
          setGoalAchievable={setGoalAchievable}
          goalRelevant={goalRelevant}
          setGoalRelevant={setGoalRelevant}
          goalTimeBound={goalTimeBound}
          setGoalTimeBound={setGoalTimeBound}
          goalHabitTitle={goalHabitTitle}
          setGoalHabitTitle={setGoalHabitTitle}
          goalHabitDays={goalHabitDays}
          setGoalHabitDays={setGoalHabitDays}
          addGoal={addGoal}
          editingGoalId={editingGoalId}
          startEditGoal={startEditGoal}
          saveEditedGoal={saveEditedGoal}
          cancelGoalForm={cancelGoalForm}
          deleteSelectedGoal={deleteSelectedGoal}
          markSelectedGoalCompleted={markSelectedGoalCompleted}
          showGoalsHelp={showGoalsHelp}
          setShowGoalsHelp={setShowGoalsHelp}
          toggleDay={toggleDay}
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

function AccountabilityScreen(props: {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
  todayDayKey: DayKey;
  todayKey: string;

  habits: DailyHabit[];
  showHabitForm: boolean;
  setShowHabitForm: (v: boolean) => void;
  habitTitle: string;
  setHabitTitle: (v: string) => void;
  habitDays: DayKey[];
  setHabitDays: (v: DayKey[]) => void;
  editingHabitId: string | null;
  addHabit: () => void;
  saveEditedHabit: () => void;
  cancelHabitForm: () => void;
  startEditHabit: (habit: DailyHabit) => void;
  removeHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;

  goals: SmartGoal[];
  expandedGoalId: string | null;
  selectedGoalId: string | null;
  toggleGoal: (id: string) => void;
  selectGoal: (id: string) => void;
  clearSelectedGoal: () => void;
  showGoalForm: boolean;
  setShowGoalForm: (v: boolean) => void;
  goalTitle: string;
  setGoalTitle: (v: string) => void;
  goalTime: string;
  setGoalTime: (v: string) => void;
  goalSpecific: string;
  setGoalSpecific: (v: string) => void;
  goalMeasurable: string;
  setGoalMeasurable: (v: string) => void;
  goalAchievable: string;
  setGoalAchievable: (v: string) => void;
  goalRelevant: string;
  setGoalRelevant: (v: string) => void;
  goalTimeBound: string;
  setGoalTimeBound: (v: string) => void;
  goalHabitTitle: string;
  setGoalHabitTitle: (v: string) => void;
  goalHabitDays: DayKey[];
  setGoalHabitDays: (v: DayKey[]) => void;
  addGoal: () => void;
  editingGoalId: string | null;
  startEditGoal: (goal: SmartGoal) => void;
  saveEditedGoal: () => void;
  cancelGoalForm: () => void;
  deleteSelectedGoal: () => void;
  markSelectedGoalCompleted: () => void;
  showGoalsHelp: boolean;
  setShowGoalsHelp: (v: boolean) => void;
  toggleDay: (
    day: DayKey,
    selected: DayKey[],
    setSelected: (days: DayKey[]) => void,
  ) => void;
}) {
  const {
    activeTab,
    setActiveTab,
    todayDayKey,
    todayKey,

    habits,
    showHabitForm,
    setShowHabitForm,
    habitTitle,
    setHabitTitle,
    habitDays,
    setHabitDays,
    editingHabitId,
    addHabit,
    saveEditedHabit,
    cancelHabitForm,
    startEditHabit,
    removeHabit,
    toggleHabitCompletion,

    goals,
    expandedGoalId,
    selectedGoalId,
    toggleGoal,
    selectGoal,
    clearSelectedGoal,
    showGoalForm,
    setShowGoalForm,
    goalTitle,
    setGoalTitle,
    goalTime,
    setGoalTime,
    goalSpecific,
    setGoalSpecific,
    goalMeasurable,
    setGoalMeasurable,
    goalAchievable,
    setGoalAchievable,
    goalRelevant,
    setGoalRelevant,
    goalTimeBound,
    setGoalTimeBound,
    goalHabitTitle,
    setGoalHabitTitle,
    goalHabitDays,
    setGoalHabitDays,
    addGoal,
    editingGoalId,
    startEditGoal,
    saveEditedGoal,
    cancelGoalForm,
    deleteSelectedGoal,
    markSelectedGoalCompleted,
    showGoalsHelp,
    setShowGoalsHelp,
    toggleDay,
  } = props;

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);

  const linkedHabitMap = useMemo(() => {
    const map: Record<string, DailyHabit | undefined> = {};
    goals.forEach((goal) => {
      map[goal.id] = habits.find((habit) => habit.id === goal.linkedHabitId);
    });
    return map;
  }, [goals, habits]);

  const todaysHabits = habits.filter((habit) => habit.days.includes(todayDayKey));
  const otherHabits = habits.filter((habit) => !habit.days.includes(todayDayKey));

  return (
    <View style={{ flex: 1 }}>
      <GoalsHelpModal
        visible={showGoalsHelp}
        onClose={() => setShowGoalsHelp(false)}
      />

      <Pressable style={{ flex: 1 }} onPress={clearSelectedGoal}>
        <ScrollView
          style={styles.scrollBg}
          contentContainerStyle={styles.pagePad}
        >
          <Text style={styles.pageTitle}>Accountability</Text>
          <Text style={styles.pageSub}>
            Stay consistent with daily habits and bigger weekly goals
          </Text>

          <View style={styles.tabRow}>
            <TabButton
              label="Daily Habits"
              icon="✓"
              active={activeTab === "habits"}
              onPress={() => setActiveTab("habits")}
            />
            <TabButton
              label="SMART Goals"
              icon="◎"
              active={activeTab === "goals"}
              onPress={() => setActiveTab("goals")}
            />
          </View>

          <View style={{ height: 16 }} />

          {activeTab === "habits" ? (
            <View style={{ gap: 14, paddingBottom: 110 }}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Daily Habits</Text>
                <Text style={styles.cardSub}>
                  These reset automatically each new day at 12:00 AM. Hold to
                  delete.
                </Text>

                <View style={styles.addRow}>
                  <TextInput
                    value={habitTitle}
                    onChangeText={setHabitTitle}
                    placeholder="Add a daily habit..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    returnKeyType="done"
                    onSubmitEditing={() =>
                      showHabitForm
                        ? editingHabitId
                          ? saveEditedHabit()
                          : addHabit()
                        : setShowHabitForm(true)
                    }
                  />
                  <Pressable
                    style={styles.addBtnPurple}
                    onPress={() => setShowHabitForm(!showHabitForm)}
                  >
                    <Text style={styles.addBtnText}>{showHabitForm ? "×" : "＋"}</Text>
                  </Pressable>
                </View>

                {showHabitForm && (
                  <View style={styles.goalFormCard}>
                    <Text style={styles.goalFormTitle}>
                      {editingHabitId ? "Edit Daily Habit" : "Create Daily Habit"}
                    </Text>

                    <TextInput
                      value={habitTitle}
                      onChangeText={setHabitTitle}
                      placeholder="Habit title"
                      placeholderTextColor="#9CA3AF"
                      style={styles.input}
                    />

                    <View style={{ height: 12 }} />

                    <Text style={styles.formLabel}>Select days</Text>
                    <DaysSelector
                      selected={habitDays}
                      onToggle={(day) => toggleDay(day, habitDays, setHabitDays)}
                    />

                    <View style={styles.goalFormActions}>
                      <Pressable
                        style={styles.secondaryBtn}
                        onPress={cancelHabitForm}
                      >
                        <Text style={styles.secondaryBtnText}>Cancel</Text>
                      </Pressable>

                      <Pressable
                        style={styles.primarySmallBtn}
                        onPress={editingHabitId ? saveEditedHabit : addHabit}
                      >
                        <Text style={styles.primarySmallBtnText}>
                          {editingHabitId ? "Save Changes" : "Save Habit"}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                <View style={{ height: 12 }} />

                {todaysHabits.length > 0 ? (
                  <View>
                    <Text style={styles.sectionMiniTitle}>For Today</Text>
                    {todaysHabits.map((habit) => {
                      const doneToday = habit.completedOn === todayKey;

                      return (
                        <Pressable
                          key={habit.id}
                          style={[
                            styles.dailyHabitCard,
                            doneToday && styles.dailyHabitCardCompleted,
                          ]}
                          onLongPress={() => removeHabit(habit.id)}
                          delayLongPress={250}
                        >
                          <View style={styles.dailyHabitLeft}>
                            <View style={styles.dailyHabitTitleRow}>
                              <Text
                                style={[
                                  styles.dailyHabitTitle,
                                  doneToday && styles.completedTitle,
                                ]}
                              >
                                {habit.title}
                              </Text>

                              {habit.linkedGoalId ? (
                                <View style={styles.linkedBadge}>
                                  <Text style={styles.linkedBadgeText}>
                                    Goal habit
                                  </Text>
                                </View>
                              ) : null}
                            </View>

                            <DayDots days={habit.days} />
                          </View>

                          <View style={styles.dailyHabitRight}>
                            <Pressable
                              style={styles.goalEditBtn}
                              onPress={() => startEditHabit(habit)}
                            >
                              <Text style={styles.goalEditBtnText}>Edit</Text>
                            </Pressable>

                            <Pressable
                              style={[
                                styles.taskCheckBtn,
                                doneToday && styles.taskCheckBtnDone,
                              ]}
                              onPress={() => toggleHabitCompletion(habit.id)}
                            >
                              <Text
                                style={[
                                  styles.taskCheckBtnText,
                                  doneToday && styles.taskCheckBtnTextDone,
                                ]}
                              >
                                ✓
                              </Text>
                            </Pressable>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}

                {otherHabits.length > 0 ? (
                  <View style={{ marginTop: todaysHabits.length > 0 ? 16 : 0 }}>
                    <Text style={styles.sectionMiniTitle}>Other Days</Text>
                    {otherHabits.map((habit) => {
                      const doneToday = habit.completedOn === todayKey;

                      return (
                        <Pressable
                          key={habit.id}
                          style={styles.dailyHabitCard}
                          onLongPress={() => removeHabit(habit.id)}
                          delayLongPress={250}
                        >
                          <View style={styles.dailyHabitLeft}>
                            <View style={styles.dailyHabitTitleRow}>
                              <Text style={styles.dailyHabitTitle}>
                                {habit.title}
                              </Text>

                              {habit.linkedGoalId ? (
                                <View style={styles.linkedBadge}>
                                  <Text style={styles.linkedBadgeText}>
                                    Goal habit
                                  </Text>
                                </View>
                              ) : null}
                            </View>

                            <DayDots days={habit.days} />
                          </View>

                          <View style={styles.dailyHabitRight}>
                            <Pressable
                              style={styles.goalEditBtn}
                              onPress={() => startEditHabit(habit)}
                            >
                              <Text style={styles.goalEditBtnText}>Edit</Text>
                            </Pressable>

                            <Pressable
                              style={[
                                styles.taskCheckBtn,
                                !habit.days.includes(todayDayKey) &&
                                  styles.taskCheckBtnDisabled,
                                doneToday && styles.taskCheckBtnDone,
                              ]}
                              disabled={!habit.days.includes(todayDayKey)}
                              onPress={() => toggleHabitCompletion(habit.id)}
                            >
                              <Text
                                style={[
                                  styles.taskCheckBtnText,
                                  !habit.days.includes(todayDayKey) &&
                                    styles.taskCheckBtnTextDisabled,
                                  doneToday && styles.taskCheckBtnTextDone,
                                ]}
                              >
                                ✓
                              </Text>
                            </Pressable>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={{ gap: 14, paddingBottom: 110 }}>
              <View style={styles.card}>
                <View style={styles.goalHeaderTopRow}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={styles.sectionTitle}>Weekly SMART Goals</Text>
                  </View>

                  <Pressable
                    style={styles.helpBtn}
                    onPress={() => setShowGoalsHelp(true)}
                  >
                    <Text style={styles.helpBtnText}>?</Text>
                  </Pressable>
                </View>

                {showGoalForm && (
                  <Pressable onPress={() => {}} style={styles.goalFormCard}>
                    <Text style={styles.goalFormTitle}>
                      {editingGoalId
                        ? "Edit SMART Goal"
                        : "Create New SMART Goal"}
                    </Text>

                    <TextInput
                      value={goalTitle}
                      onChangeText={setGoalTitle}
                      placeholder="Goal title"
                      placeholderTextColor="#9CA3AF"
                      style={styles.input}
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                      value={goalTime}
                      onChangeText={setGoalTime}
                      placeholder="Time / due date"
                      placeholderTextColor="#9CA3AF"
                      style={styles.input}
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                      value={goalSpecific}
                      onChangeText={setGoalSpecific}
                      placeholder="Specific"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      style={styles.formTextArea}
                      textAlignVertical="top"
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                      value={goalMeasurable}
                      onChangeText={setGoalMeasurable}
                      placeholder="Measurable"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      style={styles.formTextArea}
                      textAlignVertical="top"
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                      value={goalAchievable}
                      onChangeText={setGoalAchievable}
                      placeholder="Achievable (optional)"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      style={styles.formTextArea}
                      textAlignVertical="top"
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                      value={goalRelevant}
                      onChangeText={setGoalRelevant}
                      placeholder="Relevant (optional)"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      style={styles.formTextArea}
                      textAlignVertical="top"
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                      value={goalTimeBound}
                      onChangeText={setGoalTimeBound}
                      placeholder="Time-bound"
                      placeholderTextColor="#9CA3AF"
                      multiline
                      style={styles.formTextArea}
                      textAlignVertical="top"
                    />

                    <View style={styles.optionalDivider}>
                      <Text style={styles.optionalDividerText}>
                        Optional linked daily habit
                      </Text>
                    </View>

                    <TextInput
                      value={goalHabitTitle}
                      onChangeText={setGoalHabitTitle}
                      placeholder="Daily habit title (optional)"
                      placeholderTextColor="#9CA3AF"
                      style={styles.input}
                    />

                    <View style={{ height: 12 }} />

                    <Text style={styles.formLabel}>Habit days (optional)</Text>
                    <DaysSelector
                      selected={goalHabitDays}
                      onToggle={(day) =>
                        toggleDay(day, goalHabitDays, setGoalHabitDays)
                      }
                    />

                    <View style={styles.goalFormActions}>
                      <Pressable
                        style={styles.secondaryBtn}
                        onPress={cancelGoalForm}
                      >
                        <Text style={styles.secondaryBtnText}>Cancel</Text>
                      </Pressable>

                      <Pressable
                        style={styles.primarySmallBtn}
                        onPress={editingGoalId ? saveEditedGoal : addGoal}
                      >
                        <Text style={styles.primarySmallBtnText}>
                          {editingGoalId ? "Save Changes" : "Save Goal"}
                        </Text>
                      </Pressable>
                    </View>
                  </Pressable>
                )}

                <View style={{ marginTop: 12 }}>
                  {goals.map((goal) => {
                    const expanded = expandedGoalId === goal.id;
                    const selected = selectedGoalId === goal.id;
                    const linkedHabit = linkedHabitMap[goal.id];

                    return (
                      <Pressable
                        key={goal.id}
                        onPress={() => toggleGoal(goal.id)}
                        onLongPress={() => selectGoal(goal.id)}
                        delayLongPress={250}
                        style={[
                          styles.smartGoalCard,
                          selected && styles.smartGoalCardSelected,
                          goal.completed && styles.smartGoalCardCompleted,
                        ]}
                      >
                        <View style={styles.smartGoalHeader}>
                          <View style={{ flex: 1, paddingRight: 10 }}>
                            <View style={styles.goalTitleRow}>
                              <Text
                                style={[
                                  styles.smartGoalTitle,
                                  goal.completed && styles.completedTitle,
                                ]}
                              >
                                {goal.title}
                              </Text>
                              {goal.completed ? (
                                <View style={styles.completedBadge}>
                                  <Text style={styles.completedBadgeText}>
                                    Completed
                                  </Text>
                                </View>
                              ) : null}
                            </View>

                            <Text style={styles.smartGoalTime}>{goal.time}</Text>

                            {linkedHabit ? (
                              <View style={styles.linkedTaskPreview}>
                                <Text style={styles.linkedTaskPreviewText}>
                                  Linked habit: {linkedHabit.title}
                                </Text>
                                <DayDots days={linkedHabit.days} compact />
                              </View>
                            ) : null}
                          </View>

                          <View style={styles.goalHeaderRight}>
                            <Text style={styles.goalExpandIcon}>
                              {expanded ? "−" : "+"}
                            </Text>
                          </View>
                        </View>

                        {expanded && (
                          <View style={styles.smartGoalExpanded}>
                            <SmartGoalField label="S" text={goal.specific} />
                            <SmartGoalField label="M" text={goal.measurable} />
                            {goal.achievable ? (
                              <SmartGoalField
                                label="A"
                                text={goal.achievable}
                              />
                            ) : null}
                            {goal.relevant ? (
                              <SmartGoalField label="R" text={goal.relevant} />
                            ) : null}
                            <SmartGoalField label="T" text={goal.timeBound} />

                            {linkedHabit ? (
                              <View style={styles.linkedTaskExpandedBox}>
                                <Text style={styles.linkedTaskExpandedTitle}>
                                  Linked Daily Habit
                                </Text>
                                <Text style={styles.linkedTaskExpandedText}>
                                  {linkedHabit.title}
                                </Text>
                                <DayDots days={linkedHabit.days} />
                              </View>
                            ) : null}

                            <View style={styles.goalEditRow}>
                              <Pressable
                                style={styles.goalEditBtn}
                                onPress={() => startEditGoal(goal)}
                              >
                                <Text style={styles.goalEditBtnText}>Edit</Text>
                              </Pressable>
                            </View>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </Pressable>

      {activeTab === "goals" && selectedGoalId ? (
        <>
          <Pressable
            style={styles.bottomLeftActionBtn}
            onPress={deleteSelectedGoal}
          >
            <Text style={styles.bottomActionIcon}>🗑</Text>
          </Pressable>

          <Pressable
            style={styles.floatingAddBtn}
            onPress={markSelectedGoalCompleted}
          >
            <Text style={styles.bottomActionIcon}>
              {selectedGoal?.completed ? "↺" : "✓"}
            </Text>
          </Pressable>
        </>
      ) : activeTab === "goals" ? (
        <Pressable
          style={styles.floatingAddBtn}
          onPress={() => setShowGoalForm(!showGoalForm)}
        >
          <Text style={styles.floatingAddBtnText}>
            {showGoalForm ? "×" : "+"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function DaysSelector(props: {
  selected: DayKey[];
  onToggle: (day: DayKey) => void;
}) {
  const { selected, onToggle } = props;

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
            <Text style={[styles.dayCircleText, active && styles.dayCircleTextActive]}>
              {day.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DayDots(props: { days: DayKey[]; compact?: boolean }) {
  const { days, compact = false } = props;

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

function GoalsHelpModal(props: { visible: boolean; onClose: () => void }) {
  const { visible, onClose } = props;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.helpModalCard}>
          <View style={styles.helpIconWrap}>
            <Text style={styles.helpIconText}>?</Text>
          </View>

          <Text style={styles.helpModalTitle}>How to Use Goals</Text>
          <Text style={styles.helpModalSub}>
            A quick guide to your SMART goals tab
          </Text>

          <View style={styles.helpList}>
            <HelpRow emoji="👆" text="Tap a goal to expand or collapse it" />
            <HelpRow emoji="✋" text="Hold a goal to select it" />
            <HelpRow
              emoji="🗑"
              text="Use the trash button to delete a selected goal"
            />
            <HelpRow
              emoji="✓"
              text="Use the check button to mark a selected goal complete"
            />
            <HelpRow
              emoji="＋"
              text="Use the plus button to add a new SMART goal"
            />
            <HelpRow
              emoji="◎"
              text="You can optionally link a daily habit to any SMART goal"
            />
          </View>

          <Pressable style={styles.helpGotItBtn} onPress={onClose}>
            <Text style={styles.helpGotItBtnText}>Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function HelpRow(props: { emoji: string; text: string }) {
  const { emoji, text } = props;

  return (
    <View style={styles.helpRow}>
      <View style={styles.helpEmojiCircle}>
        <Text style={styles.helpEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.helpRowText}>{text}</Text>
    </View>
  );
}

function SmartGoalField(props: { label: string; text: string }) {
  const { label, text } = props;

  return (
    <View style={styles.smartFieldWrap}>
      <View style={styles.goalPill}>
        <Text style={styles.goalPillText}>{label}</Text>
      </View>
      <Text style={styles.smartFieldText}>{text}</Text>
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
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
      {active && <View style={styles.simpleUnderline} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scrollBg: { flex: 1, backgroundColor: COLORS.bg },

  centerWrap: { padding: 18, flexGrow: 1, justifyContent: "center" },
  welcomeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    shadowColor: "#231F5B",
    shadowOpacity: 0.06,
    shadowRadius: 16,
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
    backgroundColor: COLORS.primary,
  },
  heart: {
    fontSize: 30,
    color: "#FFFFFF",
    marginTop: 1,
    fontWeight: "900",
  },
  welcomeTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  welcomeSub: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.subtext,
    textAlign: "center",
  },
  promptTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.pinkText,
    textAlign: "center",
  },
  textArea: {
    marginTop: 14,
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  primaryBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
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
  skipText: { color: COLORS.subtext, fontSize: 13, fontWeight: "600" },

  pagePad: { padding: 16, paddingBottom: 30 },
  pageTitle: { fontSize: 26, fontWeight: "900", color: COLORS.primary },
  pageSub: { marginTop: 4, fontSize: 13, color: COLORS.subtext },

  tabRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  tabBtn: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 120,
  },
  tabIcon: { fontSize: 18, color: "#A3A0B8" },
  tabIconActive: { color: COLORS.primary },
  tabLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#A3A0B8",
  },
  tabLabelActive: { color: COLORS.primary },
  simpleUnderline: {
    marginTop: 8,
    height: 3,
    width: 68,
    borderRadius: 999,
    backgroundColor: COLORS.pinkText,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#231F5B",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: "900", color: COLORS.text },
  cardSub: { marginTop: 4, fontSize: 12, color: COLORS.subtext },
  sectionTitle: { fontSize: 14, fontWeight: "900", color: COLORS.text },
  sectionMiniTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.subtext,
    marginBottom: 4,
  },
  formLabel: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },

  addRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },

  addBtnPurple: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: -1,
  },

  goalHeaderTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  helpBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: "#FFC3D8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
  },
  helpBtnText: {
    color: COLORS.pinkText,
    fontSize: 16,
    fontWeight: "900",
    marginTop: -1,
  },

  goalFormCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFF6FA",
    padding: 12,
  },
  goalFormTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.pinkText,
    marginBottom: 10,
  },
  formTextArea: {
    minHeight: 74,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  goalFormActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  primarySmallBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  primarySmallBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: {
    borderColor: COLORS.pinkText,
    backgroundColor: COLORS.pinkText,
  },
  dayCircleText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.subtext,
  },
  dayCircleTextActive: {
    color: COLORS.white,
  },

  dailyHabitCard: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  dailyHabitCardCompleted: {
    backgroundColor: "#FFF6FA",
  },
  dailyHabitLeft: {
    flex: 1,
    gap: 8,
  },
  dailyHabitRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dailyHabitTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  dailyHabitTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },

  taskCheckBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: COLORS.pinkText,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  taskCheckBtnDone: {
    backgroundColor: COLORS.pinkText,
    borderColor: COLORS.pinkText,
  },
  taskCheckBtnDisabled: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  taskCheckBtnText: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.pinkText,
    marginTop: -1,
  },
  taskCheckBtnTextDone: {
    color: COLORS.white,
  },
  taskCheckBtnTextDisabled: {
    color: "#D1D5DB",
  },

  dayDotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dayDotsRowCompact: {
    marginTop: 6,
  },
  dayDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dayDotCompact: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  dayDotActive: {
    borderColor: COLORS.pinkText,
    backgroundColor: COLORS.pinkSoft,
  },
  dayDotText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#A3A0B8",
  },
  dayDotTextCompact: {
    fontSize: 9,
  },
  dayDotTextActive: {
    color: COLORS.pinkText,
  },

  smartGoalCard: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  smartGoalCardSelected: {
    borderColor: COLORS.pinkText,
    borderWidth: 2,
  },
  smartGoalCardCompleted: {
    backgroundColor: "#FFF6FA",
  },
  smartGoalHeader: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFF3F8",
  },
  goalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  smartGoalTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: COLORS.subtext,
  },
  smartGoalTime: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "600",
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: "#FFC3D8",
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.pinkText,
  },
  goalHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalExpandIcon: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.pinkText,
    width: 22,
    textAlign: "center",
  },
  smartGoalExpanded: {
    padding: 12,
    backgroundColor: COLORS.white,
  },
  smartFieldWrap: {
    marginBottom: 12,
  },
  smartFieldText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17,
    color: "#374151",
  },
  goalPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: "#FFC3D8",
  },
  goalPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.pinkText,
  },
  goalEditRow: {
    marginTop: 4,
    alignItems: "flex-end",
  },
  goalEditBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goalEditBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },

  linkedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: "#FFC3D8",
  },
  linkedBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.pinkText,
  },
  linkedTaskPreview: {
    marginTop: 8,
  },
  linkedTaskPreviewText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.subtext,
    marginBottom: 6,
  },
  linkedTaskExpandedBox: {
    marginTop: 6,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFF6FA",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkedTaskExpandedTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.pinkText,
    marginBottom: 6,
  },
  linkedTaskExpandedText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#374151",
    marginBottom: 8,
  },

  optionalDivider: {
    marginTop: 14,
    marginBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  optionalDividerText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.pinkText,
  },

  floatingAddBtn: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#231F5B",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  bottomLeftActionBtn: {
    position: "absolute",
    left: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.pinkText,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#231F5B",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  floatingAddBtnText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: -2,
  },
  bottomActionIcon: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: -1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  helpModalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#231F5B",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  helpIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: "#FFC3D8",
  },
  helpIconText: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.pinkText,
    marginTop: -1,
  },
  helpModalTitle: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
  },
  helpModalSub: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.subtext,
    textAlign: "center",
  },
  helpList: {
    marginTop: 18,
    gap: 10,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  helpEmojiCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },
  helpEmoji: {
    fontSize: 14,
  },
  helpRowText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
    fontWeight: "600",
  },
  helpGotItBtn: {
    marginTop: 18,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  helpGotItBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});