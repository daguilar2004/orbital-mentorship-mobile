import { useEffect, useState } from "react";
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

type Habit = {
  id: string;
  title: string;
  completed: boolean;
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
};

export default function Journey() {
  const [introDone, setIntroDone] = useState(false);
  const [reflection, setReflection] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  const [habitInput, setHabitInput] = useState("");
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "h1",
      title: "Morning meditation",
      completed: false,
    },
    {
      id: "h2",
      title: "Daily coding practice",
      completed: false,
    },
  ]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

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
    },
  ]);

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

  const [showGoalsHelp, setShowGoalsHelp] = useState(false);
  const [hasSeenGoalsHelp, setHasSeenGoalsHelp] = useState(false);

  useEffect(() => {
    if (activeTab === "goals" && !hasSeenGoalsHelp) {
      setShowGoalsHelp(true);
      setHasSeenGoalsHelp(true);
    }
  }, [activeTab, hasSeenGoalsHelp]);

  const clearHabitForm = () => {
    setHabitInput("");
    setEditingHabitId(null);
  };

  const cancelHabitForm = () => {
    setShowHabitForm(false);
    clearHabitForm();
  };

  const addHabit = () => {
    const title = habitInput.trim();
    if (!title) return;

    const newHabit: Habit = {
      id: String(Date.now()),
      title,
      completed: false,
    };

    setHabits((prev) => [newHabit, ...prev]);
    setShowHabitForm(false);
    clearHabitForm();
  };

  const startEditHabit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setHabitInput(habit.title);
    setShowHabitForm(true);
  };

  const saveEditedHabit = () => {
    const title = habitInput.trim();
    if (!editingHabitId || !title) return;

    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === editingHabitId
          ? {
              ...habit,
              title,
            }
          : habit,
      ),
    );

    setShowHabitForm(false);
    clearHabitForm();
  };

  const confirmRemoveHabit = (id: string) => {
    Alert.alert("Delete task?", "Do you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setHabits((prev) => prev.filter((x) => x.id !== id));
        },
      },
    ]);
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  const clearGoalForm = () => {
    setGoalTitle("");
    setGoalTime("");
    setGoalSpecific("");
    setGoalMeasurable("");
    setGoalAchievable("");
    setGoalRelevant("");
    setGoalTimeBound("");
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

    const newGoal: SmartGoal = {
      id: String(Date.now()),
      title: goalTitle.trim(),
      time: goalTime.trim(),
      specific: goalSpecific.trim(),
      measurable: goalMeasurable.trim(),
      achievable: goalAchievable.trim() || undefined,
      relevant: goalRelevant.trim() || undefined,
      timeBound: goalTimeBound.trim(),
      completed: false,
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
            }
          : goal,
      ),
    );

    setShowGoalForm(false);
    clearGoalForm();
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
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
          onPress: () => {
            removeGoal(selectedGoalId);
          },
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
        <MyJourneyScreen
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          habitInput={habitInput}
          setHabitInput={setHabitInput}
          habits={habits}
          toggleHabit={toggleHabit}
          showHabitForm={showHabitForm}
          setShowHabitForm={setShowHabitForm}
          addHabit={addHabit}
          editingHabitId={editingHabitId}
          startEditHabit={startEditHabit}
          saveEditedHabit={saveEditedHabit}
          cancelHabitForm={cancelHabitForm}
          removeHabit={confirmRemoveHabit}
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
          addGoal={addGoal}
          editingGoalId={editingGoalId}
          startEditGoal={startEditGoal}
          saveEditedGoal={saveEditedGoal}
          cancelGoalForm={cancelGoalForm}
          deleteSelectedGoal={deleteSelectedGoal}
          markSelectedGoalCompleted={markSelectedGoalCompleted}
          showGoalsHelp={showGoalsHelp}
          setShowGoalsHelp={setShowGoalsHelp}
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
  habits: Habit[];
  toggleHabit: (id: string) => void;
  showHabitForm: boolean;
  setShowHabitForm: (v: boolean) => void;
  addHabit: () => void;
  editingHabitId: string | null;
  startEditHabit: (habit: Habit) => void;
  saveEditedHabit: () => void;
  cancelHabitForm: () => void;
  removeHabit: (id: string) => void;

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
  addGoal: () => void;
  editingGoalId: string | null;
  startEditGoal: (goal: SmartGoal) => void;
  saveEditedGoal: () => void;
  cancelGoalForm: () => void;
  deleteSelectedGoal: () => void;
  markSelectedGoalCompleted: () => void;
  showGoalsHelp: boolean;
  setShowGoalsHelp: (v: boolean) => void;
}) {
  const {
    activeTab,
    setActiveTab,

    habitInput,
    setHabitInput,
    habits,
    toggleHabit,
    showHabitForm,
    setShowHabitForm,
    addHabit,
    editingHabitId,
    startEditHabit,
    saveEditedHabit,
    cancelHabitForm,
    removeHabit,

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
    addGoal,
    editingGoalId,
    startEditGoal,
    saveEditedGoal,
    cancelGoalForm,
    deleteSelectedGoal,
    markSelectedGoalCompleted,
    showGoalsHelp,
    setShowGoalsHelp,
  } = props;

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);

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
          <Text style={styles.pageSub}>Track your personal growth</Text>

          <View style={styles.tabRow}>
            <TabButton
              label="Tasks"
              icon="T"
              active={activeTab === "habits"}
              onPress={() => setActiveTab("habits")}
            />
            <TabButton
              label="Goals"
              icon="◎"
              active={activeTab === "goals"}
              onPress={() => setActiveTab("goals")}
            />
          </View>

          <View style={{ height: 16 }} />

          {activeTab === "habits" ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Daily Tasks</Text>
              <Text style={styles.cardSub}>
                Tap a task to mark it complete. Hold to delete.
              </Text>

              <View style={styles.addRow}>
                <TextInput
                  value={habitInput}
                  onChangeText={setHabitInput}
                  placeholder="Add a new task..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={() =>
                    showHabitForm ? (editingHabitId ? saveEditedHabit() : addHabit()) : setShowHabitForm(true)
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
                    {editingHabitId ? "Edit Task" : "Create New Task"}
                  </Text>

                  <TextInput
                    value={habitInput}
                    onChangeText={setHabitInput}
                    placeholder="Task title"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                  />

                  <View style={{ height: 10 }} />

                  <View style={{ height: 4 }} />

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
                        {editingHabitId ? "Save Changes" : "Save Task"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              <View style={{ height: 10 }} />

              {habits.map((habit) => {
                return (
                  <Pressable
                    key={habit.id}
                    style={[styles.smartGoalCard, habit.completed && styles.taskCardCompleted]}
                    onPress={() => toggleHabit(habit.id)}
                    onLongPress={() => removeHabit(habit.id)}
                    delayLongPress={250}
                  >
                    <View style={styles.smartGoalHeader}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <View style={styles.taskHeaderLeft}>
                          <View style={styles.taskTileIcon}>
                            <Text style={styles.taskTileIconText}>T</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.smartGoalTitle}>{habit.title}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.goalHeaderRight}>
                        <Pressable
                          style={styles.goalEditBtn}
                          onPress={() => startEditHabit(habit)}
                        >
                          <Text style={styles.goalEditBtnText}>Edit</Text>
                        </Pressable>
                        <Text style={[styles.taskCheckIcon, habit.completed && styles.taskCheckIconCompleted]}>
                          {habit.completed ? "✓" : ""}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
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

                            <Text style={styles.smartGoalTime}>
                              {goal.time}
                            </Text>
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
              emoji="?"
              text="Tap the question mark anytime to open this again"
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
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollBg: { flex: 1, backgroundColor: "#FFFFFF" },

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

  pagePad: { padding: 16, paddingBottom: 30 },
  pageTitle: { fontSize: 26, fontWeight: "900", color: "#111827" },
  pageSub: { marginTop: 4, fontSize: 13, color: "#6B7280" },

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
  formLabel: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "800",
    color: "#374151",
  },

  addRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
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

  rowText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    paddingRight: 10,
  },
  rowPurple: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

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

  goalHeaderTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  helpBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
  },
  helpBtnText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "900",
    marginTop: -1,
  },

  goalFormCard: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    backgroundColor: "#FAF5FF",
    padding: 12,
  },
  goalFormTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#7C3AED",
    marginBottom: 10,
  },
  formTextArea: {
    minHeight: 74,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#F3F4F6",
  },
  secondaryBtnText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "800",
  },
  primarySmallBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
  },
  primarySmallBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  smartGoalCard: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  smartGoalCardSelected: {
    borderColor: "#7C3AED",
    borderWidth: 2,
  },
  smartGoalCardCompleted: {
    backgroundColor: "#FCFCFC",
  },
  smartGoalHeader: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F5F3FF",
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
    color: "#111827",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
  smartGoalTime: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  taskHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taskTileIcon: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  taskTileIconText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#7C3AED",
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#EDE9FE",
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#7C3AED",
  },
  goalHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalExpandIcon: {
    fontSize: 22,
    fontWeight: "900",
    color: "#7C3AED",
    width: 22,
    textAlign: "center",
  },
  smartGoalExpanded: {
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  taskCardCompleted: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  taskCheckIcon: {
    fontSize: 20,
    fontWeight: "900",
    color: "#9CA3AF",
    width: 22,
    textAlign: "center",
  },
  taskCheckIconCompleted: {
    color: "#059669",
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
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  goalPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#7C3AED",
  },

  goalEditRow: {
    marginTop: 4,
    alignItems: "flex-end",
  },
  goalEditBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  goalEditBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7C3AED",
  },

  floatingAddBtn: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
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
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3E8FF",
    shadowColor: "#000",
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
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  helpIconText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#7C3AED",
    marginTop: -1,
  },
  helpModalTitle: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  helpModalSub: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
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
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
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
    color: "#374151",
    fontWeight: "600",
  },
  helpGotItBtn: {
    marginTop: 18,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  helpGotItBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
