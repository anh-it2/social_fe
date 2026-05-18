import { apiClient } from "@/shared/lib/apiClient";

/** Reject the incoming request from `userId`. */
export async function rejectFriendRequestService(
  userId: string,
): Promise<void> {
  await apiClient.post(
    `/api/friends/requests/${encodeURIComponent(userId)}/reject`,
  );
}
