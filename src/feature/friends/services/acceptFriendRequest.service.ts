import { apiClient } from "@/shared/lib/apiClient";

/** Accept the incoming request from `userId` → become friends. */
export async function acceptFriendRequestService(
  userId: string,
): Promise<void> {
  await apiClient.post(
    `/api/friends/requests/${encodeURIComponent(userId)}/accept`,
  );
}
