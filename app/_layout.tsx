import "react-native-gesture-handler";
import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Switch, StyleSheet } from "react-native";
import { AppProvider, useApp } from "./context/AppContext";

function CustomDrawerContent(props: any) {
  const { userRole, toggleRole } = useApp();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <View style={styles.divider} />

      <View style={styles.roleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleTitle}>View Mode</Text>
          <Text style={styles.roleSubtitle}>
            {userRole === "mentee" ? "Mentee" : "Mentor"}
          </Text>
        </View>

        <Switch value={userRole === "mentor"} onValueChange={toggleRole} />
      </View>
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <AppProvider>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: "#7C3AED",
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="notes"
          options={{
            title: "Notes",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="journey"
          options={{
            title: "Journey",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />

        {/* Optional routes if you want them in the drawer too */}
        <Drawer.Screen
          name="phases"
          options={{
            title: "Phases",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="layers" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="timeline"
          options={{
            title: "Timeline",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="onboarding"
          options={{
            title: "Onboarding",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="school" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="onboarding2"
          options={{
            title: "Onboarding 2",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="rocket" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="offboarding"
          options={{
            title: "Offboarding",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="checkmark-done" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  roleTitle: { fontSize: 14, fontWeight: "700" },
  roleSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});
