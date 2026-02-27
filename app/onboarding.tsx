import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useApp } from "./context/AppContext";

interface FormData {
  name: string;
  profilePic: string;
  goals: string;
  duration: string;
  menteeCount: string;
}

export default function OnboardingScreen() {
  const { userRole } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    profilePic: "",
    goals: "",
    duration: "3",
    menteeCount: "1",
  });
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const totalSteps = userRole === "mentor" ? 5 : 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    Alert.alert(
      "Success! 🎉",
      `Onboarding complete! Welcome, ${formData.name}!`,
      [
        {
          text: "OK",
          onPress: () => {
            setStep(1);
            setFormData({
              name: "",
              profilePic: "",
              goals: "",
              duration: "3",
              menteeCount: "1",
            });
            router.replace("/");
          },
        },
      ],
    );
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const canProceed = () => {
    if (step === 2 && !formData.name) return false;
    if (step === 3 && !formData.goals) return false;
    return true;
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {userRole === "mentor" ? "Mentor" : "Mentee"} Onboarding
          </Text>
          <Text style={styles.stepIndicator}>
            Step {step} of {totalSteps}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(step / totalSteps) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Welcome & Role Confirmation */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: "#F3E8FF" }]}>
                <Ionicons name="person" size={40} color="#7C3AED" />
              </View>
            </View>

            <Text style={styles.stepTitle}>Welcome! 👋</Text>
            <Text style={styles.stepSubtitle}>
              Let&apos;s get you started as a{" "}
              <Text style={{ fontWeight: "600", color: "#7C3AED" }}>
                {userRole === "mentor" ? "Mentor" : "Mentee"}
              </Text>
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What to expect:</Text>
              <View style={styles.infoList}>
                {userRole === "mentor" ? (
                  <>
                    <Text style={styles.listItem}>
                      • Set up your mentor profile
                    </Text>
                    <Text style={styles.listItem}>
                      • Define your mentorship goals
                    </Text>
                    <Text style={styles.listItem}>
                      • Choose mentorship duration
                    </Text>
                    <Text style={styles.listItem}>
                      • Select number of mentees
                    </Text>
                    <Text style={styles.listItem}>• Start guiding others</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.listItem}>
                      • Set up your mentee profile
                    </Text>
                    <Text style={styles.listItem}>
                      • Define your learning goals
                    </Text>
                    <Text style={styles.listItem}>
                      • Choose mentorship duration
                    </Text>
                    <Text style={styles.listItem}>• Begin your journey</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Profile Setup */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: "#DBEAFE" }]}>
                <Ionicons name="person-circle" size={40} color="#2563EB" />
              </View>
            </View>

            <Text style={styles.stepTitle}>Profile Setup</Text>
            <Text style={styles.stepSubtitle}>
              Tell us a bit about yourself
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Profile Picture URL (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={formData.profilePic}
                onChangeText={(value) => {
                  updateFormData("profilePic", value);
                  setImageError(false);
                }}
                placeholderTextColor="#999"
              />
            </View>

            {formData.profilePic && !imageError && (
              <View style={styles.imagePreviewContainer}>
                {imageLoading && (
                  <ActivityIndicator size="large" color="#7C3AED" />
                )}
                <Image
                  source={{ uri: formData.profilePic }}
                  style={styles.imagePreview}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                  }}
                />
              </View>
            )}
          </View>
        )}

        {/* Step 3: Goals Setup */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: "#DCFCE7" }]}>
                <Ionicons name="flag" size={40} color="#16A34A" />
              </View>
            </View>

            <Text style={styles.stepTitle}>Set Your Goals</Text>
            <Text style={styles.stepSubtitle}>
              {userRole === "mentor"
                ? "What do you want to help your mentees achieve?"
                : "What do you want to achieve in this mentorship?"}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {userRole === "mentor" ? "Mentorship Goals" : "Learning Goals"}{" "}
                *
              </Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder={
                  userRole === "mentor"
                    ? "e.g., Help mentees develop leadership skills, guide career transitions..."
                    : "e.g., Learn web development, improve design skills..."
                }
                value={formData.goals}
                onChangeText={(value) => updateFormData("goals", value)}
                multiline
                numberOfLines={6}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {formData.goals.length} characters
              </Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                💡 <Text style={{ fontWeight: "600" }}>Tip:</Text> Clear goals
                help create a focused and successful mentorship experience.
              </Text>
            </View>
          </View>
        )}

        {/* Step 4: Duration Selection */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: "#FED7AA" }]}>
                <Ionicons name="time" size={40} color="#EA580C" />
              </View>
            </View>

            <Text style={styles.stepTitle}>Mentorship Duration</Text>
            <Text style={styles.stepSubtitle}>
              How long would you like this mentorship to last?
            </Text>

            <View style={styles.optionsContainer}>
              {["2", "3", "4", "6", "12"].map((months) => (
                <Pressable
                  key={months}
                  onPress={() => updateFormData("duration", months)}
                  style={[
                    styles.optionButton,
                    formData.duration === months && styles.optionButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.duration === months && styles.optionTextSelected,
                    ]}
                  >
                    {months} {months === "1" ? "Month" : "Months"}
                  </Text>
                  {formData.duration === months && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#7C3AED"
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Mentee Count (Mentor Only) */}
        {step === 5 && userRole === "mentor" && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons name="people" size={40} color="#4C1D95" />
              </View>
            </View>

            <Text style={styles.stepTitle}>Number of Mentees</Text>
            <Text style={styles.stepSubtitle}>
              How many mentees would you like to guide?
            </Text>

            <View style={styles.optionsContainer}>
              {["1", "2", "3"].map((count) => (
                <Pressable
                  key={count}
                  onPress={() => updateFormData("menteeCount", count)}
                  style={[
                    styles.optionButton,
                    formData.menteeCount === count &&
                      styles.optionButtonSelected,
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        styles.optionText,
                        formData.menteeCount === count &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {count} {count === "1" ? "Mentee" : "Mentees"}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        formData.menteeCount === count &&
                          styles.optionDescriptionSelected,
                      ]}
                    >
                      {count === "1"
                        ? "One-on-one focused mentorship"
                        : count === "2"
                          ? "Balance between attention and impact"
                          : "Maximum impact, requires time management"}
                    </Text>
                  </View>
                  {formData.menteeCount === count && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#7C3AED"
                    />
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                ℹ️ You can adjust this later based on your availability and
                capacity.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <Pressable
              onPress={handleBack}
              style={[styles.button, styles.secondaryButton]}
            >
              <Ionicons name="chevron-back" size={20} color="#374151" />
              <Text style={styles.secondaryButtonText}>Back</Text>
            </Pressable>
          )}

          {step < totalSteps ? (
            <Pressable
              onPress={handleNext}
              disabled={!canProceed()}
              style={[
                styles.button,
                styles.primaryButton,
                !canProceed() && styles.disabledButton,
              ]}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleComplete}
              style={[styles.button, styles.completeButton]}
            >
              <Text style={styles.completeButtonText}>Complete Setup 🎉</Text>
            </Pressable>
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
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  infoList: {
    gap: 8,
  },
  listItem: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
  },
  infoBoxText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  formGroup: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  tipBox: {
    width: "100%",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  imagePreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#E9D5FF",
  },
  optionsContainer: {
    width: "100%",
    gap: 12,
    marginTop: 16,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
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
