import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useApp } from "../context/AppContext";

export default function ProfileSetup() {
  const { profileData, setProfileData, questionnaireAnswers } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const [tempIndustry, setTempIndustry] = useState("");
  const [tempSkill, setTempSkill] = useState("");
  const [tempLink, setTempLink] = useState("");

  const hasProfile =
    profileData.firstName || profileData.lastName || profileData.bio;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addIndustry = () => {
    if (tempIndustry.trim()) {
      setFormData((prev) => ({
        ...prev,
        industries: [...prev.industries, tempIndustry.trim()],
      }));
      setTempIndustry("");
    }
  };

  const removeIndustry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (tempSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, tempSkill.trim()],
      }));
      setTempSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addLink = () => {
    if (tempLink.trim()) {
      setFormData((prev) => ({
        ...prev,
        links: [...prev.links, tempLink.trim()],
      }));
      setTempLink("");
    }
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert("Error", "Please fill in first and last name");
      return;
    }
    setProfileData(formData);
    setIsEditing(false);
    Alert.alert("Success", "Profile saved successfully!");
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setFormData(profileData);
    setIsEditing(true);
  };

  // Display Mode (when profile is saved)
  if (!isEditing && hasProfile) {
    return (
      <ScrollView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={16} color="#7C3AED" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Profile Information */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>
                {profileData.firstName[0]}
                {profileData.lastName[0]}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.displayName}>
                {profileData.firstName} {profileData.lastName}
              </Text>
              <Text style={styles.headline}>{profileData.headline}</Text>
            </View>
          </View>

          {profileData.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.sectionText}>{profileData.bio}</Text>
            </View>
          )}

          {profileData.goals && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Goals for Mentorship</Text>
              <Text style={styles.sectionText}>{profileData.goals}</Text>
            </View>
          )}

          {profileData.industries.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Industry Interests</Text>
              <View style={styles.tagContainer}>
                {profileData.industries.map((ind, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{ind}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {profileData.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Desired Skills</Text>
              <View style={styles.tagContainer}>
                {profileData.skills.map((skill, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {profileData.links.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Social Links</Text>
              {profileData.links.map((link, i) => (
                <Text key={i} style={styles.linkText}>
                  • {link}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Questionnaire Answers */}
        <View style={styles.card}>
          <Text style={styles.title}>Questionnaire Answers</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mentoring Comfort Level</Text>
            <Text style={styles.sectionText}>
              {questionnaireAnswers.mentoringComfort}/10
            </Text>
          </View>

          {questionnaireAnswers.industry && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Industry</Text>
              <Text style={styles.sectionText}>
                {questionnaireAnswers.industry}
              </Text>
            </View>
          )}

          {questionnaireAnswers.mentorIndustry && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mentor Industry</Text>
              <Text style={styles.sectionText}>
                {questionnaireAnswers.mentorIndustry}
              </Text>
            </View>
          )}

          {questionnaireAnswers.mentorSkillset && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mentor Skillset to Learn</Text>
              <Text style={styles.sectionText}>
                {questionnaireAnswers.mentorSkillset}
              </Text>
            </View>
          )}

          {questionnaireAnswers.developmentGoal && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Development Goals</Text>
              <Text style={styles.sectionText}>
                {questionnaireAnswers.developmentGoal}
              </Text>
            </View>
          )}

          {questionnaireAnswers.holdingBack && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What&apos;s Holding You Back</Text>
              <Text style={styles.sectionText}>
                {questionnaireAnswers.holdingBack}
              </Text>
            </View>
          )}
        </View>

        {/* Next Button */}
        <View style={styles.actions}>
          <Pressable
            style={styles.button}
            onPress={() => router.push("/onboarding2/connect")}
          >
            <Text style={styles.buttonText}>Next: Connect</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Edit/Form Mode
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>Profile Setup</Text>
      <Text style={styles.subtitle}>
        Add your name, picture and a short bio.
      </Text>

      {/* Form Inputs */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={formData.firstName}
          onChangeText={(text) => handleInputChange("firstName", text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={formData.lastName}
          onChangeText={(text) => handleInputChange("lastName", text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Profile Picture</Text>
        <Pressable style={styles.fileInput}>
          <MaterialIcons name="image" size={24} color="#9CA3AF" />
          <Text style={styles.fileInputText}>
            {formData.profilePicture ? "File chosen" : "No file chosen"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Resume</Text>
        <Pressable style={styles.fileInput}>
          <MaterialIcons name="description" size={24} color="#9CA3AF" />
          <Text style={styles.fileInputText}>
            {formData.resume ? "File chosen" : "No file chosen"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Headline</Text>
        <TextInput
          style={styles.input}
          placeholder="Please input answer"
          value={formData.headline}
          onChangeText={(text) => handleInputChange("headline", text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Please input answer"
          value={formData.bio}
          onChangeText={(text) => handleInputChange("bio", text)}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Goals for Mentorship</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Please input answer"
          value={formData.goals}
          onChangeText={(text) => handleInputChange("goals", text)}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Industry Interests */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Industry Interests</Text>
        <View style={styles.addItemRow}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add an industry"
            value={tempIndustry}
            onChangeText={setTempIndustry}
          />
          <Pressable style={styles.addButton} onPress={addIndustry}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>
        <View style={styles.tagContainer}>
          {formData.industries.map((ind, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{ind}</Text>
              <Pressable onPress={() => removeIndustry(i)}>
                <MaterialIcons name="close" size={16} color="#7C3AED" />
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Desired Skills */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Desired Skills</Text>
        <View style={styles.addItemRow}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add a skill"
            value={tempSkill}
            onChangeText={setTempSkill}
          />
          <Pressable style={styles.addButton} onPress={addSkill}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>
        <View style={styles.tagContainer}>
          {formData.skills.map((skill, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
              <Pressable onPress={() => removeSkill(i)}>
                <MaterialIcons name="close" size={16} color="#7C3AED" />
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Links */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Social Links</Text>
        <View style={styles.addItemRow}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add a link to your Social Profile"
            value={tempLink}
            onChangeText={setTempLink}
          />
          <Pressable style={styles.addButton} onPress={addLink}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>
        <View style={styles.tagContainer}>
          {formData.links.map((link, i) => (
            <View key={i} style={styles.linkTag}>
              <Text style={styles.linkTagText}>{link}</Text>
              <Pressable onPress={() => removeLink(i)}>
                <MaterialIcons name="close" size={16} color="#7C3AED" />
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={handleCancel}
        >
          <Text style={styles.secondaryText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => router.push("/onboarding2")}
        >
          <Text style={styles.secondaryText}>Back to Onboarding 2</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8, color: "#111" },
  subtitle: { color: "#6B7280", marginBottom: 24, fontSize: 14 },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  editButtonText: { color: "#7C3AED", fontWeight: "600", fontSize: 12 },

  // Card Styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  // Profile Display Styles
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 20 },
  profileInfo: { flex: 1 },
  displayName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  headline: { fontSize: 14, color: "#6B7280" },

  // Section Styles
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  sectionText: { fontSize: 14, color: "#4B5563", lineHeight: 20 },
  linkText: { fontSize: 14, color: "#4B5563", marginBottom: 4 },

  // Tag Styles
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ede9fe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: { fontSize: 12, color: "#6B3EDA", fontWeight: "500" },
  linkTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  linkTagText: { fontSize: 12, color: "#1e40af", fontWeight: "500" },

  // Form Styles
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#374151" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111",
  },
  textArea: {
    paddingTop: 10,
    textAlignVertical: "top",
  },
  fileInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileInputText: { fontSize: 14, color: "#9CA3AF" },

  // Add Item Styles
  addItemRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  addItemInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111",
  },
  addButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  // Action Buttons
  actions: { marginTop: 20, marginBottom: 32 },
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
});
