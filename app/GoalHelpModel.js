import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type GoalsHelpModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function GoalsHelpModal({
  visible,
  onClose,
}: GoalsHelpModalProps) {
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
              emoji="+"
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

function HelpRow(props: { emoji: string; text: string }) {
  const { emoji, text } = props;

  return (
    <View style={styles.helpRow}>
      <View style={styles.helpEmojiCircle}>
        <Text style={styles.helpEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.helpRowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.22)",
    justifyContent: "center",
    padding: 14,
  },
  helpModalCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 30,
    paddingTop: 28,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  helpIconWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F0F8",
    borderWidth: 1.5,
    borderColor: "#E9D5FF",
  },
  helpIconText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#7C3AED",
    marginTop: -2,
  },
  helpModalTitle: {
    marginTop: 22,
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
  helpModalSub: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
  },
  helpList: {
    marginTop: 28,
    gap: 18,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  helpEmojiCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F3F0F8",
    borderWidth: 1.5,
    borderColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  helpEmoji: {
    fontSize: 22,
    color: "#111827",
    fontWeight: "700",
  },
  helpRowText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: "#374151",
    fontWeight: "700",
    paddingTop: 6,
  },
  helpGotItBtn: {
    marginTop: 28,
    height: 62,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
  },
  helpGotItBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});