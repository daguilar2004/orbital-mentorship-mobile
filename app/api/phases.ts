import { API_URL } from "./config";

export const PhaseAPI = {
  async create(data: {
    mentorshipId: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }) {
    const res = await fetch(`${API_URL}/phases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async getByMentorship(mentorshipId: string) {
    const res = await fetch(
      `${API_URL}/phases/mentorship/${mentorshipId}`,
    );

    return res.json();
  },

  // ✅ ADD THIS
  async update(
    id: string,
    data: {
      name: string;
      startDate: string;
      endDate: string;
    },
  ) {
    const res = await fetch(`${API_URL}/phases/${id}`, {
      method: "PUT", // or PATCH depending on backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },
  async remove(id: string) {
  const res = await fetch(`${API_URL}/phases/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete phase");
  }

  return res.json();
}
};