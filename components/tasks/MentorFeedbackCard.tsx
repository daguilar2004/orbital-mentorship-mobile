import { Text, View } from "react-native";
import { Task } from "../../app/context/AppContext";
import { styles } from "../../app/styles/homeStyles";

type MentorFeedbackCardProps = {
  activeTask: Task;
};

export default function MentorFeedbackCard({
  activeTask,
}: MentorFeedbackCardProps) {
  return (
    <View style={styles.modalCard}>
      <Text style={styles.cardHeading}>Mentor Feedback</Text>
      <Text style={styles.bodyText}>{activeTask.mentorFeedback}</Text>

      {activeTask.reviewedAt ? (
        <Text style={styles.smallMuted}>
          Reviewed on {activeTask.reviewedAt}
        </Text>
      ) : null}
    </View>
  );
}
