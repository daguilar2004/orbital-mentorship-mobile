import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Task } from "../../app/context/AppContext";
import { styles } from "../../app/styles/homeStyles";

type AttachedFilesCardProps = {
  activeTask: Task | null;
};

export default function AttachedFilesCard({
  activeTask,
}: AttachedFilesCardProps) {
  return (
    <View style={styles.modalCard}>
      <Text style={styles.cardHeading}>Attached Files</Text>

      {activeTask?.attachments && activeTask.attachments.length > 0 ? (
        <View style={{ gap: 10, marginTop: 8 }}>
          {activeTask.attachments.map((a) => (
            <View key={a.id} style={styles.fileRow}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                }}
              >
                <Ionicons name="document-outline" size={18} color="#6B7280" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName}>{a.name}</Text>
                  <Text style={styles.fileSize}>{a.sizeLabel}</Text>
                </View>
              </View>

              <Pressable onPress={() => {}}>
                <Ionicons name="download-outline" size={18} color="#2563EB" />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.smallMuted}>No files attached.</Text>
      )}
    </View>
  );
}
