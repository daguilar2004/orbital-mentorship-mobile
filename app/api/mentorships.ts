import { apiGet } from "./api";

export const MentorshipAPI = {
  getById: (mentorshipId: string) => apiGet(`/mentorships/${mentorshipId}`),
};
