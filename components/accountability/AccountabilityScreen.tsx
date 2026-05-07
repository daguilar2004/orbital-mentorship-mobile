import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../styles/accountabilityStyles";
import {
  DailyHabit,
  DayKey,
  SmartGoal,
  TabKey,
} from "../../types/accountability";
import FloatingActionButtons from "./FloatingActionButtons";
import GoalsHelpModal from "./GoalsHelpModal";
import GoalsTabContent from "./GoalsTabContent";
import HabitsTabContent from "./HabitsTabContent";
import TabButton from "./TabButton";

type ScreenUiProps = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  todayDayKey: DayKey;
  todayKey: string;
  showGoalsHelp: boolean;
  setShowGoalsHelp: (value: boolean) => void;
};

type HabitFormProps = {
  showHabitForm: boolean;
  setShowHabitForm: (value: boolean) => void;
  habitTitle: string;
  setHabitTitle: (value: string) => void;
  habitDays: DayKey[];
  setHabitDays: (value: DayKey[]) => void;
  editingHabitId: string | null;
  addHabit: () => void;
  saveEditedHabit: () => void;
  cancelHabitForm: () => void;
  toggleDay: (
    day: DayKey,
    selected: DayKey[],
    setSelected: (days: DayKey[]) => void,
  ) => void;
};

type HabitActionsProps = {
  selectedHabitId: string | null;
  startEditHabit: (habit: DailyHabit) => void;
  toggleHabitCompletion: (id: string) => void;
  selectHabit: (id: string) => void;
  clearSelectedHabit: () => void;
  markSelectedHabitCompleted: () => void;
  deleteSelectedHabit: () => void;
};

type GoalFormProps = {
  showGoalForm: boolean;
  setShowGoalForm: (value: boolean) => void;
  goalTitle: string;
  setGoalTitle: (value: string) => void;
  goalTime: string;
  setGoalTime: (value: string) => void;
  goalSpecific: string;
  setGoalSpecific: (value: string) => void;
  goalMeasurable: string;
  setGoalMeasurable: (value: string) => void;
  goalAchievable: string;
  setGoalAchievable: (value: string) => void;
  goalRelevant: string;
  setGoalRelevant: (value: string) => void;
  goalTimeBound: string;
  setGoalTimeBound: (value: string) => void;
  goalHabitTitle: string;
  setGoalHabitTitle: (value: string) => void;
  goalHabitDays: DayKey[];
  setGoalHabitDays: (value: DayKey[]) => void;
  addGoal: () => void;
  editingGoalId: string | null;
  saveEditedGoal: () => void;
  cancelGoalForm: () => void;
  toggleDay: (
    day: DayKey,
    selected: DayKey[],
    setSelected: (days: DayKey[]) => void,
  ) => void;
};

type GoalActionsProps = {
  expandedGoalId: string | null;
  selectedGoalId: string | null;
  toggleGoal: (id: string) => void;
  selectGoal: (id: string) => void;
  clearSelectedGoal: () => void;
  startEditGoal: (goal: SmartGoal) => void;
  deleteSelectedGoal: () => void;
  markSelectedGoalCompleted: () => void;
};

type Props = {
  ui: ScreenUiProps;
  habits: DailyHabit[];
  habitForm: HabitFormProps;
  habitActions: HabitActionsProps;
  goals: SmartGoal[];
  goalForm: GoalFormProps;
  goalActions: GoalActionsProps;
};

export default function AccountabilityScreen({
  ui,
  habits,
  habitForm,
  habitActions,
  goals,
  goalForm,
  goalActions,
}: Props) {
  const {
    activeTab,
    setActiveTab,
    todayDayKey,
    todayKey,
    showGoalsHelp,
    setShowGoalsHelp,
  } = ui;

  const {
    selectedHabitId,
    clearSelectedHabit,
    deleteSelectedHabit,
    markSelectedHabitCompleted,
  } = habitActions;

  const {
    selectedGoalId,
    clearSelectedGoal,
    deleteSelectedGoal,
    markSelectedGoalCompleted,
  } = goalActions;

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);
  const selectedHabit = habits.find((habit) => habit.id === selectedHabitId);

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
            <HabitsTabContent
              habits={habits}
              todayDayKey={todayDayKey}
              todayKey={todayKey}
              showHabitForm={habitForm.showHabitForm}
              setShowHabitForm={habitForm.setShowHabitForm}
              habitTitle={habitForm.habitTitle}
              setHabitTitle={habitForm.setHabitTitle}
              habitDays={habitForm.habitDays}
              setHabitDays={habitForm.setHabitDays}
              editingHabitId={habitForm.editingHabitId}
              selectedHabitId={habitActions.selectedHabitId}
              addHabit={habitForm.addHabit}
              saveEditedHabit={habitForm.saveEditedHabit}
              cancelHabitForm={habitForm.cancelHabitForm}
              startEditHabit={habitActions.startEditHabit}
              toggleHabitCompletion={habitActions.toggleHabitCompletion}
              selectHabit={habitActions.selectHabit}
              clearSelectedHabit={habitActions.clearSelectedHabit}
              toggleDay={habitForm.toggleDay}
            />
          ) : (
            <GoalsTabContent
              habits={habits}
              goals={goals}
              expandedGoalId={goalActions.expandedGoalId}
              selectedGoalId={goalActions.selectedGoalId}
              showGoalForm={goalForm.showGoalForm}
              setShowGoalForm={goalForm.setShowGoalForm}
              goalTitle={goalForm.goalTitle}
              setGoalTitle={goalForm.setGoalTitle}
              goalTime={goalForm.goalTime}
              setGoalTime={goalForm.setGoalTime}
              goalSpecific={goalForm.goalSpecific}
              setGoalSpecific={goalForm.setGoalSpecific}
              goalMeasurable={goalForm.goalMeasurable}
              setGoalMeasurable={goalForm.setGoalMeasurable}
              goalAchievable={goalForm.goalAchievable}
              setGoalAchievable={goalForm.setGoalAchievable}
              goalRelevant={goalForm.goalRelevant}
              setGoalRelevant={goalForm.setGoalRelevant}
              goalTimeBound={goalForm.goalTimeBound}
              setGoalTimeBound={goalForm.setGoalTimeBound}
              goalHabitTitle={goalForm.goalHabitTitle}
              setGoalHabitTitle={goalForm.setGoalHabitTitle}
              goalHabitDays={goalForm.goalHabitDays}
              setGoalHabitDays={goalForm.setGoalHabitDays}
              addGoal={goalForm.addGoal}
              editingGoalId={goalForm.editingGoalId}
              startEditGoal={goalActions.startEditGoal}
              saveEditedGoal={goalForm.saveEditedGoal}
              cancelGoalForm={goalForm.cancelGoalForm}
              toggleGoal={goalActions.toggleGoal}
              selectGoal={goalActions.selectGoal}
              showGoalsHelp={showGoalsHelp}
              setShowGoalsHelp={setShowGoalsHelp}
              toggleDay={goalForm.toggleDay}
            />
          )}
        </ScrollView>
      </Pressable>

      <FloatingActionButtons
        activeTab={activeTab}
        todayKey={todayKey}
        showHabitForm={habitForm.showHabitForm}
        setShowHabitForm={habitForm.setShowHabitForm}
        selectedHabitId={selectedHabitId}
        selectedHabit={selectedHabit}
        deleteSelectedHabit={deleteSelectedHabit}
        markSelectedHabitCompleted={markSelectedHabitCompleted}
        showGoalForm={goalForm.showGoalForm}
        setShowGoalForm={goalForm.setShowGoalForm}
        selectedGoalId={selectedGoalId}
        selectedGoal={selectedGoal}
        deleteSelectedGoal={deleteSelectedGoal}
        markSelectedGoalCompleted={markSelectedGoalCompleted}
      />
    </View>
  );
}
