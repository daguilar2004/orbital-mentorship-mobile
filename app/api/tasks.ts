import { apiGet, apiPost, apiPatch, apiDelete, apiPut } from "./api";

export const TaskAPI = {
  getAll: () => apiGet("/tasks"),

  getById: (id: string) => apiGet(`/tasks/${id}`),

  create: (data: any) => apiPost("/tasks", data),

  submit: (taskId: string, submissionText: string) =>
    apiPost(`/tasks/${taskId}/submit`, {
      submissionText,
    }),

  review: (
    taskId: string,
    decision: "approved" | "rejected",
    mentorFeedback: string
  ) =>
    apiPost(`/tasks/${taskId}/review`, {
      decision,
      mentorFeedback,
    }),

  updateDescription: (taskId: string, description: string) =>
    apiPatch(`/tasks/${taskId}/description`, {
      description,
    }),

  getByPhase: (phaseId: string) =>
    apiGet(`/tasks/phase/${phaseId}`),

  // ✅ FIXED
  update: (id: string, data: any) =>
  apiPut(`/tasks/${id}`, data), // or apiPut if you have it

  // ✅ FIXED
  delete: (id: string) =>
    apiDelete(`/tasks/${id}`),
};