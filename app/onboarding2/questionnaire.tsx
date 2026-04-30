import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Energy",
  "Real Estate",
  "Transportation",
  "Other",
];

interface QuestionnaireAnswers {
  mentoringComfort: number;
  industry: string;
  mentorIndustry: string;
  mentorSkillset: string;
  developmentGoal: string;
  holdingBack: string;
}

export default function Questionnaire() {
  const [currentQ, setCurrentQ] = React.useState(1);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers>({
    mentoringComfort: 5,
    industry: "",
    mentorIndustry: "",
    mentorSkillset: "",
    developmentGoal: "",
    holdingBack: "",
  });

  const totalQuestions = 6;
  const minWords = 20;

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  const isCurrentAnswerValid = () => {
    switch (currentQ) {
      case 1:
        return answers.mentoringComfort !== null;
      case 2:
        return answers.industry !== "";
      case 3:
        return countWords(answers.mentorIndustry) >= minWords;
      case 4:
        return countWords(answers.mentorSkillset) >= minWords;
      case 5:
        return countWords(answers.developmentGoal) >= minWords;
      case 6:
        return countWords(answers.holdingBack) >= minWords;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentQ < totalQuestions) {
      setCurrentQ(currentQ + 1);
      setShowDropdown(false);
    } else {
      // ✅ go back to hub after finishing
      router.replace("/onboarding2/profile-setup");
    }
  };

  const handlePrev = () => {
    if (currentQ > 1) {
      setCurrentQ(currentQ - 1);
      setShowDropdown(false);
    }
    else {
      router.push("/onboarding2/role-selection");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Questionnaire</Text>
        <Text style={styles.stepIndicator}>
          Question {currentQ} of {totalQuestions}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Q1: Mentoring Comfort */}
        {currentQ === 1 && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              How close of a mentoring relationship are you comfortable with?
            </Text>

            <View style={styles.scaleContainer}>
              {/* simple numeric picker instead of slider */}
              <View style={styles.numericControl}>
                <Pressable
                  onPress={() =>
                    setAnswers((a) => ({
                      ...a,
                      mentoringComfort: Math.max(1, a.mentoringComfort - 1),
                    }))
                  }
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </Pressable>
                <Text style={styles.scaleValue}>
                  {" "}
                  {answers.mentoringComfort}{" "}
                </Text>
                <Pressable
                  onPress={() =>
                    setAnswers((a) => ({
                      ...a,
                      mentoringComfort: Math.min(10, a.mentoringComfort + 1),
                    }))
                  }
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </Pressable>
              </View>
              <View style={styles.scaleLabels}>
                <Text style={styles.scaleLabel}>Formal</Text>
                <Text style={styles.scaleLabel}>Personal</Text>
              </View>
            </View>
          </View>
        )}

        {/* Q2: Industry Dropdown */}
        {currentQ === 2 && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              What industry or domain are you studying?
            </Text>

            <Pressable
              style={styles.dropdown}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.dropdownText}>
                {answers.industry || "Select industry"}
              </Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={24}
                color="#0b0c67"
              />
            </Pressable>

            {showDropdown && (
              <View style={styles.dropdownMenu}>
                {INDUSTRIES.map((ind) => (
                  <Pressable
                    key={ind}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setAnswers({ ...answers, industry: ind });
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        answers.industry === ind && styles.dropdownItemSelected,
                      ]}
                    >
                      {ind}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Q3: Mentor Industry */}
        {currentQ === 3 && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              What industry should your mentor be in?
            </Text>
            <TextInput
              style={styles.textarea}
              placeholder="Type your answer (minimum 20 words)..."
              multiline
              numberOfLines={5}
              value={answers.mentorIndustry}
              onChangeText={(text) =>
                setAnswers({ ...answers, mentorIndustry: text })
              }
              placeholderTextColor="#999"
            />
            <Text style={styles.wordCount}>
              {countWords(answers.mentorIndustry)}/20 words
            </Text>
          </View>
        )}

        {/* Q4: Mentor Skillset */}
        {currentQ === 4 && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              What kind of skillset should your mentor have?
            </Text>
            <TextInput
              style={styles.textarea}
              placeholder="Type your answer (minimum 20 words)..."
              multiline
              numberOfLines={5}
              value={answers.mentorSkillset}
              onChangeText={(text) =>
                setAnswers({ ...answers, mentorSkillset: text })
              }
              placeholderTextColor="#999"
            />
            <Text style={styles.wordCount}>
              {countWords(answers.mentorSkillset)}/20 words
            </Text>
          </View>
        )}

        {/* Q5: Development Goal */}
        {currentQ === 5 && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              What is your most urgent professional development goal right now?
            </Text>
            <TextInput
              style={styles.textarea}
              placeholder="Type your answer (minimum 20 words)..."
              multiline
              numberOfLines={5}
              value={answers.developmentGoal}
              onChangeText={(text) =>
                setAnswers({ ...answers, developmentGoal: text })
              }
              placeholderTextColor="#999"
            />
            <Text style={styles.wordCount}>
              {countWords(answers.developmentGoal)}/20 words
            </Text>
          </View>
        )}

        {/* Q6: Holding Back */}
        {currentQ === 6 && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              What is holding you back from overcoming that goal?
            </Text>
            <TextInput
              style={styles.textarea}
              placeholder="Type your answer (minimum 20 words)..."
              multiline
              numberOfLines={5}
              value={answers.holdingBack}
              onChangeText={(text) =>
                setAnswers({ ...answers, holdingBack: text })
              }
              placeholderTextColor="#999"
            />
            <Text style={styles.wordCount}>
              {countWords(answers.holdingBack)}/20 words
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.navButton]}
          onPress={handlePrev}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={ "#0b0c67"}
          />
          <Text
            style={[styles.navText]}
          >
            Previous
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.navButton,
            !isCurrentAnswerValid() && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!isCurrentAnswerValid()}
        >
          <Text
            style={[
              styles.navText,
              !isCurrentAnswerValid() && styles.navTextDisabled,
            ]}
          >
            {currentQ === totalQuestions ? "Finish" : "Next"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={!isCurrentAnswerValid() ? "#CCC" : "#0b0c67"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  stepIndicator: { fontSize: 13, color: "#999", marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 16, paddingVertical: 20 },
  questionContainer: { marginBottom: 24 },
  questionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
  },
  scaleContainer: { paddingVertical: 20 },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  scaleLabel: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  scaleValue: { fontSize: 24, fontWeight: "700", color: "#0b0c67" },
  numericControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: { fontSize: 18, fontWeight: "700", color: "#111827" },
  dropdown: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dropdownText: { fontSize: 15, color: "#111827" },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropdownItemText: { fontSize: 14, color: "#6B7280" },
  dropdownItemSelected: { color: "#0b0c67", fontWeight: "600" },
  textarea: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
  },
  wordCount: { fontSize: 12, color: "#999", marginTop: 6 },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0b0c67",
    gap: 6,
  },
  navButtonDisabled: { borderColor: "#CCC", opacity: 0.5 },
  navText: { fontSize: 14, fontWeight: "600", color: "#0b0c67" },
  navTextDisabled: { color: "#CCC" },
});
