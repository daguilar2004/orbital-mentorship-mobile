// Mock authentication for development (until real login is implemented)

export const MOCK_AUTH_TOKEN = "dev_test_token_abc123xyz";
export const MOCK_USER_ID = "507f1f77bcf86cd799439011"; // Mock MongoDB ObjectId

// API URL Configuration:
// - For emulator/local development: http://localhost:4000/api
// - For physical device over WiFi: http://192.168.49.153:4000/api (or your machine's IP)
// Set EXPO_PUBLIC_API_URL in .env file to override the default
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? "http://localhost:4000/api" : "http://192.168.49.153:4000/api");
