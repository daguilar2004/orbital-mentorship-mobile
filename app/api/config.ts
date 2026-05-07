import Constants from "expo-constants";
import { Platform } from "react-native";

const DEFAULT_API_PORT = process.env.EXPO_PUBLIC_API_PORT || "4000";
const DEFAULT_API_PATH = process.env.EXPO_PUBLIC_API_PATH || "/api";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function normalizePath(path: string) {
  const trimmed = path.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

function extractHostname(hostUri?: string | null) {
  if (!hostUri) return null;

  const sanitized = hostUri.replace(/^https?:\/\//, "");
  return sanitized.split(":")[0] || null;
}

function getExpoHostUri() {
  const expoConfigHostUri =
    (Constants.expoConfig as { hostUri?: string } | null)?.hostUri ?? null;
  const manifestHostUri =
    (Constants as typeof Constants & {
      manifest?: { debuggerHost?: string; hostUri?: string };
      manifest2?: {
        extra?: {
          expoClient?: { hostUri?: string };
        };
      };
    }).manifest2?.extra?.expoClient?.hostUri ??
    (Constants as typeof Constants & {
      manifest?: { debuggerHost?: string; hostUri?: string };
    }).manifest?.debuggerHost ??
    (Constants as typeof Constants & {
      manifest?: { debuggerHost?: string; hostUri?: string };
    }).manifest?.hostUri ??
    null;

  return expoConfigHostUri || manifestHostUri;
}

function detectDevelopmentHost() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.hostname;
  }

  return extractHostname(getExpoHostUri());
}

function resolveFallbackHost() {
  const detectedHost = detectDevelopmentHost();

  if (detectedHost && detectedHost !== "localhost" && detectedHost !== "127.0.0.1") {
    return detectedHost;
  }

  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  return "localhost";
}

function resolveConfiguredApiBaseUrl(configuredUrl: string) {
  try {
    const parsed = new URL(configuredUrl);
    const configuredPath = normalizePath(parsed.pathname);
    const apiPath = configuredPath || normalizePath(DEFAULT_API_PATH);

    return normalizeBaseUrl(`${parsed.origin}${apiPath}`);
  } catch {
    return normalizeBaseUrl(configuredUrl);
  }
}

function resolveApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (configuredUrl) {
    return resolveConfiguredApiBaseUrl(configuredUrl);
  }

  return normalizeBaseUrl(
    `http://${resolveFallbackHost()}:${DEFAULT_API_PORT}${normalizePath(DEFAULT_API_PATH)}`
  );
}

export const API_BASE_URL = resolveApiBaseUrl();
export const API_URL = API_BASE_URL;

export function buildApiUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
