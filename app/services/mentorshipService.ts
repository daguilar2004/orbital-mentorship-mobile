import {
  API_ENDPOINTS,
  apiDeleteWithOptions,
  apiGetWithOptions,
  apiPatchWithOptions,
  apiPostWithOptions,
} from "./api";

export interface MentorshipData {
  _id: string;
  menteeId: string;
  mentorId: string;
  streamChatChannelId?: string;
  phases: string[];
  tasks: string[];
  resources: string[];
  meetings: string[];
  trialPeriod: boolean;
  moduleProgress: ModuleProgress[];
  createdAt: string;
  updatedAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  role: "mentor" | "mentee";
  moduleOrder: number;
  levels: Level[];
  xpEarned: number;
  completedAt?: Date;
  availableAt?: Date;
}

export interface Level {
  levelOrder: number;
  responses: Response[];
  completedAt?: Date;
  availableAt?: Date;
}

export interface Response {
  prompt: string;
  response: string;
}

/**
 * Fetch mentorship data by ID
 */
export async function fetchMentorship(
  mentorshipId: string,
  options?: RequestInit
) {
  return apiGetWithOptions<MentorshipData>(
    API_ENDPOINTS.MENTORSHIP_BY_ID(mentorshipId),
    options
  );
}

/**
 * Create a new mentorship
 */
export async function createMentorship(data: {
  menteeId: string;
  mentorId: string;
}, options?: RequestInit) {
  return apiPostWithOptions<MentorshipData>(
    API_ENDPOINTS.MENTORSHIPS,
    data,
    options
  );
}

/**
 * Update mentorship (e.g., add phases, tasks)
 */
export async function updateMentorship(
  mentorshipId: string,
  data: Partial<MentorshipData>,
  options?: RequestInit
) {
  return apiPatchWithOptions<MentorshipData>(
    API_ENDPOINTS.MENTORSHIP_BY_ID(mentorshipId),
    data,
    options
  );
}

/**
 * Delete mentorship
 */
export async function deleteMentorship(
  mentorshipId: string,
  options?: RequestInit
) {
  return apiDeleteWithOptions(API_ENDPOINTS.MENTORSHIP_BY_ID(mentorshipId), options);
}

/**
 * Seed mentorship data (for testing)
 */
export async function seedMentorship(options?: RequestInit) {
  return apiPostWithOptions<MentorshipData>(
    `${API_ENDPOINTS.MENTORSHIPS}/seed`,
    {},
    options
  );
}
