import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useApp } from "./context/AppContext";

export default function OffboardingScreen() {
  const { userRole, phases, totalXP } = useApp();
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const completedPhases = phases.filter((p) => p.status === "completed").length;
  const totalPhases = phases.length;
  const allTasksCompleted = phases.every((p) =>
    p.tasks.every((t) => t.status === "approved"),
  );
  const currentPhase = phases.find((p) => p.status === "current");
  const hasTimeRemaining = currentPhase !== undefined;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleComplete = () => {
    if (selectedOption === "extend") {
      Alert.alert(
        "Success! 📅",
        "Time extension request submitted! Your mentorship will be extended.",
        [
          {
            text: "OK",
            onPress: () => {
              setStep(1);
              setSelectedOption("");
              router.replace("/");
            },
          },
        ],
      );
    } else if (selectedOption === "addPhases") {
      Alert.alert("Success! 🎯", "New phases will be added to your journey!", [
        {
          text: "OK",
          onPress: () => {
            setStep(1);
            setSelectedOption("");
            router.replace("/");
          },
        },
      ]);
    } else if (selectedOption === "complete") {
      Alert.alert(
        "Completed! 🎉",
        "Thank you for participating in the mentorship program!",
        [
          {
            text: "OK",
            onPress: () => {
              setStep(1);
              setSelectedOption("");
              router.replace("/");
            },
          },
        ],
      );
    }
  };

  const renderMenteeStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.icon,
            { backgroundColor: allTasksCompleted ? "#F3E8FF" : "#FEF3C7" },
          ]}
        >
          <Ionicons
            name={allTasksCompleted ? "trophy" : "alert-circle"}
            size={40}
            color={allTasksCompleted ? "#7C3AED" : "#EA580C"}
          />
        </View>
      </View>

      <Text style={styles.stepTitle}>
        {allTasksCompleted ? "Journey Complete! 🎉" : "Check Your Progress"}
      </Text>
      <Text style={styles.stepSubtitle}>
        {allTasksCompleted
          ? "Congratulations! You've completed all tasks."
          : "Review your mentorship status before offboarding"}
      </Text>

      {/* Progress Summary */}
      <View style={styles.progressBox}>
        <View style={styles.rowBetween}>
          <Text style={styles.progressLabel}>Phases Completed</Text>
          <Text style={styles.progressValue}>
            {completedPhases}/{totalPhases}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedPhases / totalPhases) * 100}%` },
            ]}
          />
        </View>

        <View style={[styles.rowBetween, { marginTop: 12 }]}>
          <Text style={styles.progressLabel}>Total XP Earned</Text>
          <Text style={styles.progressValue}>{totalXP} XP</Text>
        </View>
      </View>

      {/* Status Messages */}
      {allTasksCompleted && hasTimeRemaining ? (
        <View
          style={[
            styles.statusBox,
            { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" },
          ]}
        >
          <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.statusTitle}>All Tasks Completed Early!</Text>
            <Text style={styles.statusText}>
              You&apos;ve finished before your timeline. Would you like to add
              more phases or complete your mentorship?
            </Text>
          </View>
        </View>
      ) : !allTasksCompleted && !hasTimeRemaining ? (
        <View
          style={[
            styles.statusBox,
            { backgroundColor: "#FED7AA", borderColor: "#FDBA74" },
          ]}
        >
          <Ionicons name="alert-circle" size={24} color="#EA580C" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.statusTitle}>Time&apos;s Up!</Text>
            <Text style={styles.statusText}>
              Your mentorship period has ended. Would you like to extend your
              time to complete remaining tasks?
            </Text>
          </View>
        </View>
      ) : allTasksCompleted ? (
        <View
          style={[
            styles.statusBox,
            { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" },
          ]}
        >
          <Ionicons name="trophy" size={24} color="#16A34A" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.statusTitle}>Mentorship Completed!</Text>
            <Text style={styles.statusText}>
              You&apos;ve successfully completed all tasks and phases.
              Congratulations!
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.statusBox,
            { backgroundColor: "#DBEAFE", borderColor: "#93C5FD" },
          ]}
        >
          <Ionicons name="trending-up" size={24} color="#2563EB" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.statusTitle}>In Progress</Text>
            <Text style={styles.statusText}>
              You still have time and tasks remaining in your mentorship
              journey.
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderMenteeStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View style={[styles.icon, { backgroundColor: "#F3E8FF" }]}>
          <Ionicons name="calendar" size={40} color="#7C3AED" />
        </View>
      </View>

      <Text style={styles.stepTitle}>Choose Next Steps</Text>
      <Text style={styles.stepSubtitle}>What would you like to do?</Text>

      <View style={styles.optionsContainer}>
        {allTasksCompleted && hasTimeRemaining && (
          <Pressable
            onPress={() => handleOptionSelect("addPhases")}
            style={[
              styles.optionButton,
              selectedOption === "addPhases" && styles.optionButtonSelected,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.optionText,
                  selectedOption === "addPhases" && styles.optionTextSelected,
                ]}
              >
                Add More Phases
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  selectedOption === "addPhases" &&
                    styles.optionDescriptionSelected,
                ]}
              >
                Continue learning with new challenges and goals
              </Text>
            </View>
            {selectedOption === "addPhases" && (
              <Ionicons name="checkmark-circle" size={24} color="#7C3AED" />
            )}
          </Pressable>
        )}

        {!allTasksCompleted && (
          <Pressable
            onPress={() => handleOptionSelect("extend")}
            style={[
              styles.optionButton,
              selectedOption === "extend" && styles.optionButtonSelected,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.optionText,
                  selectedOption === "extend" && styles.optionTextSelected,
                ]}
              >
                Extend Timeline
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  selectedOption === "extend" &&
                    styles.optionDescriptionSelected,
                ]}
              >
                Get more time to complete your remaining tasks
              </Text>
            </View>
            {selectedOption === "extend" && (
              <Ionicons name="checkmark-circle" size={24} color="#7C3AED" />
            )}
          </Pressable>
        )}

        <Pressable
          onPress={() => handleOptionSelect("complete")}
          style={[
            styles.optionButton,
            selectedOption === "complete" && [
              styles.optionButtonSelected,
              { borderColor: "#10B981" },
            ],
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.optionText,
                selectedOption === "complete" && { color: "#10B981" },
              ]}
            >
              Complete Mentorship
            </Text>
            <Text
              style={[
                styles.optionDescription,
                selectedOption === "complete" && { color: "#10B981" },
              ]}
            >
              End your mentorship journey and graduate
            </Text>
          </View>
          {selectedOption === "complete" && (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          )}
        </Pressable>
      </View>
    </View>
  );

  const renderMentorStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View style={[styles.icon, { backgroundColor: "#DBEAFE" }]}>
          <Ionicons name="trophy" size={40} color="#2563EB" />
        </View>
      </View>

      <Text style={styles.stepTitle}>Mentorship Review</Text>
      <Text style={styles.stepSubtitle}>
        Review your mentorship program status
      </Text>

      {/* Mentor Stats */}
      <View
        style={[
          styles.progressBox,
          { backgroundColor: "#F0F9FF", borderColor: "#93C5FD" },
        ]}
      >
        <View style={styles.rowBetween}>
          <Text style={styles.progressLabel}>Program Progress</Text>
          <Text style={[styles.progressValue, { color: "#2563EB" }]}>
            {completedPhases}/{totalPhases} Phases
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(completedPhases / totalPhases) * 100}%`,
                backgroundColor: "#2563EB",
              },
            ]}
          />
        </View>

        <View style={[styles.rowBetween, { marginTop: 12 }]}>
          <Text style={styles.progressLabel}>Total XP Distributed</Text>
          <Text style={[styles.progressValue, { color: "#2563EB" }]}>
            {totalXP} XP
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.statusBox,
          { backgroundColor: "#DBEAFE", borderColor: "#93C5FD" },
        ]}
      >
        <Ionicons name="trending-up" size={24} color="#2563EB" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.statusTitle}>Great Work!</Text>
          <Text style={styles.statusText}>
            You&apos;ve been guiding mentees through their learning journey.
            Time to review and plan next steps.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderMentorStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View style={[styles.icon, { backgroundColor: "#DBEAFE" }]}>
          <Ionicons name="calendar" size={40} color="#2563EB" />
        </View>
      </View>

      <Text style={styles.stepTitle}>Program Options</Text>
      <Text style={styles.stepSubtitle}>How would you like to proceed?</Text>

      <View style={styles.optionsContainer}>
        {hasTimeRemaining && (
          <Pressable
            onPress={() => handleOptionSelect("addPhases")}
            style={[
              styles.optionButton,
              selectedOption === "addPhases" && [
                styles.optionButtonSelected,
                { borderColor: "#2563EB" },
              ],
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.optionText,
                  selectedOption === "addPhases" && { color: "#2563EB" },
                ]}
              >
                Add More Phases
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  selectedOption === "addPhases" && { color: "#2563EB" },
                ]}
              >
                Extend the program with additional learning phases
              </Text>
            </View>
            {selectedOption === "addPhases" && (
              <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
            )}
          </Pressable>
        )}

        <Pressable
          onPress={() => handleOptionSelect("extend")}
          style={[
            styles.optionButton,
            selectedOption === "extend" && [
              styles.optionButtonSelected,
              { borderColor: "#2563EB" },
            ],
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.optionText,
                selectedOption === "extend" && { color: "#2563EB" },
              ]}
            >
              Extend Timeline
            </Text>
            <Text
              style={[
                styles.optionDescription,
                selectedOption === "extend" && { color: "#2563EB" },
              ]}
            >
              Give mentees more time to complete their goals
            </Text>
          </View>
          {selectedOption === "extend" && (
            <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
          )}
        </Pressable>

        <Pressable
          onPress={() => handleOptionSelect("complete")}
          style={[
            styles.optionButton,
            selectedOption === "complete" && [
              styles.optionButtonSelected,
              { borderColor: "#10B981" },
            ],
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.optionText,
                selectedOption === "complete" && { color: "#10B981" },
              ]}
            >
              Complete Program
            </Text>
            <Text
              style={[
                styles.optionDescription,
                selectedOption === "complete" && { color: "#10B981" },
              ]}
            >
              Conclude the mentorship program
            </Text>
          </View>
          {selectedOption === "complete" && (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          )}
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {userRole === "mentor" ? "Mentor" : "Mentee"} Offboarding
          </Text>
          <Text style={styles.stepIndicator}>Step {step} of 2</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${(step / 2) * 100}%` }]}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {userRole === "mentee"
          ? step === 1
            ? renderMenteeStep1()
            : renderMenteeStep2()
          : step === 1
            ? renderMentorStep1()
            : renderMentorStep2()}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {step === 1 ? (
            <Pressable onPress={() => setStep(2)} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => setStep(1)}
                style={[styles.button, styles.secondaryButton]}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>

              <Pressable
                onPress={handleComplete}
                disabled={!selectedOption}
                style={[
                  styles.button,
                  styles.completeButton,
                  !selectedOption && styles.disabledButton,
                ]}
              >
                <Text style={styles.completeButtonText}>Submit</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  stepIndicator: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7C3AED",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  stepContainer: {
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  progressBox: {
    width: "100%",
    backgroundColor: "#F3E8FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
  },
  statusBox: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
  },
  statusTitle: {
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  optionsContainer: {
    width: "100%",
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  optionButtonSelected: {
    borderColor: "#7C3AED",
    backgroundColor: "#F3E8FF",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  optionTextSelected: {
    color: "#7C3AED",
  },
  optionDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  optionDescriptionSelected: {
    color: "#7C3AED",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  completeButton: {
    backgroundColor: "#10B981",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
