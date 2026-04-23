import { API_ENDPOINTS } from "./api";
import {
  apiDeleteWithOptions,
  apiGetWithOptions,
  apiPatchWithOptions,
  apiPostWithOptions,
} from "./api";
import { TaskResponse } from "./taskService";

export interface PhaseResponse {
  _id: string;
  name: string;
  status: "current" | "completed" | "upcoming";
  startDate: string;
  endDate: string;
  tasks: TaskResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PhaseCreateData {
  name: string;
  startDate: string;
  endDate: string;
}

export interface PhaseUpdateData {
  name?: string;
  status?: "current" | "completed" | "upcoming";
  startDate?: string;
  endDate?: string;
}

export async function fetchPhase(phaseId: string, options?: RequestInit) {
  return apiGetWithOptions<PhaseResponse>(
    `${API_ENDPOINTS.PHASES}/${phaseId}`,
    options
  );
}

export async function fetchPhasesByMentorship(
  mentorshipId: string,
  options?: RequestInit
) {
  return apiGetWithOptions<PhaseResponse[]>(
    `${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/phases`,
    options
  );
}

export async function createPhase(
  mentorshipId: string,
  data: PhaseCreateData,
  options?: RequestInit
) {
  return apiPostWithOptions<PhaseResponse>(
    `${API_ENDPOINTS.MENTORSHIPS}/${mentorshipId}/phases`,
    data,
    options
  );
}

export async function updatePhase(
  phaseId: string,
  data: PhaseUpdateData,
  options?: RequestInit
) {
  return apiPatchWithOptions<PhaseResponse>(
    `${API_ENDPOINTS.PHASES}/${phaseId}`,
    data,
    options
  );
}

export async function deletePhase(phaseId: string, options?: RequestInit) {
  return apiDeleteWithOptions<{ success: boolean }>(
    `${API_ENDPOINTS.PHASES}/${phaseId}`,
    options
  );
}
