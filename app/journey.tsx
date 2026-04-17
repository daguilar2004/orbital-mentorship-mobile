import { SafeAreaView } from "react-native-safe-area-context";

import AccountabilityScreen from "../components/accountability/AccountabilityScreen";
import WelcomeScreen from "../components/accountability/WelcomeScreen";
import { useGoalForm } from "../hooks/useGoalForm";
import { useHabitForm } from "../hooks/useHabitForm";
import { useJourneyData } from "../hooks/useJourneyData";
import { useJourneyUi } from "../hooks/useJourneyUi";
import { styles } from "../styles/accountabilityStyles";
import { getTodayDayKey, getTodayKey } from "../utils/accountabilityDate";

export default function Journey() {
  const todayKey = getTodayKey();
  const todayDayKey = getTodayDayKey();

  const {
    introDone,
    reflection,
    setReflection,
    activeTab,
    setActiveTab,
    showGoalsHelp,
    setShowGoalsHelp,
    beginJourney,
    skipJourneyIntro,
  } = useJourneyUi();

  const {
    habits,
    goals,
    expandedGoalId,
    selectedHabitId,
    selectedGoalId,
    setExpandedGoalId,
    addHabit,
    saveEditedHabit,
    removeHabit,
    toggleHabitCompletion,
    selectHabit,
    clearSelectedHabit,
    markSelectedHabitCompleted,
    deleteSelectedHabit,
    addGoal,
    saveEditedGoal,
    toggleGoal,
    selectGoal,
    clearSelectedGoal,
    markSelectedGoalCompleted,
    deleteSelectedGoal,
  } = useJourneyData();

  const {
    showHabitForm,
    setShowHabitForm,
    editingHabitId,
    habitTitle,
    setHabitTitle,
    habitDays,
    setHabitDays,
    cancelHabitForm,
    handleAddHabit,
    startEditHabit,
    handleSaveEditedHabit,
    toggleDay,
  } = useHabitForm({
    addHabit,
    saveEditedHabit,
  });

  const {
    showGoalForm,
    setShowGoalForm,
    editingGoalId,
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
    cancelGoalForm,
    handleAddGoal,
    startEditGoal,
    handleSaveEditedGoal,
  } = useGoalForm({
    habits,
    addGoal,
    saveEditedGoal,
    setExpandedGoalId,
  });

  return (
    <SafeAreaView style={styles.safe}>
      {!introDone ? (
        <WelcomeScreen
          reflection={reflection}
          setReflection={setReflection}
          onBegin={beginJourney}
          onSkip={skipJourneyIntro}
        />
      ) : (
        <AccountabilityScreen
          ui={{
            activeTab,
            setActiveTab,
            todayDayKey,
            todayKey,
            showGoalsHelp,
            setShowGoalsHelp,
          }}
          habits={habits}
          habitForm={{
            showHabitForm,
            setShowHabitForm,
            habitTitle,
            setHabitTitle,
            habitDays,
            setHabitDays,
            editingHabitId,
            addHabit: handleAddHabit,
            saveEditedHabit: handleSaveEditedHabit,
            cancelHabitForm,
            toggleDay,
          }}
          habitActions={{
            selectedHabitId,
            startEditHabit,
            toggleHabitCompletion,
            selectHabit,
            clearSelectedHabit,
            markSelectedHabitCompleted,
            deleteSelectedHabit,
          }}
          goals={goals}
          goalForm={{
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
            addGoal: handleAddGoal,
            editingGoalId,
            saveEditedGoal: handleSaveEditedGoal,
            cancelGoalForm,
            toggleDay,
          }}
          goalActions={{
            expandedGoalId,
            selectedGoalId,
            toggleGoal,
            selectGoal,
            clearSelectedGoal,
            startEditGoal,
            deleteSelectedGoal,
            markSelectedGoalCompleted,
          }}
        />
      )}
    </SafeAreaView>
  );
}
