import { Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuth0App } from "../context/Auth0Provider";
import { styles } from "../styles/homeStyles";

export default function Index() {
  const { isAuthenticated, login, isLoading } = useAuth0App();

  // ✅ If already logged in → go to homepage
  if (isAuthenticated) {
    return <Redirect href="/homepage" />;
  }
  console.log("LOGIN PAGE RENDERED");
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
        onPress={() => {
          void login();
          console.log("LOGIN BUTTON PRESSED");
        }}
      >
        <Text style={styles.primaryBtnText}>
          {isLoading ? "Signing in..." : "Login with Auth0"}
        </Text>
      </Pressable>
    </View>
  );
}
