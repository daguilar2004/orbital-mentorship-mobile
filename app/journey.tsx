import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountabilityScreen from "../components/accountability/AccountabilityScreen";
import WelcomeScreen from "../components/accountability/WelcomeScreen";
import { styles } from "../styles/accountabilityStyles";
import {
  DailyHabit,
  DayKey,
  SmartGoal,
  TabKey,
} from "../types/accountability";
import { getTodayDayKey, getTodayKey } from "../utils/accountabilityDate";

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
          : habit
      )
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
                  : goal
              )
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
      })
    );
  };

  const toggleDay = (
    day: DayKey,
    selected: DayKey[],
    setSelected: (days: DayKey[]) => void
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
      (habit) => habit.id === existingGoal?.linkedHabitId
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
              : habit
          )
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
        prev.filter((habit) => habit.id !== existingLinkedHabit.id)
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
          : goal
      )
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
          : goal
      )
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
      ]
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