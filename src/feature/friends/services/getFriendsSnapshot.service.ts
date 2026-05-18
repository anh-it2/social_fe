import { apiClient } from "@/shared/lib/apiClient";
import type {
  FriendsSnapshotDTO,
  FriendsSnapshotResponseDTO,
} from "../dto/friends.api.dto";

/** Loads my friends + incoming + outgoing requests (server-backed). */
export async function getFriendsSnapshotService(): Promise<FriendsSnapshotDTO> {
  const res =
    await apiClient.get<FriendsSnapshotResponseDTO>("/api/friends");
  return res.data.snapshot;
}
