import { useState } from "react";

import { DailyHabit, DayKey } from "../types/accountability";

type AddHabitInput = {
  title: string;
  days: DayKey[];
};

type EditHabitInput = {
  id: string;
  title: string;
  days: DayKey[];
};

type UseHabitFormParams = {
  addHabit: (input: AddHabitInput) => Promise<boolean>;
  saveEditedHabit: (input: EditHabitInput) => Promise<boolean>;
};

export function useHabitForm({
  addHabit,
  saveEditedHabit,
}: UseHabitFormParams) {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDays, setHabitDays] = useState<DayKey[]>([]);

  const clearHabitForm = () => {
    setHabitTitle("");
    setHabitDays([]);
    setEditingHabitId(null);
  };

  const cancelHabitForm = () => {
    setShowHabitForm(false);
    clearHabitForm();
  };

  const handleAddHabit = async () => {
    const success = await addHabit({
      title: habitTitle,
      days: habitDays,
    });

    if (success) {
      setShowHabitForm(false);
      clearHabitForm();
    }

    return success;
  };

  const startEditHabit = (habit: DailyHabit) => {
    setEditingHabitId(habit.id);
    setHabitTitle(habit.title);
    setHabitDays(habit.days);
    setShowHabitForm(true);
  };

  const handleSaveEditedHabit = async () => {
    if (!editingHabitId) return false;

    const success = await saveEditedHabit({
      id: editingHabitId,
      title: habitTitle,
      days: habitDays,
    });

    if (success) {
      setShowHabitForm(false);
      clearHabitForm();
    }

    return success;
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

  return {
    showHabitForm,
    setShowHabitForm,
    editingHabitId,
    habitTitle,
    setHabitTitle,
    habitDays,
    setHabitDays,
    clearHabitForm,
    cancelHabitForm,
    handleAddHabit,
    startEditHabit,
    handleSaveEditedHabit,
    toggleDay,
  };
}
