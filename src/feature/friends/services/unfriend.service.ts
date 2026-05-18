import { apiClient } from "@/shared/lib/apiClient";

/** Remove an existing friendship with `userId`. */
export async function unfriendService(userId: string): Promise<void> {
  await apiClient.delete(`/api/friends/${encodeURIComponent(userId)}`);
}
