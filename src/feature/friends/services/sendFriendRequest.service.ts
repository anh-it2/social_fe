import { apiClient } from "@/shared/lib/apiClient";

/** Send a friend request to `userId`. */
export async function sendFriendRequestService(userId: string): Promise<void> {
  await apiClient.post(`/api/friends/requests/${encodeURIComponent(userId)}`);
}
