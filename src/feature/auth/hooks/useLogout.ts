import { useMutation } from "@tanstack/react-query";
import { logoutService } from "../services/logout.service";
import { useAuthStore } from "../stores/auth.store";

/** Logout mutation: clears the httpOnly cookie (server) + local session. */
export function useLogout() {
  const removeLogginedUser = useAuthStore((s) => s.removeLogginedUser);

  return useMutation({
    mutationFn: logoutService,
    onSuccess: () => removeLogginedUser(),
  });
}
