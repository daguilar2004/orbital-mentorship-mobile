import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { router } from "expo-router";

export default function RoleSelection() {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [selected, setSelected] = React.useState<"mentor" | "mentee" | null>(
    null,
  );
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [zip, setZip] = React.useState("");

  return (
    <View style={styles.screen}>
      {step === 1 ? (
        <>
          <Text style={styles.title}>Which role are you taking?</Text>
          <View style={styles.optionContainer}>
            <Pressable
              style={[
                styles.option,
                selected === "mentor" && styles.optionSelected,
              ]}
              onPress={() => setSelected("mentor")}
            >
              <Text style={styles.optionTitle}>I'm here to GUIDE!</Text>
              <Text style={styles.optionLabel}>MENTOR</Text>
            </Pressable>

            <Pressable
              style={[
                styles.option,
                selected === "mentee" && styles.optionSelected,
              ]}
              onPress={() => setSelected("mentee")}
            >
              <Text style={styles.optionTitle}>I'm here to LEARN!</Text>
              <Text style={styles.optionLabel}>MENTEE</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Set Up Your Profile</Text>
          <Text style={styles.subtitle}>
            Please provide your first name, last name, and ZIP code. This
            information is essential for your profile and will be displayed to
            other users.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address, city, state"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>ZIP Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              value={zip}
              onChangeText={setZip}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[
            styles.button,
            (step === 1 && !selected) || (step === 2 && !firstName)
              ? styles.disabledButton
              : null,
          ]}
          onPress={handleContinue}
          disabled={(step === 1 && !selected) || (step === 2 && !firstName)}
        >
          <Text style={styles.buttonText}>
            {step === 1 ? "Continue" : "Complete"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => router.push("/onboarding2")}
        >
          <Text style={styles.secondaryText}>Back to Onboarding 2</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#6B7280", marginBottom: 24 },
  actions: { marginTop: 20 },
  button: {
    backgroundColor: "#7C3AED",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondary: { backgroundColor: "#F3F4F6" },
  secondaryText: { color: "#374151", fontWeight: "600" },
  disabledButton: { opacity: 0.5 },
  optionContainer: {
    marginTop: 24,
    gap: 16,
  },
  option: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  optionSelected: {
    borderColor: "#7C3AED",
    backgroundColor: "#F3E8FF",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "700",
  },
  subtitle: { color: "#6B7280", marginBottom: 24 },
  formGroup: { width: "100%", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8 },
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
  fileButton: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  fileButtonText: { color: "#374151", fontWeight: "600" },
});
