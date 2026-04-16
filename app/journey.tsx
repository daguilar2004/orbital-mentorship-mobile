import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountabilityScreen from "../components/accountability/AccountabilityScreen";
import WelcomeScreen from "../components/accountability/WelcomeScreen";
import { styles } from "../styles/accountabilityStyles";
import { DailyHabit, DayKey, SmartGoal, TabKey } from "../types/accountability";
import { getTodayDayKey, getTodayKey } from "../utils/accountabilityDate";
import {
  createGoal,
  createHabit,
  deleteGoal as deleteGoalApi,
  deleteHabit,
  getGoals,
  getHabits,
  toggleGoal as toggleGoalApi,
  toggleHabit,
  updateGoal,
  updateHabit,
} from "./Services/journey";

type ApiHabit = {
  _id?: string;
  id?: string;
  title?: string;
  days?: DayKey[];
  completedOn?: string | null;
  linkedGoalId?: string | null;
};

type ApiGoal = {
  _id?: string;
  id?: string;
  title?: string;
  time?: string;
  specific?: string;
  measurable?: string;
  achievable?: string;
  relevant?: string;
  timeBound?: string;
  completed?: boolean;
  linkedHabitId?: string | null;
};

const mapHabitFromApi = (habit: ApiHabit): DailyHabit => ({
  id: habit._id ?? habit.id ?? "",
  title: habit.title ?? "",
  days: (habit.days ?? []) as DayKey[],
  completedOn: habit.completedOn ?? null,
  linkedGoalId: habit.linkedGoalId ?? undefined,
});

const mapGoalFromApi = (goal: ApiGoal): SmartGoal => ({
  id: goal._id ?? goal.id ?? "",
  title: goal.title ?? "",
  time: goal.time ?? "",
  specific: goal.specific ?? "",
  measurable: goal.measurable ?? "",
  achievable: goal.achievable || undefined,
  relevant: goal.relevant || undefined,
  timeBound: goal.timeBound ?? "",
  completed: Boolean(goal.completed),
  linkedHabitId: goal.linkedHabitId ?? undefined,
});

export default function Journey() {
  const [introDone, setIntroDone] = useState(false);
  const [reflection, setReflection] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  const todayKey = getTodayKey();
  const todayDayKey = getTodayDayKey();

  const [habits, setHabits] = useState<DailyHabit[]>([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDays, setHabitDays] = useState<DayKey[]>([]);

  const [goals, setGoals] = useState<SmartGoal[]>([]);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
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

  const loadJourney = async () => {
    try {
      const [habitData, goalData] = await Promise.all([
        getHabits(),
        getGoals(),
      ]);

      const mappedHabits = (habitData ?? []).map(mapHabitFromApi);
      const mappedGoals = (goalData ?? []).map(mapGoalFromApi);

      setHabits(mappedHabits);
      setGoals(mappedGoals);

      setExpandedGoalId((prev) => {
        if (!prev) return mappedGoals[0]?.id ?? null;
        return mappedGoals.some((goal) => goal.id === prev)
          ? prev
          : (mappedGoals[0]?.id ?? null);
      });

      setSelectedGoalId((prev) =>
        prev && mappedGoals.some((goal) => goal.id === prev) ? prev : null,
      );

      setSelectedHabitId((prev) =>
        prev && mappedHabits.some((habit) => habit.id === prev) ? prev : null,
      );
    } catch (error) {
      console.error("Failed to load journey data:", error);
      Alert.alert("Error", "Failed to load journey data from the backend.");
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

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

  const addHabit = async () => {
    if (!habitTitle.trim() || habitDays.length === 0) return;

    try {
      await createHabit({
        title: habitTitle.trim(),
        days: habitDays,
        completedOn: null,
      });

      await loadJourney();
      setShowHabitForm(false);
      clearHabitForm();
    } catch (error) {
      console.error("Failed to create habit:", error);
      Alert.alert("Error", "Failed to create daily habit.");
    }
  };

  const startEditHabit = (habit: DailyHabit) => {
    setEditingHabitId(habit.id);
    setHabitTitle(habit.title);
    setHabitDays(habit.days);
    setShowHabitForm(true);
    setSelectedHabitId(null);
  };

  const saveEditedHabit = async () => {
    if (!editingHabitId || !habitTitle.trim() || habitDays.length === 0) return;

    try {
      await updateHabit(editingHabitId, {
        title: habitTitle.trim(),
        days: habitDays,
      });

      await loadJourney();
      setShowHabitForm(false);
      clearHabitForm();
    } catch (error) {
      console.error("Failed to update habit:", error);
      Alert.alert("Error", "Failed to update daily habit.");
    }
  };

  const removeHabit = async (id: string) => {
    const linkedGoal = goals.find((goal) => goal.linkedHabitId === id);

    try {
      if (linkedGoal) {
        await updateGoal(linkedGoal.id, { linkedHabitId: null });
      }

      await deleteHabit(id);
      await loadJourney();
      setSelectedHabitId((prev) => (prev === id ? null : prev));
    } catch (error) {
      console.error("Failed to delete habit:", error);
      Alert.alert("Error", "Failed to delete daily habit.");
    }
  };

  const toggleHabitCompletion = async (id: string) => {
    try {
      await toggleHabit(id);
      await loadJourney();
    } catch (error) {
      console.error("Failed to toggle habit:", error);
      Alert.alert("Error", "Failed to update habit completion.");
    }
  };

  const selectHabit = (id: string) => {
    setSelectedHabitId(id);
  };

  const clearSelectedHabit = () => {
    setSelectedHabitId(null);
  };

  const markSelectedHabitCompleted = async () => {
    if (!selectedHabitId) return;

    try {
      await toggleHabit(selectedHabitId);
      await loadJourney();
      setSelectedHabitId(null);
    } catch (error) {
      console.error("Failed to toggle habit completion:", error);
      Alert.alert("Error", "Failed to update daily habit.");
    }
  };

  const deleteSelectedHabit = () => {
    if (!selectedHabitId) return;

    const selected = habits.find((habit) => habit.id === selectedHabitId);

    Alert.alert(
      "Delete daily habit?",
      selected ? `Delete "${selected.title}"?` : "Delete this daily habit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const idToDelete = selectedHabitId;
            setSelectedHabitId(null);
            await removeHabit(idToDelete);
          },
        },
      ],
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

  const addGoal = async () => {
    if (
      !goalTitle.trim() ||
      !goalTime.trim() ||
      !goalSpecific.trim() ||
      !goalMeasurable.trim() ||
      !goalTimeBound.trim()
    ) {
      return;
    }

    try {
      const createdGoal = await createGoal({
        title: goalTitle.trim(),
        time: goalTime.trim(),
        specific: goalSpecific.trim(),
        measurable: goalMeasurable.trim(),
        achievable: goalAchievable.trim(),
        relevant: goalRelevant.trim(),
        timeBound: goalTimeBound.trim(),
        completed: false,
      });

      const createdGoalId = createdGoal?._id ?? createdGoal?.id;

      if (!createdGoalId) {
        throw new Error("Created goal ID was not returned by the backend.");
      }

      if (goalHabitTitle.trim() && goalHabitDays.length > 0) {
        const createdHabit = await createHabit({
          title: goalHabitTitle.trim(),
          days: goalHabitDays,
          completedOn: null,
          linkedGoalId: createdGoalId,
        });

        const createdHabitId = createdHabit?._id ?? createdHabit?.id;

        if (createdHabitId) {
          await updateGoal(createdGoalId, { linkedHabitId: createdHabitId });
        }
      }

      await loadJourney();
      setExpandedGoalId(createdGoalId);
      setSelectedGoalId(null);
      setShowGoalForm(false);
      clearGoalForm();
    } catch (error) {
      console.error("Failed to create goal:", error);
      Alert.alert("Error", "Failed to create SMART goal.");
    }
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

  const saveEditedGoal = async () => {
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

    try {
      const existingGoal = goals.find((goal) => goal.id === editingGoalId);
      const existingLinkedHabit = habits.find(
        (habit) => habit.id === existingGoal?.linkedHabitId,
      );

      await updateGoal(editingGoalId, {
        title: goalTitle.trim(),
        time: goalTime.trim(),
        specific: goalSpecific.trim(),
        measurable: goalMeasurable.trim(),
        achievable: goalAchievable.trim(),
        relevant: goalRelevant.trim(),
        timeBound: goalTimeBound.trim(),
      });

      if (goalHabitTitle.trim() && goalHabitDays.length > 0) {
        if (existingLinkedHabit) {
          await updateHabit(existingLinkedHabit.id, {
            title: goalHabitTitle.trim(),
            days: goalHabitDays,
            linkedGoalId: editingGoalId,
          });

          await updateGoal(editingGoalId, {
            linkedHabitId: existingLinkedHabit.id,
          });
        } else {
          const createdHabit = await createHabit({
            title: goalHabitTitle.trim(),
            days: goalHabitDays,
            completedOn: null,
            linkedGoalId: editingGoalId,
          });

          const createdHabitId = createdHabit?._id ?? createdHabit?.id;

          if (createdHabitId) {
            await updateGoal(editingGoalId, { linkedHabitId: createdHabitId });
          }
        }
      } else {
        if (existingLinkedHabit) {
          await deleteHabit(existingLinkedHabit.id);
        }

        await updateGoal(editingGoalId, { linkedHabitId: null });
      }

      await loadJourney();
      setExpandedGoalId(editingGoalId);
      setSelectedGoalId(null);
      setShowGoalForm(false);
      clearGoalForm();
    } catch (error) {
      console.error("Failed to update goal:", error);
      Alert.alert("Error", "Failed to update SMART goal.");
    }
  };

  const removeGoal = async (id: string) => {
    try {
      const goal = goals.find((item) => item.id === id);

      if (goal?.linkedHabitId) {
        await deleteHabit(goal.linkedHabitId);
      }

      await deleteGoalApi(id);
      await loadJourney();

      if (expandedGoalId === id) setExpandedGoalId(null);
      if (selectedGoalId === id) setSelectedGoalId(null);
      if (editingGoalId === id) cancelGoalForm();
    } catch (error) {
      console.error("Failed to delete goal:", error);
      Alert.alert("Error", "Failed to delete SMART goal.");
    }
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

  const markSelectedGoalCompleted = async () => {
    if (!selectedGoalId) return;

    try {
      await toggleGoalApi(selectedGoalId);
      await loadJourney();
      setSelectedGoalId(null);
    } catch (error) {
      console.error("Failed to toggle goal completion:", error);
      Alert.alert("Error", "Failed to update SMART goal.");
    }
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
          onPress: async () => {
            await removeGoal(selectedGoalId);
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
          selectedHabitId={selectedHabitId}
          addHabit={addHabit}
          saveEditedHabit={saveEditedHabit}
          cancelHabitForm={cancelHabitForm}
          startEditHabit={startEditHabit}
          removeHabit={removeHabit}
          toggleHabitCompletion={toggleHabitCompletion}
          selectHabit={selectHabit}
          clearSelectedHabit={clearSelectedHabit}
          markSelectedHabitCompleted={markSelectedHabitCompleted}
          deleteSelectedHabit={deleteSelectedHabit}
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
