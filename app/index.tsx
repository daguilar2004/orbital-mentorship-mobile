import { useAuth0 } from "@auth0/auth0-react";
import { Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/homeStyles";

export default function Index() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  if (isAuthenticated) {
    return <Redirect href="/homepage" />;
  }

  return (
    <View
      style={[
        styles.screen,
        { justifyContent: "center", alignItems: "center", padding: 24 },
      ]}
    >
      <Text style={styles.h1}>Orbital Mentorship</Text>
      <Text style={[styles.subtitle, { marginTop: 12 }]}>
        Sign in to continue
      </Text>

      <Pressable
        style={[styles.primaryBtn, { marginTop: 24, width: "100%" }]}
        onPress={() => loginWithRedirect()}
      >
        <Text style={styles.primaryBtnText}>
          {isLoading ? "Signing in..." : "Login with Auth0"}
        </Text>
      </Pressable>
    </View>
  );
}
