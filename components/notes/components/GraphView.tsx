import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { categoryColors, options } from "../constants";
import { Note } from "../types";

const CANVAS_W = 440;
const CANVAS_H = 540;
const CX = CANVAS_W / 2;
const CY = CANVAS_H / 2 - 20;
const HUB_R = 140;
const NOTE_R = 72;
const HUB_NODE_R = 26;
const NOTE_NODE_R = 18;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3.0;
const SCREEN_H = Dimensions.get("window").height * 0.65;

const hubAngles: Record<string, number> = {
  Pre: -Math.PI / 2,
  During: -Math.PI / 2 + (2 * Math.PI) / 5,
  Post: -Math.PI / 2 + (4 * Math.PI) / 5,
  Daily: -Math.PI / 2 + (6 * Math.PI) / 5,
  New: -Math.PI / 2 + (8 * Math.PI) / 5,
};

function hubPos(cat: string) {
  const a = hubAngles[cat] ?? 0;
  return { x: CX + HUB_R * Math.cos(a), y: CY + HUB_R * Math.sin(a) };
}

function notePos(hubX: number, hubY: number, i: number, n: number) {
  const angle = (i / Math.max(n, 1)) * 2 * Math.PI - Math.PI / 2;
  return { x: hubX + NOTE_R * Math.cos(angle), y: hubY + NOTE_R * Math.sin(angle) };
}

function GraphLine({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: midX - length / 2,
        top: midY - 0.75,
        width: length,
        height: 1.5,
        backgroundColor: color + "55",
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

type Props = {
  notes: Note[];
  onOpenNote: (note: Note) => void;
};

export default function GraphView({ notes, onOpenNote }: Props) {
  const [expandedHub, setExpandedHub] = useState<string | null>(null);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const notesByCategory: Record<string, Note[]> = {};
  options.forEach((cat) => {
    notesByCategory[cat] = notes.filter((n) => n.type === cat);
  });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const next = savedScale.value * e.scale;
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    })
    .onEnd(() => { savedScale.value = scale.value; });

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onUpdate((e) => {
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    })
    .onEnd(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const getNodeSize = (base: number, s: number) => {
    if (s > 1.8) return base * 1.5;
    if (s > 1.2) return base * 1.2;
    if (s < 0.6) return base * 0.7;
    return base;
  };

  const getPreviewLength = (s: number) => {
    if (s > 1.8) return 60;
    if (s > 1.2) return 36;
    return 24;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composed}>
        <View style={styles.canvas} collapsable={false}>
          <Animated.View style={[{ width: CANVAS_W, height: CANVAS_H }, animatedStyle]}>
            {options.map((cat) => {
              const hub = hubPos(cat);
              const catNotes = notesByCategory[cat];
              const showing = expandedHub === null || expandedHub === cat;
              if (!showing || catNotes.length === 0) return null;
              return catNotes.map((n, i) => {
                const np = notePos(hub.x, hub.y, i, catNotes.length);
                return (
                  <GraphLine key={n.id} x1={hub.x} y1={hub.y} x2={np.x} y2={np.y} color={categoryColors[cat]} />
                );
              });
            })}

            {options.map((cat, ci) => {
              const hub = hubPos(cat);
              const nextHub = hubPos(options[(ci + 1) % options.length]);
              return <GraphLine key={`ring-${cat}`} x1={hub.x} y1={hub.y} x2={nextHub.x} y2={nextHub.y} color="#ccc" />;
            })}

            {options.map((cat) => {
              const hub = hubPos(cat);
              const catNotes = notesByCategory[cat];
              const showing = expandedHub === null || expandedHub === cat;
              if (!showing || catNotes.length === 0) return null;
              return catNotes.map((n, i) => {
                const np = notePos(hub.x, hub.y, i, catNotes.length);
                const currentScale = scale.value;
                const nodeR = getNodeSize(NOTE_NODE_R, currentScale);
                const previewLen = getPreviewLength(currentScale);
                const preview =
                  typeof n.text === "string"
                    ? n.text.slice(0, previewLen)
                    : n.text[0]?.slice(0, previewLen) ?? "";
                return (
                  <TouchableOpacity
                    key={n.id}
                    onPress={() => onOpenNote(n)}
                    style={{
                      position: "absolute",
                      left: np.x - nodeR,
                      top: np.y - nodeR,
                      width: nodeR * 2,
                      height: nodeR * 2,
                      borderRadius: n.favorite ? 0 : nodeR,
                      backgroundColor: n.favorite ? "transparent" : categoryColors[cat] + "22",
                      borderWidth: n.favorite ? 0 : 1.5,
                      borderColor: categoryColors[cat],
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 3,
                    }}
                  >
                    {n.favorite ? (
                      <>
                        <MaterialCommunityIcons
                          name="heart-outline"
                          size={nodeR * 2}
                          color={categoryColors[cat]}
                          style={{ position: "absolute", top: 0, left: 0 }}
                        />
                        <View style={{ position: "absolute", top: nodeR * 0.25, left: nodeR * 0.2, right: nodeR * 0.2, bottom: nodeR * 0.15, justifyContent: "center", alignItems: "center" }}>
                          <Text style={{ fontSize: currentScale > 1.5 ? 9 : 7, color: categoryColors[cat], textAlign: "center" }} numberOfLines={currentScale > 1.5 ? 3 : 2}>
                            {currentScale > 1.2 ? n.title : (preview || n.title)}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <Text style={{ fontSize: currentScale > 1.5 ? 9 : 7, color: categoryColors[cat], textAlign: "center" }} numberOfLines={currentScale > 1.5 ? 4 : 2}>
                        {currentScale > 1.2 ? n.title : (preview || n.title)}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              });
            })}

            {options.map((cat) => {
              const hub = hubPos(cat);
              const count = notesByCategory[cat].length;
              const isExpanded = expandedHub === cat;
              const currentScale = scale.value;
              const nodeR = getNodeSize(HUB_NODE_R, currentScale);
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setExpandedHub((prev) => (prev === cat ? null : cat))}
                  style={{
                    position: "absolute",
                    left: hub.x - nodeR,
                    top: hub.y - nodeR,
                    width: nodeR * 2,
                    height: nodeR * 2,
                    borderRadius: nodeR,
                    backgroundColor: isExpanded ? categoryColors[cat] : categoryColors[cat] + "33",
                    borderWidth: 2,
                    borderColor: categoryColors[cat],
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: currentScale > 1.5 ? 13 : 10, fontWeight: "bold", color: isExpanded ? "#fff" : categoryColors[cat], textAlign: "center" }}>
                    {cat}{"\n"}
                    <Text style={{ fontSize: currentScale > 1.5 ? 11 : 9, fontWeight: "normal" }}>
                      {count} {count === 1 ? "note" : "notes"}
                    </Text>
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>
      </GestureDetector>
      <Text style={styles.hint}>Pinch to zoom · Drag to pan · Tap a hub or note</Text>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: SCREEN_H },
  canvas: { flex: 1, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  hint: { textAlign: "center", color: "#667085", fontSize: 11, marginTop: 8, marginBottom: 16 },
});
