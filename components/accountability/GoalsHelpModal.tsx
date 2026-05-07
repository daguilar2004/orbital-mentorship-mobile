import { Modal, Pressable, Text, View } from "react-native";
import { styles } from "../../styles/accountabilityStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

function HelpRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.helpRow}>
      <View style={styles.helpEmojiCircle}>
        <Text style={styles.helpEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.helpRowText}>{text}</Text>
    </View>
  );
}

export default function GoalsHelpModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.helpModalCard}>
          <View style={styles.helpIconWrap}>
            <Text style={styles.helpIconText}>?</Text>
          </View>

          <Text style={styles.helpModalTitle}>How to Use Goals</Text>
          <Text style={styles.helpModalSub}>
            A quick guide to your SMART goals tab
          </Text>

          <View style={styles.helpList}>
            <HelpRow emoji="👆" text="Tap a goal to expand or collapse it" />
            <HelpRow emoji="✋" text="Hold a goal to select it" />
            <HelpRow
              emoji="🗑"
              text="Use the trash button to delete a selected goal"
            />
            <HelpRow
              emoji="✓"
              text="Use the check button to mark a selected goal complete"
            />
            <HelpRow
              emoji="＋"
              text="Use the plus button to add a new SMART goal"
            />
            <HelpRow
              emoji="◎"
              text="You can optionally link a daily habit to any SMART goal"
            />
          </View>

          <Pressable style={styles.helpGotItBtn} onPress={onClose}>
            <Text style={styles.helpGotItBtnText}>Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}