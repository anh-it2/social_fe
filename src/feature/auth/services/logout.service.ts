import { apiClient } from "@/shared/lib/apiClient";

export async function logoutService(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}
