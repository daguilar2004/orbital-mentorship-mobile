import { apiGet } from "./api";

export const MenteeAPI = {
  getXp: (menteeId: string) => apiGet(`/mentees/${menteeId}/xp`),
};
