import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Switch, Text, View } from "react-native";
import "react-native-gesture-handler";

import { AppProvider, useApp } from "./context/AppContext";
import { Auth0AppProvider } from "./context/Auth0Provider";

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

function AppDrawer() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#7C3AED",
      }}
    >
      {/* Login page: hide from drawer */}
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: "none" },
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="homepage"
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

      <Drawer.Screen
        name="onboarding2/profile-setup"
        options={{
          title: "Onboarding",
        }}
      />

      <Drawer.Screen
        name="onboarding"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}

export default function Layout() {
  return (
    <Auth0AppProvider>
      <AppProvider>
        <AppDrawer />
      </AppProvider>
    </Auth0AppProvider>
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