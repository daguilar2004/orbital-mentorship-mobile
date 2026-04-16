import { useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { styles } from "../../styles/accountabilityStyles";
import {
  DailyHabit,
  DayKey,
  SmartGoal,
  TabKey,
} from "../../types/accountability";
import DayDots from "./DayDots";
import DaysSelector from "./DaysSelector";
import GoalsHelpModal from "./GoalsHelpModal";
import SmartGoalField from "./SmartGoalField";
import TabButton from "./TabButton";

type Props = {
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
  selectedHabitId: string | null;
  addHabit: () => void;
  saveEditedHabit: () => void;
  cancelHabitForm: () => void;
  startEditHabit: (habit: DailyHabit) => void;
  removeHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
  selectHabit: (id: string) => void;
  clearSelectedHabit: () => void;
  markSelectedHabitCompleted: () => void;
  deleteSelectedHabit: () => void;

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
};

export default function AccountabilityScreen(props: Props) {
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
    selectedHabitId,
    addHabit,
    saveEditedHabit,
    cancelHabitForm,
    startEditHabit,
    removeHabit,
    toggleHabitCompletion,
    selectHabit,
    clearSelectedHabit,
    markSelectedHabitCompleted,
    deleteSelectedHabit,

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
  const selectedHabit = habits.find((habit) => habit.id === selectedHabitId);

  const linkedHabitMap = useMemo(() => {
    const map: Record<string, DailyHabit | undefined> = {};
    goals.forEach((goal) => {
      map[goal.id] = habits.find((habit) => habit.id === goal.linkedHabitId);
    });
    return map;
  }, [goals, habits]);

  const todaysHabits = habits.filter((habit) =>
    habit.days.includes(todayDayKey),
  );
  const otherHabits = habits.filter(
    (habit) => !habit.days.includes(todayDayKey),
  );

  const clearSelections = () => {
    clearSelectedGoal();
    clearSelectedHabit();
  };

  return (
    <View style={{ flex: 1 }}>
      <GoalsHelpModal
        visible={showGoalsHelp}
        onClose={() => setShowGoalsHelp(false)}
      />

      <Pressable style={{ flex: 1 }} onPress={clearSelections}>
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
                  select.
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
                    <Text style={styles.addBtnText}>
                      {showHabitForm ? "×" : "＋"}
                    </Text>
                  </Pressable>
                </View>

                {showHabitForm && (
                  <View style={styles.goalFormCard}>
                    <Text style={styles.goalFormTitle}>
                      {editingHabitId
                        ? "Edit Daily Habit"
                        : "Create Daily Habit"}
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
                      onToggle={(day) =>
                        toggleDay(day, habitDays, setHabitDays)
                      }
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
                      const selected = selectedHabitId === habit.id;

                      return (
                        <Pressable
                          key={habit.id}
                          style={[
                            styles.dailyHabitCard,
                            doneToday && styles.dailyHabitCardCompleted,
                            selected && styles.smartGoalCardSelected,
                          ]}
                          onLongPress={() => selectHabit(habit.id)}
                          delayLongPress={250}
                          onPress={() => {
                            if (selectedHabitId) {
                              if (selected) {
                                clearSelectedHabit();
                              }
                              return;
                            }

                            toggleHabitCompletion(habit.id);
                          }}
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
                            {!selectedHabitId ? (
                              <>
                                <Pressable
                                  style={styles.goalEditBtn}
                                  onPress={() => startEditHabit(habit)}
                                >
                                  <Text style={styles.goalEditBtnText}>
                                    Edit
                                  </Text>
                                </Pressable>

                                <Pressable
                                  style={[
                                    styles.taskCheckBtn,
                                    doneToday && styles.taskCheckBtnDone,
                                  ]}
                                  onPress={() =>
                                    toggleHabitCompletion(habit.id)
                                  }
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
                              </>
                            ) : null}
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
                      const selected = selectedHabitId === habit.id;

                      return (
                        <Pressable
                          key={habit.id}
                          style={[
                            styles.dailyHabitCard,
                            selected && styles.smartGoalCardSelected,
                          ]}
                          onLongPress={() => selectHabit(habit.id)}
                          delayLongPress={250}
                          onPress={() => {
                            if (selectedHabitId) {
                              if (selected) {
                                clearSelectedHabit();
                              }
                              return;
                            }
                          }}
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
                            {!selectedHabitId ? (
                              <>
                                <Pressable
                                  style={styles.goalEditBtn}
                                  onPress={() => startEditHabit(habit)}
                                >
                                  <Text style={styles.goalEditBtnText}>
                                    Edit
                                  </Text>
                                </Pressable>

                                <Pressable
                                  style={[
                                    styles.taskCheckBtn,
                                    !habit.days.includes(todayDayKey) &&
                                      styles.taskCheckBtnDisabled,
                                    doneToday && styles.taskCheckBtnDone,
                                  ]}
                                  disabled={!habit.days.includes(todayDayKey)}
                                  onPress={() =>
                                    toggleHabitCompletion(habit.id)
                                  }
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
                              </>
                            ) : null}
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

                            <Text style={styles.smartGoalTime}>
                              {goal.time}
                            </Text>

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
      ) : activeTab === "habits" && selectedHabitId ? (
        <>
          <Pressable
            style={styles.bottomLeftActionBtn}
            onPress={deleteSelectedHabit}
          >
            <Text style={styles.bottomActionIcon}>🗑</Text>
          </Pressable>

          <Pressable
            style={styles.floatingAddBtn}
            onPress={markSelectedHabitCompleted}
          >
            <Text style={styles.bottomActionIcon}>
              {selectedHabit?.completedOn === todayKey ? "↺" : "✓"}
            </Text>
          </Pressable>
        </>
      ) : activeTab === "habits" ? (
        <Pressable
          style={styles.floatingAddBtn}
          onPress={() => setShowHabitForm(!showHabitForm)}
        >
          <Text style={styles.floatingAddBtnText}>
            {showHabitForm ? "×" : "+"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
