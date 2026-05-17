import { useMutation } from "@tanstack/react-query";
import { toAuthSession, toRegisterRequestDto } from "../dto/auth.mapper";
import { registerService } from "../services/register.service";
import { useAuthStore } from "../stores/auth.store";
import { RegisterCredentials } from "../types";

/**
 * Register mutation. Backend creates the user and immediately issues a
 * token (set as httpOnly cookie by the route handler), so registration
 * also logs the user in.
 */
export function useRegister() {
  const saveLoginnedUser = useAuthStore((s) => s.saveLoginnedUser);

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      registerService(toRegisterRequestDto(credentials)),
    onSuccess: (res) => {
      const { user } = toAuthSession(res);
      saveLoginnedUser({
        userId: user.id,
        userName: user.name,
        email: user.email,
      });
    },
  });
}
