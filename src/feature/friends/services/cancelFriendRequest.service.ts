import { apiClient } from "@/shared/lib/apiClient";

/** Cancel a request I previously sent to `userId`. */
export async function cancelFriendRequestService(
  userId: string,
): Promise<void> {
  await apiClient.delete(`/api/friends/requests/${encodeURIComponent(userId)}`);
}
