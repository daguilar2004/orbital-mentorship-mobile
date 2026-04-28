import { useMemo } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { styles } from "../../styles/accountabilityStyles";
import { DailyHabit, DayKey, SmartGoal } from "../../types/accountability";
import DayDots from "./DayDots";
import DaysSelector from "./DaysSelector";
import SmartGoalField from "./SmartGoalField";

type Props = {
  habits: DailyHabit[];
  goals: SmartGoal[];
  expandedGoalId: string | null;
  selectedGoalId: string | null;
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
  startEditGoal: (goal: SmartGoal) => void;
  saveEditedGoal: () => void;
  cancelGoalForm: () => void;
  toggleGoal: (id: string) => void;
  selectGoal: (id: string) => void;
  showGoalsHelp: boolean;
  setShowGoalsHelp: (value: boolean) => void;
  toggleDay: (
    day: DayKey,
    selected: DayKey[],
    setSelected: (days: DayKey[]) => void,
  ) => void;
};

export default function GoalsTabContent({
  habits,
  goals,
  expandedGoalId,
  selectedGoalId,
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
  toggleGoal,
  selectGoal,
  setShowGoalsHelp,
  toggleDay,
}: Props) {
  const linkedHabitMap = useMemo(() => {
    const map: Record<string, DailyHabit | undefined> = {};
    goals.forEach((goal) => {
      map[goal.id] = habits.find((habit) => habit.id === goal.linkedHabitId);
    });
    return map;
  }, [goals, habits]);

  return (
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
              {editingGoalId ? "Edit SMART Goal" : "Create New SMART Goal"}
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
              <Pressable style={styles.secondaryBtn} onPress={cancelGoalForm}>
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

                    <Text style={styles.smartGoalTime}>{goal.time}</Text>

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
                      <SmartGoalField label="A" text={goal.achievable} />
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
  );
}
