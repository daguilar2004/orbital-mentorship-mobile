import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Phase, Task } from "../../context/AppContext";
import { styles } from "../../styles/homeStyles";

type UserRole = "mentor" | "mentee";

type TaskDetailsCardProps = {
  activeTask: Task | null;
  activePhase: Phase | null;
  userRole: UserRole;
  draftDesc: string;
  setDraftDesc: React.Dispatch<React.SetStateAction<string>>;
  updateTaskDescription: (
    phaseId: string,
    taskId: string,
    description: string,
  ) => void;
};

export default function TaskDetailsCard({
  activeTask,
  activePhase,
  userRole,
  draftDesc,
  setDraftDesc,
  updateTaskDescription,
}: TaskDetailsCardProps) {
  return (
    <View style={styles.modalCard}>
      <Text style={styles.cardHeading}>Task Description</Text>

      {userRole === "mentor" ? (
        <>
          <TextInput
            value={draftDesc}
            onChangeText={setDraftDesc}
            multiline
            style={styles.textArea}
            placeholder="Write the task description…"
            placeholderTextColor="#6B7280"
          />
          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              if (!activePhase || !activeTask) return;
              updateTaskDescription(
                activePhase.id,
                activeTask.id,
                draftDesc.trim(),
              );
            }}
          >
            <Text style={styles.primaryBtnText}>Save Description</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.bodyText}>
          {activeTask?.description || "No description."}
        </Text>
      )}

      {activeTask?.skills && activeTask.skills.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.cardHeading, { marginBottom: 8 }]}>
            Skills Required
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {activeTask.skills.map((skill, index) => (
              <View key={index} style={styles.skillBubble}>
                <Text style={styles.skillBubbleText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {activeTask?.expectedTime && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.cardHeading, { marginBottom: 4 }]}>
            Expected Time
          </Text>
          <Text style={styles.bodyText}>
            {activeTask.expectedTime.value} {activeTask.expectedTime.unit}
          </Text>
        </View>
      )}

      {activeTask?.resources && activeTask.resources.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.cardHeading, { marginBottom: 8 }]}>
            Resources
          </Text>
          <View style={{ gap: 8 }}>
            {activeTask.resources.map((resource, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (resource.type === "link") {
                    Alert.alert("Open Link", `Open ${resource.value}?`);
                  } else {
                    Alert.alert(
                      "File",
                      `File: ${resource.fileInfo?.name || resource.label}\nSize: ${(
                        (resource.fileInfo?.size || 0) / 1024
                      ).toFixed(1)} KB`,
                    );
                  }
                }}
                style={styles.resourceItem}
              >
                <Ionicons
                  name={resource.type === "link" ? "link" : "document"}
                  size={16}
                  color="#7C3AED"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resourceText}>
                    {resource.fileInfo?.name ||
                      resource.label ||
                      (resource.type === "link" ? "Link" : "File")}
                  </Text>
                  {resource.fileInfo?.size && (
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      {(resource.fileInfo.size / 1024).toFixed(1)} KB
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text style={styles.metaText}>Due: {activeTask?.dueDate}</Text>

        <Ionicons name="ribbon-outline" size={16} color="#6B7280" />
        <Text
          style={[styles.metaText, { color: "#7C3AED", fontWeight: "800" }]}
        >
          {activeTask?.xp} XP
        </Text>
      </View>
    </View>
  );
}
