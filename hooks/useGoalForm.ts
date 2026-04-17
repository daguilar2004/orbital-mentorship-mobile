import { useState } from "react";

import { DailyHabit, DayKey, SmartGoal } from "../types/accountability";

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

type UseGoalFormParams = {
  habits: DailyHabit[];
  addGoal: (input: AddGoalInput) => Promise<boolean>;
  saveEditedGoal: (input: EditGoalInput) => Promise<boolean>;
  setExpandedGoalId: (id: string | null) => void;
};

export function useGoalForm({
  habits,
  addGoal,
  saveEditedGoal,
  setExpandedGoalId,
}: UseGoalFormParams) {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  const [goalTitle, setGoalTitle] = useState("");
  const [goalTime, setGoalTime] = useState("");
  const [goalSpecific, setGoalSpecific] = useState("");
  const [goalMeasurable, setGoalMeasurable] = useState("");
  const [goalAchievable, setGoalAchievable] = useState("");
  const [goalRelevant, setGoalRelevant] = useState("");
  const [goalTimeBound, setGoalTimeBound] = useState("");

  const [goalHabitTitle, setGoalHabitTitle] = useState("");
  const [goalHabitDays, setGoalHabitDays] = useState<DayKey[]>([]);

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
    if (isSubmittingGoal) return;
    setShowGoalForm(false);
    clearGoalForm();
  };

  const handleAddGoal = async () => {
    if (isSubmittingGoal) return false;

    setIsSubmittingGoal(true);

    try {
      const success = await addGoal({
        title: goalTitle,
        time: goalTime,
        specific: goalSpecific,
        measurable: goalMeasurable,
        achievable: goalAchievable,
        relevant: goalRelevant,
        timeBound: goalTimeBound,
        goalHabitTitle,
        goalHabitDays,
      });

      if (success) {
        setShowGoalForm(false);
        clearGoalForm();
      }

      return success;
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const startEditGoal = (goal: SmartGoal) => {
    if (isSubmittingGoal) return;

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
    setShowGoalForm(true);
  };

  const handleSaveEditedGoal = async () => {
    if (!editingGoalId || isSubmittingGoal) return false;

    setIsSubmittingGoal(true);

    try {
      const success = await saveEditedGoal({
        id: editingGoalId,
        title: goalTitle,
        time: goalTime,
        specific: goalSpecific,
        measurable: goalMeasurable,
        achievable: goalAchievable,
        relevant: goalRelevant,
        timeBound: goalTimeBound,
        goalHabitTitle,
        goalHabitDays,
      });

      if (success) {
        setShowGoalForm(false);
        clearGoalForm();
      }

      return success;
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  return {
    showGoalForm,
    setShowGoalForm,
    editingGoalId,
    isSubmittingGoal,
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
    clearGoalForm,
    cancelGoalForm,
    handleAddGoal,
    startEditGoal,
    handleSaveEditedGoal,
  };
}
