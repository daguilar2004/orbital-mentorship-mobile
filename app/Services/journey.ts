const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not set");
}

export type HabitPayload = {
  title: string;
  days: string[];
  completedOn?: string | null;
  linkedGoalId?: string | null;
};

export type GoalPayload = {
  title: string;
  time: string;
  specific: string;
  measurable: string;
  achievable?: string;
  relevant?: string;
  timeBound: string;
  completed?: boolean;
  linkedHabitId?: string | null;
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const text = await res.text();
      if (text) message = text;
    } catch {
      // ignore text parsing errors
    }
    throw new Error(message);
  }

  // For DELETE or empty responses
  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}

// Habits
export async function getHabits() {
  return request<any[]>("/api/habits");
}

export async function createHabit(payload: HabitPayload) {
  return request<any>("/api/habits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateHabit(id: string, payload: Partial<HabitPayload>) {
  return request<any>(`/api/habits/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function toggleHabit(id: string) {
  return request<any>(`/api/habits/${id}/toggle`, {
    method: "PATCH",
  });
}

export async function deleteHabit(id: string) {
  return request<any>(`/api/habits/${id}`, {
    method: "DELETE",
  });
}

// Goals
export async function getGoals() {
  return request<any[]>("/api/goals");
}

export async function createGoal(payload: GoalPayload) {
  return request<any>("/api/goals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateGoal(id: string, payload: Partial<GoalPayload>) {
  return request<any>(`/api/goals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function toggleGoal(id: string) {
  return request<any>(`/api/goals/${id}/toggle-complete`, {
    method: "PATCH",
  });
}

export async function deleteGoal(id: string) {
  return request<any>(`/api/goals/${id}`, {
    method: "DELETE",
  });
}