import { API_URL } from "./config";

export async function apiGet(url: string) {
  const res = await fetch(`${API_URL}${url}`);
  return res.json();
}

export async function apiPost(url: string, body?: any) {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}

export async function apiPatch(url: string, body?: any) {
  const res = await fetch(`${API_URL}${url}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}

export const apiDelete = async (url: string) => {
  const res = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
  });

  return res.json();
};

export const apiPut = async (url: string, data: any) => {
  const res = await fetch(`${API_URL}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
