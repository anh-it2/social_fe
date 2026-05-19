import { apiClient } from "@/shared/lib/apiClient";

/** Deletes an owned post. Resolves with the removed id. */
export async function deletePostService(id: string): Promise<string> {
  await apiClient.delete<{ id: string }>(
    `/api/posts/${encodeURIComponent(id)}`,
  );
  return id;
}
