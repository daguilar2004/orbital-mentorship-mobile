const API_URL = process.env.EXPO_PUBLIC_APP_SERVER_URL;

export const getAllAccountability = async (token: string) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const response = await fetch(`${API_URL}/api/accountability`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch accountability data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching accountability data:", error);
    throw error;
  }
};

export const createHabit = async (
  token: string,
  body: Record<string, any>
) => {
  try {
    if (!token || !body) {
      throw new Error("Token and body are required");
    }

    const response = await fetch(`${API_URL}/api/accountability/habits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create habit");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
};

export const createGoal = async (
  token: string,
  body: Record<string, any>
) => {
  try {
    if (!token || !body) {
      throw new Error("Token and body are required");
    }

    const response = await fetch(`${API_URL}/api/accountability/goals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create goal");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
};

export const updateAccountabilityItem = async (
  itemId: string,
  itemData: Record<string, any>,
  token: string
) => {
  try {
    if (!itemId || !token || !itemData) {
      throw new Error("Item ID, token, and item data are required");
    }

    const response = await fetch(`${API_URL}/api/accountability/${itemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error("Failed to update accountability item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating accountability item:", error);
    throw error;
  }
};

export const deleteAccountabilityItem = async (
  itemId: string,
  token: string
) => {
  try {
    if (!itemId || !token) {
      throw new Error("Item ID and token are required");
    }

    const response = await fetch(`${API_URL}/api/accountability/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete accountability item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting accountability item:", error);
    throw error;
  }
};

export const toggleDailyHabitCompletion = async (
  itemId: string,
  date: string,
  token: string
) => {
  try {
    if (!itemId || !date || !token) {
      throw new Error("Item ID, date, and token are required");
    }

    const response = await fetch(
      `${API_URL}/api/accountability/${itemId}/toggle-daily`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle daily habit completion");
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling daily habit completion:", error);
    throw error;
  }
};

export const toggleGoalCompletion = async (
  itemId: string,
  token: string
) => {
  try {
    if (!itemId || !token) {
      throw new Error("Item ID and token are required");
    }

    const response = await fetch(
      `${API_URL}/api/accountability/${itemId}/toggle-goal`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle goal completion");
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling goal completion:", error);
    throw error;
  }
};