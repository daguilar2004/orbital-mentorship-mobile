import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

export function Auth0WebProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.EXPO_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : undefined,
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
