// Mock authentication for development (until real login is implemented)

export const MOCK_AUTH_TOKEN = "dev_test_token_abc123xyz";
export const MOCK_USER_ID = "507f1f77bcf86cd799439011"; // Mock MongoDB ObjectId
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.49.153:4000/api";
