import { API_ENDPOINTS } from "./api";
import {
  apiDeleteWithOptions,
  apiGetWithOptions,
  apiPatchWithOptions,
  apiPostWithOptions,
} from "./api";

export interface TaskResponse {
  _id: string;
  title: string;
  description: string;
  xp: number;
  dueDate?: string;
  expectedTime?: {
    value: number;
    unit: "hours" | "days" | "weeks";
  };
  skills?: string[];
  resources?: {
    type: "link" | "file";
    value: string;
    label?: string;
  }[];
  status: "pending" | "submitted" | "approved" | "rejected";
  submittedResponse?: string;
  submittedAt?: string;
  attachments?: { id: string; name: string; sizeLabel: string }[];
  mentorFeedback?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskCreateData {
  title: string;
  description: string;
  xp: number;
  dueDate?: string;
  expectedTime?: {
    value: number;
    unit: "hours" | "days" | "weeks";
  };
  skills?: string[];
  resources?: {
    type: "link" | "file";
    value: string;
    label?: string;
  }[];
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  xp?: number;
  dueDate?: string;
  expectedTime?: {
    value: number;
    unit: "hours" | "days" | "weeks";
  };
  skills?: string[];
  resources?: {
    type: "link" | "file";
    value: string;
    label?: string;
  }[];
  status?: "pending" | "submitted" | "approved" | "rejected";
  submittedResponse?: string;
  mentorFeedback?: string;
}

export async function fetchTask(taskId: string, options?: RequestInit) {
  return apiGetWithOptions<TaskResponse>(
    `${API_ENDPOINTS.TASKS}/${taskId}`,
    options
  );
}

export async function fetchTasksByPhase(phaseId: string, options?: RequestInit) {
  return apiGetWithOptions<TaskResponse[]>(
    `${API_ENDPOINTS.PHASES}/${phaseId}/tasks`,
    options
  );
}

export async function createTask(
  phaseId: string,
  data: TaskCreateData,
  options?: RequestInit
) {
  return apiPostWithOptions<TaskResponse>(
    `${API_ENDPOINTS.PHASES}/${phaseId}/tasks`,
    data,
    options
  );
}

export async function updateTask(
  taskId: string,
  data: TaskUpdateData,
  options?: RequestInit
) {
  return apiPatchWithOptions<TaskResponse>(
    `${API_ENDPOINTS.TASKS}/${taskId}`,
    data,
    options
  );
}

export async function deleteTask(taskId: string, options?: RequestInit) {
  return apiDeleteWithOptions<{ success: boolean }>(
    `${API_ENDPOINTS.TASKS}/${taskId}`,
    options
  );
}

export async function submitTask(
  taskId: string,
  response: string,
  options?: RequestInit
) {
  return apiPatchWithOptions<TaskResponse>(
    `${API_ENDPOINTS.TASKS}/${taskId}/submit`,
    {
      submittedResponse: response,
    },
    options
  );
}

export async function reviewTask(
  taskId: string,
  decision: "approved" | "rejected",
  feedback: string,
  options?: RequestInit
) {
  return apiPatchWithOptions<TaskResponse>(
    `${API_ENDPOINTS.TASKS}/${taskId}/review`,
    {
      status: decision,
      mentorFeedback: feedback,
    },
    options
  );
}
