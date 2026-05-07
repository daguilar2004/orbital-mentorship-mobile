import { API_BASE_URL, buildApiUrl } from "../api/config";

export const API_ENDPOINTS = {
  // Health check
  HEALTH: buildApiUrl("/health"),

  // Mentorship
  MENTORSHIPS: buildApiUrl("/mentorships"),
  MENTORSHIP_BY_ID: (id: string) => buildApiUrl(`/mentorships/${id}`),

  // Phases
  PHASES: buildApiUrl("/phases"),
  PHASE_BY_ID: (id: string) => buildApiUrl(`/phases/${id}`),

  // Tasks
  TASKS: buildApiUrl("/tasks"),
  TASK_BY_ID: (id: string) => buildApiUrl(`/tasks/${id}`),
  TASK_SUBMIT: (id: string) => buildApiUrl(`/tasks/${id}/submit`),
  TASK_REVIEW: (id: string) => buildApiUrl(`/tasks/${id}/review`),
  TASK_UPDATE_DESCRIPTION: (id: string) =>
    buildApiUrl(`/tasks/${id}/description`),

  // Resources
  RESOURCES: buildApiUrl("/resources"),
  RESOURCE_BY_ID: (id: string) => buildApiUrl(`/resources/${id}`),

  // Users
  USERS: buildApiUrl("/users"),
  USER_BY_ID: (id: string) => buildApiUrl(`/users/${id}`),

  // Mentors
  MENTORS: buildApiUrl("/mentors"),
  MENTOR_BY_ID: (id: string) => buildApiUrl(`/mentors/${id}`),

  // Mentees
  MENTEES: buildApiUrl("/mentees"),
  MENTEE_BY_ID: (id: string) => buildApiUrl(`/mentees/${id}`),
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
