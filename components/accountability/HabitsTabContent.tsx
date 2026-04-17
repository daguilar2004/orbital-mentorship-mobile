import { Pressable, Text, TextInput, View } from "react-native";

import { styles } from "../../styles/accountabilityStyles";
import { DailyHabit, DayKey } from "../../types/accountability";
import DayDots from "./DayDots";
import DaysSelector from "./DaysSelector";

type Props = {
  habits: DailyHabit[];
  todayDayKey: DayKey;
  todayKey: string;
  showHabitForm: boolean;
  setShowHabitForm: (value: boolean) => void;
  habitTitle: string;
  setHabitTitle: (value: string) => void;
  habitDays: DayKey[];
  setHabitDays: (value: DayKey[]) => void;
  editingHabitId: string | null;
  selectedHabitId: string | null;
  addHabit: () => void;
  saveEditedHabit: () => void;
  cancelHabitForm: () => void;
  startEditHabit: (habit: DailyHabit) => void;
  toggleHabitCompletion: (id: string) => void;
  selectHabit: (id: string) => void;
  clearSelectedHabit: () => void;
  toggleDay: (
    day: DayKey,
    selected: DayKey[],
    setSelected: (days: DayKey[]) => void,
  ) => void;
};

export default function HabitsTabContent({
  habits,
  todayDayKey,
  todayKey,
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
  toggleHabitCompletion,
  selectHabit,
  clearSelectedHabit,
  toggleDay,
}: Props) {
  const todaysHabits = habits.filter((habit) =>
    habit.days.includes(todayDayKey),
  );
  const otherHabits = habits.filter(
    (habit) => !habit.days.includes(todayDayKey),
  );

  return (
    <View style={{ gap: 14, paddingBottom: 110 }}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Habits</Text>
        <Text style={styles.cardSub}>
          These reset automatically each new day at 12:00 AM. Hold to select.
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
            <Text style={styles.addBtnText}>{showHabitForm ? "×" : "＋"}</Text>
          </Pressable>
        </View>

        {showHabitForm && (
          <View style={styles.goalFormCard}>
            <Text style={styles.goalFormTitle}>
              {editingHabitId ? "Edit Daily Habit" : "Create Daily Habit"}
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
              onToggle={(day) => toggleDay(day, habitDays, setHabitDays)}
            />

            <View style={styles.goalFormActions}>
              <Pressable style={styles.secondaryBtn} onPress={cancelHabitForm}>
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
                          <Text style={styles.linkedBadgeText}>Goal habit</Text>
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
                          <Text style={styles.goalEditBtnText}>Edit</Text>
                        </Pressable>

                        <Pressable
                          style={[
                            styles.taskCheckBtn,
                            doneToday && styles.taskCheckBtnDone,
                          ]}
                          onPress={() => toggleHabitCompletion(habit.id)}
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
                    }
                  }}
                >
                  <View style={styles.dailyHabitLeft}>
                    <View style={styles.dailyHabitTitleRow}>
                      <Text style={styles.dailyHabitTitle}>{habit.title}</Text>

                      {habit.linkedGoalId ? (
                        <View style={styles.linkedBadge}>
                          <Text style={styles.linkedBadgeText}>Goal habit</Text>
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
                          <Text style={styles.goalEditBtnText}>Edit</Text>
                        </Pressable>

                        <Pressable
                          style={[
                            styles.taskCheckBtn,
                            !habit.days.includes(todayDayKey) &&
                              styles.taskCheckBtnDisabled,
                            doneToday && styles.taskCheckBtnDone,
                          ]}
                          disabled={!habit.days.includes(todayDayKey)}
                          onPress={() => toggleHabitCompletion(habit.id)}
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
  );
}
