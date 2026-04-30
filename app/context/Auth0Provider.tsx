import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

WebBrowser.maybeCompleteAuthSession();

type AuthUser = {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function Auth0AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  // 🔥 IMPORTANT: replace this with your real backend or auth provider
  const discovery = {
    authorizationEndpoint: "mongodb://YOUR_HOST_IP:27017/orbital-mentorship-dev",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? "dummy",
      redirectUri,
      scopes: ["openid", "profile", "email"],
    },
    discovery,
  );

  // ✅ HANDLE LOGIN RESULT
  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === "success") {
        setIsLoading(true);

        try {
          // If using backend auth, you'd fetch user here
          setUser({
            sub: "demo-user",
            name: "User",
            email: "user@example.com",
          });

          console.log("LOGIN SUCCESS");
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleAuth();
  }, [response]);

  const login = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (e) {
      console.error("Login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth0App() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth0App must be used within Auth0AppProvider");
  }
  return context;
}