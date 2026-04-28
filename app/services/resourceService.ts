import { API_ENDPOINTS, apiPost, apiDelete } from "./api";

export interface ResourceResponse {
  _id: string;
  type: "link" | "file";
  value: string;
  label?: string;
  fileInfo?: {
    name: string;
    size: number;
    uri: string;
    mimeType?: string;
  };
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface ResourceCreateData {
  type: "link" | "file";
  value: string;
  label?: string;
  fileInfo?: {
    name: string;
    size: number;
    mimeType?: string;
  };
}

/**
 * Upload a file resource to the backend
 * For web, convert file to base64/data URL before sending
 * @param file File object from input
 * @param taskId Optional task ID to associate with resource
 * @returns Promise with uploaded resource data
 */
export async function uploadFileResource(
  file: File,
  taskId?: string,
  label?: string
) {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);

    const data: ResourceCreateData = {
      type: "file",
      value: base64,
      label: label || file.name,
      fileInfo: {
        name: file.name,
        size: file.size,
        mimeType: file.type,
      },
    };

    // If taskId provided, upload to task-specific endpoint
    if (taskId) {
      return apiPost<ResourceResponse>(
        `${API_ENDPOINTS.TASKS}/${taskId}/resources`,
        data
      );
    }

    // Otherwise upload to general resources endpoint
    return apiPost<ResourceResponse>(`${API_ENDPOINTS.RESOURCES}`, data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Upload failed";
    return {
      success: false,
      error: errorMessage,
      data: undefined,
    };
  }
}

/**
 * Upload a link resource to the backend
 * @param url URL of the resource
 * @param label Optional label/title for the resource
 * @param taskId Optional task ID to associate with resource
 */
export async function uploadLinkResource(
  url: string,
  label?: string,
  taskId?: string
) {
  const data: ResourceCreateData = {
    type: "link",
    value: url,
    label: label || url,
  };

  if (taskId) {
    return apiPost<ResourceResponse>(
      `${API_ENDPOINTS.TASKS}/${taskId}/resources`,
      data
    );
  }

  return apiPost<ResourceResponse>(`${API_ENDPOINTS.RESOURCES}`, data);
}

/**
 * Delete a resource from the backend
 * @param resourceId ID of the resource to delete
 */
export async function deleteResource(resourceId: string) {
  return apiDelete<{ success: boolean }>(
    `${API_ENDPOINTS.RESOURCES}/${resourceId}`
  );
}

/**
 * Convert File object to base64 string
 * @param file File object
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(file);
  });
}
