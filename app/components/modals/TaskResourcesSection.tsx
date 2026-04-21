import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles/homeStyles";

type TaskResource = {
  type: "link" | "file";
  value: string;
  label?: string;
  fileInfo?: {
    name: string;
    size: number;
    uri: string;
    mimeType?: string;
  };
};

type TaskResourcesSectionProps = {
  newTaskResources: TaskResource[];
  setNewTaskResources: React.Dispatch<React.SetStateAction<TaskResource[]>>;
};

export default function TaskResourcesSection({
  newTaskResources,
  setNewTaskResources,
}: TaskResourcesSectionProps) {
  const handleUploadFile = async () => {
    if (Platform.OS === "web") {
      if (typeof document === "undefined") {
        Alert.alert(
          "Error",
          "File upload is not available in this environment",
        );
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.accept = "*/*";
      input.multiple = false;

      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;

          const newResource: TaskResource = {
            type: "file",
            value: dataUrl,
            label: file.name,
            fileInfo: {
              name: file.name,
              size: file.size,
              uri: dataUrl,
              mimeType: file.type,
            },
          };

          setNewTaskResources((prev) => [...prev, newResource]);

          Alert.alert("File Added", `Successfully added: ${file.name}`);
        };

        reader.readAsDataURL(file);
      };

      input.click();
      return;
    }

    const isExpoGo =
      !Constants.appOwnership || Constants.appOwnership === "expo";

    if (isExpoGo) {
      Alert.alert(
        "Limited Support",
        "File upload has limited support in Expo Go. For full functionality, please use a development build or standalone app.",
        [
          {
            text: "Continue Anyway",
            onPress: () => {
              void pickDocument();
            },
          },
          { text: "Cancel", style: "cancel" },
        ],
      );
      return;
    }

    await pickDocument();
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.canceled) {
        Alert.alert("Cancelled", "File selection was cancelled");
        return;
      }

      const file = result.assets?.[0];
      if (!file) {
        Alert.alert("Error", "Failed to select file");
        return;
      }

      const newResource: TaskResource = {
        type: "file",
        value: file.uri,
        label: file.name,
        fileInfo: {
          name: file.name,
          size: file.size ?? 0,
          uri: file.uri,
          mimeType: file.mimeType,
        },
      };

      setNewTaskResources((prev) => [...prev, newResource]);
      Alert.alert("File Added", `Successfully added: ${file.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      Alert.alert("Error", `Failed to pick document: ${message}`);
    }
  };

  return (
    <>
      <Text style={styles.label}>
        Resources{" "}
        {newTaskResources.length > 0 && `(${newTaskResources.length})`}
      </Text>

      <View style={{ gap: 8 }}>
        {newTaskResources.map((resource, index) => (
          <View key={index} style={styles.resourceItem}>
            <Ionicons
              name={resource.type === "link" ? "link" : "document"}
              size={20}
              color="#6B7280"
            />

            <View style={{ flex: 1 }}>
              {resource.type === "link" ? (
                <TextInput
                  style={[
                    styles.input,
                    {
                      marginBottom: 0,
                      borderWidth: 0,
                      padding: 0,
                    },
                  ]}
                  placeholder="https://..."
                  placeholderTextColor="#6B7280"
                  value={resource.value}
                  onChangeText={(text) => {
                    setNewTaskResources((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, value: text } : item,
                      ),
                    );
                  }}
                />
              ) : (
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    {resource.fileInfo?.name || resource.label}
                  </Text>
                  {resource.fileInfo?.size ? (
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      {(resource.fileInfo.size / 1024).toFixed(1)} KB
                    </Text>
                  ) : null}
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                setNewTaskResources((prev) =>
                  prev.filter((_, i) => i !== index),
                );
              }}
              style={{ padding: 4 }}
            >
              <Ionicons name="trash" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => {
              setNewTaskResources((prev) => [
                ...prev,
                { type: "link", value: "", label: "Link" },
              ]);
            }}
            style={[styles.secondaryBtn, { flex: 1 }]}
          >
            <Ionicons name="link" size={16} color="#111827" />
            <Text style={styles.secondaryBtnText}>Add Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              void handleUploadFile();
            }}
            style={[styles.secondaryBtn, { flex: 1 }]}
          >
            <Ionicons name="document" size={16} color="#111827" />
            <Text style={styles.secondaryBtnText}>Upload File</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
