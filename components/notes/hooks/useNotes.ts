import { useState } from "react";
import { Alert } from "react-native";
import { API_BASE_URL } from "@/app/api/index";
import { MOCK_AUTH_TOKEN } from "@/app/config/mockAuth";
import { defaultFormatting } from "../constants";
import { Note } from "../types";
import { getLabels, getNoteId } from "../utils";

async function getHeadersWithAuth() {
  const token = MOCK_AUTH_TOKEN;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}


export function useNotes(userId: string, userRole: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeadersWithAuth();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`${API_BASE_URL}/notes/${userId}`, {
        method: "GET",
        headers,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) throw new Error("Failed to load notes");

      const data = await response.json();
      const parsed = data.map((note: any) => ({
        ...note,
        id: note._id,
        text: note.text ?? "",
        formatting: note.formatting ?? defaultFormatting,
      }));
      setNotes(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load notes";
      setError(msg);
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (noteData: Note, action: "create" | "update") => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeadersWithAuth();
      const payload = {
        type: noteData.type,
        title: noteData.title,
        text: noteData.text,
        formatting: noteData.formatting,
      };

      let response;
      if (action === "create") {
        response = await fetch(`${API_BASE_URL}/notes/${userId}`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        const noteId = getNoteId(noteData);
        response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Failed to ${action} note (${response.status} ${response.statusText})${errorText ? `: ${errorText}` : ""}`
        );
      }

      const savedNote = await response.json();
      await loadData();
      return savedNote;
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to ${action} note`;
      setError(msg);
      Alert.alert("Error", msg);
      console.error(`Failed to ${action} note:`, err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const headers = await getHeadersWithAuth();
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Failed to delete note (${response.status} ${response.statusText})${errorText ? `: ${errorText}` : ""}`
        );
      }

      setNotes((prev) => prev.filter((n) => getNoteId(n) !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
      Alert.alert("Error", "Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  const deleteSelected = async (selectedIds: Set<string>) => {
    if (!userId) return;
    setLoading(true);
    try {
      const headers = await getHeadersWithAuth();
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`${API_BASE_URL}/notes/${id}`, { method: "DELETE", headers })
        )
      );
      setNotes((prev) => prev.filter((n) => !selectedIds.has(getNoteId(n))));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete notes");
      Alert.alert("Error", "Failed to delete selected notes");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    const currentNote = notes.find((n) => getNoteId(n) === id);
    if (!currentNote) return;

    const newFavorite = !currentNote.favorite;
    setNotes((prev) =>
      prev.map((n) => (getNoteId(n) === id ? { ...n, favorite: newFavorite } : n))
    );

    try {
      const headers = await getHeadersWithAuth();
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ favorite: newFavorite }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Failed to update favorite (${response.status} ${response.statusText})${errorText ? `: ${errorText}` : ""}`
        );
      }
    } catch (err) {
      setNotes((prev) =>
        prev.map((n) => (getNoteId(n) === id ? { ...n, favorite: !newFavorite } : n))
      );
      Alert.alert("Error", "Failed to update favorite status");
      console.error("Failed to update favorite:", err);
    }
  };

  return {
    notes,
    setNotes,
    loading,
    error,
    setError,
    loadData,
    saveNote,
    deleteNote,
    deleteSelected,
    toggleFavorite,
  };
}
