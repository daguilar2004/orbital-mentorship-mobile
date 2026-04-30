import React, { createContext, useContext, useMemo, useState } from "react";
import Auth0 from"react-native-auth0";

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

const auth0 = new Auth0({
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!,
});

export function Auth0AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    try {
      setIsLoading(true);

      const credentials = await auth0.webAuth.authorize({
        scope: "openid profile email",
      });

      console.log("LOGIN OK");
      console.log("Access token present:", !!credentials.accessToken);
      const profile = await auth0.auth.userInfo({
        token: credentials.accessToken,
      });
      setUser(profile as AuthUser);

      console.log("User profile:", profile);
    } catch (error) {
      console.error("Auth0 login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await auth0.webAuth.clearSession();
      setUser(null);
      console.log("LOGOUT OK");
    } catch (error) {
      console.error("Auth0 logout error:", error);
    } finally {
      setIsLoading(false);
    }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth0App() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth0App must be used within Auth0AppProvider");
  }
  return context;
}