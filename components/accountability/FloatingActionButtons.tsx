import { Pressable, Text } from "react-native";

import { styles } from "../../styles/accountabilityStyles";
import { DailyHabit, SmartGoal, TabKey } from "../../types/accountability";

type Props = {
  activeTab: TabKey;
  todayKey: string;
  showHabitForm: boolean;
  setShowHabitForm: (value: boolean) => void;
  selectedHabitId: string | null;
  selectedHabit?: DailyHabit;
  deleteSelectedHabit: () => void;
  markSelectedHabitCompleted: () => void;
  showGoalForm: boolean;
  setShowGoalForm: (value: boolean) => void;
  selectedGoalId: string | null;
  selectedGoal?: SmartGoal;
  deleteSelectedGoal: () => void;
  markSelectedGoalCompleted: () => void;
};

export default function FloatingActionButtons({
  activeTab,
  todayKey,
  showHabitForm,
  setShowHabitForm,
  selectedHabitId,
  selectedHabit,
  deleteSelectedHabit,
  markSelectedHabitCompleted,
  showGoalForm,
  setShowGoalForm,
  selectedGoalId,
  selectedGoal,
  deleteSelectedGoal,
  markSelectedGoalCompleted,
}: Props) {
  if (activeTab === "goals" && selectedGoalId) {
    return (
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
    );
  }

  if (activeTab === "goals") {
    return (
      <Pressable
        style={styles.floatingAddBtn}
        onPress={() => setShowGoalForm(!showGoalForm)}
      >
        <Text style={styles.floatingAddBtnText}>
          {showGoalForm ? "×" : "+"}
        </Text>
      </Pressable>
    );
  }

  if (activeTab === "habits" && selectedHabitId) {
    return (
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
    );
  }

  if (activeTab === "habits") {
    return (
      <Pressable
        style={styles.floatingAddBtn}
        onPress={() => setShowHabitForm(!showHabitForm)}
      >
        <Text style={styles.floatingAddBtnText}>
          {showHabitForm ? "×" : "+"}
        </Text>
      </Pressable>
    );
  }

  return null;
}
