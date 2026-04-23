// API Configuration for Orbital Mentorship Backend
// Update this URL based on your backend server location

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api";

export const API_ENDPOINTS = {
  // Health check
  HEALTH: `${API_BASE_URL}/health`,

  // Mentorship
  MENTORSHIPS: `${API_BASE_URL}/mentorships`,
  MENTORSHIP_BY_ID: (id: string) => `${API_BASE_URL}/mentorships/${id}`,

  // Phases
  PHASES: `${API_BASE_URL}/phases`,
  PHASE_BY_ID: (id: string) => `${API_BASE_URL}/phases/${id}`,

  // Tasks
  TASKS: `${API_BASE_URL}/tasks`,
  TASK_BY_ID: (id: string) => `${API_BASE_URL}/tasks/${id}`,
  TASK_SUBMIT: (id: string) => `${API_BASE_URL}/tasks/${id}/submit`,
  TASK_REVIEW: (id: string) => `${API_BASE_URL}/tasks/${id}/review`,
  TASK_UPDATE_DESCRIPTION: (id: string) => `${API_BASE_URL}/tasks/${id}/description`,

  // Resources
  RESOURCES: `${API_BASE_URL}/resources`,
  RESOURCE_BY_ID: (id: string) => `${API_BASE_URL}/resources/${id}`,

  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,

  // Mentors
  MENTORS: `${API_BASE_URL}/mentors`,
  MENTOR_BY_ID: (id: string) => `${API_BASE_URL}/mentors/${id}`,

  // Mentees
  MENTEES: `${API_BASE_URL}/mentees`,
  MENTEE_BY_ID: (id: string) => `${API_BASE_URL}/mentees/${id}`,
};

// Generic fetch wrapper with error handling
export async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; success: boolean }> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
      };
    }

    const data = (await response.json()) as T;
    return { data, success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("API Call Error:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Helper for GET requests
export function apiGet<T>(url: string) {
  return apiCall<T>(url, { method: "GET" });
}

export function apiGetWithOptions<T>(url: string, options: RequestInit = {}) {
  return apiCall<T>(url, { ...options, method: "GET" });
}

// Helper for POST requests
export function apiPost<T>(url: string, data: any) {
  return apiCall<T>(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function apiPostWithOptions<T>(
  url: string,
  data: any,
  options: RequestInit = {}
) {
  return apiCall<T>(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Helper for PATCH requests
export function apiPatch<T>(url: string, data: any) {
  return apiCall<T>(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function apiPatchWithOptions<T>(
  url: string,
  data: any,
  options: RequestInit = {}
) {
  return apiCall<T>(url, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Helper for DELETE requests
export function apiDelete<T>(url: string) {
  return apiCall<T>(url, { method: "DELETE" });
}

export function apiDeleteWithOptions<T>(url: string, options: RequestInit = {}) {
  return apiCall<T>(url, { ...options, method: "DELETE" });
}
