import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

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
} from "../app/Services/journey";
import { DailyHabit, DayKey, SmartGoal } from "../types/accountability";

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

type AddHabitInput = {
  title: string;
  days: DayKey[];
};

type EditHabitInput = {
  id: string;
  title: string;
  days: DayKey[];
};

type AddGoalInput = {
  title: string;
  time: string;
  specific: string;
  measurable: string;
  achievable?: string;
  relevant?: string;
  timeBound: string;
  goalHabitTitle?: string;
  goalHabitDays?: DayKey[];
};

type EditGoalInput = {
  id: string;
} & AddGoalInput;

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

export function useJourneyData() {
  const [habits, setHabits] = useState<DailyHabit[]>([]);
  const [goals, setGoals] = useState<SmartGoal[]>([]);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const loadJourney = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadJourney();
  }, [loadJourney]);

  const addHabit = async ({ title, days }: AddHabitInput) => {
    if (!title.trim() || days.length === 0) return false;

    try {
      await createHabit({
        title: title.trim(),
        days,
        completedOn: null,
      });

      await loadJourney();
      return true;
    } catch (error) {
      console.error("Failed to create habit:", error);
      Alert.alert("Error", "Failed to create daily habit.");
      return false;
    }
  };

  const saveEditedHabit = async ({ id, title, days }: EditHabitInput) => {
    if (!id || !title.trim() || days.length === 0) return false;

    try {
      await updateHabit(id, {
        title: title.trim(),
        days,
      });

      await loadJourney();
      return true;
    } catch (error) {
      console.error("Failed to update habit:", error);
      Alert.alert("Error", "Failed to update daily habit.");
      return false;
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
      return true;
    } catch (error) {
      console.error("Failed to delete habit:", error);
      Alert.alert("Error", "Failed to delete daily habit.");
      return false;
    }
  };

  const toggleHabitCompletion = async (id: string) => {
    try {
      await toggleHabit(id);
      await loadJourney();
      return true;
    } catch (error) {
      console.error("Failed to toggle habit completion:", error);
      Alert.alert("Error", "Failed to update habit completion.");
      return false;
    }
  };

  const selectHabit = (id: string) => {
    setSelectedHabitId(id);
  };

  const clearSelectedHabit = () => {
    setSelectedHabitId(null);
  };

  const markSelectedHabitCompleted = async () => {
    if (!selectedHabitId) return false;

    try {
      await toggleHabit(selectedHabitId);
      await loadJourney();
      setSelectedHabitId(null);
      return true;
    } catch (error) {
      console.error("Failed to toggle habit completion:", error);
      Alert.alert("Error", "Failed to update daily habit.");
      return false;
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

  const addGoal = async ({
    title,
    time,
    specific,
    measurable,
    achievable,
    relevant,
    timeBound,
    goalHabitTitle,
    goalHabitDays,
  }: AddGoalInput) => {
    if (
      !title.trim() ||
      !time.trim() ||
      !specific.trim() ||
      !measurable.trim() ||
      !timeBound.trim()
    ) {
      return false;
    }

    try {
      const createdGoal = await createGoal({
        title: title.trim(),
        time: time.trim(),
        specific: specific.trim(),
        measurable: measurable.trim(),
        achievable: achievable?.trim(),
        relevant: relevant?.trim(),
        timeBound: timeBound.trim(),
        completed: false,
      });

      const createdGoalId = createdGoal?._id ?? createdGoal?.id;

      if (!createdGoalId) {
        throw new Error("Created goal ID was not returned by the backend.");
      }

      if (goalHabitTitle?.trim() && goalHabitDays && goalHabitDays.length > 0) {
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
      return true;
    } catch (error) {
      console.error("Failed to create goal:", error);
      Alert.alert("Error", "Failed to create SMART goal.");
      return false;
    }
  };

  const saveEditedGoal = async ({
    id,
    title,
    time,
    specific,
    measurable,
    achievable,
    relevant,
    timeBound,
    goalHabitTitle,
    goalHabitDays,
  }: EditGoalInput) => {
    if (
      !id ||
      !title.trim() ||
      !time.trim() ||
      !specific.trim() ||
      !measurable.trim() ||
      !timeBound.trim()
    ) {
      return false;
    }

    try {
      const existingGoal = goals.find((goal) => goal.id === id);
      const existingLinkedHabit = habits.find(
        (habit) => habit.id === existingGoal?.linkedHabitId,
      );

      await updateGoal(id, {
        title: title.trim(),
        time: time.trim(),
        specific: specific.trim(),
        measurable: measurable.trim(),
        achievable: achievable?.trim(),
        relevant: relevant?.trim(),
        timeBound: timeBound.trim(),
      });

      if (goalHabitTitle?.trim() && goalHabitDays && goalHabitDays.length > 0) {
        if (existingLinkedHabit) {
          await updateHabit(existingLinkedHabit.id, {
            title: goalHabitTitle.trim(),
            days: goalHabitDays,
            linkedGoalId: id,
          });

          await updateGoal(id, {
            linkedHabitId: existingLinkedHabit.id,
          });
        } else {
          const createdHabit = await createHabit({
            title: goalHabitTitle.trim(),
            days: goalHabitDays,
            completedOn: null,
            linkedGoalId: id,
          });

          const createdHabitId = createdHabit?._id ?? createdHabit?.id;

          if (createdHabitId) {
            await updateGoal(id, { linkedHabitId: createdHabitId });
          }
        }
      } else {
        if (existingLinkedHabit) {
          await deleteHabit(existingLinkedHabit.id);
        }

        await updateGoal(id, { linkedHabitId: null });
      }

      await loadJourney();
      setExpandedGoalId(id);
      setSelectedGoalId(null);
      return true;
    } catch (error) {
      console.error("Failed to update goal:", error);
      Alert.alert("Error", "Failed to update SMART goal.");
      return false;
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

      return true;
    } catch (error) {
      console.error("Failed to delete goal:", error);
      Alert.alert("Error", "Failed to delete SMART goal.");
      return false;
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
    if (!selectedGoalId) return false;

    try {
      await toggleGoalApi(selectedGoalId);
      await loadJourney();
      setSelectedGoalId(null);
      return true;
    } catch (error) {
      console.error("Failed to toggle goal completion:", error);
      Alert.alert("Error", "Failed to update SMART goal.");
      return false;
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
            const idToDelete = selectedGoalId;
            setSelectedGoalId(null);
            await removeGoal(idToDelete);
          },
        },
      ],
    );
  };

  return {
    habits,
    goals,
    expandedGoalId,
    selectedHabitId,
    selectedGoalId,
    setExpandedGoalId,
    loadJourney,
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
    removeGoal,
    toggleGoal,
    selectGoal,
    clearSelectedGoal,
    markSelectedGoalCompleted,
    deleteSelectedGoal,
  };
}
