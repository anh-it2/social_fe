import { useMutation } from "@tanstack/react-query";
import { toAuthSession, toLoginRequestDto } from "../dto/auth.mapper";
import { loginService } from "../services/login.service";
import { useAuthStore } from "../stores/auth.store";
import { LoginCredentials } from "../types";

/**
 * Login mutation. The JWT is set as an httpOnly cookie by the route
 * handler; here we only persist the returned public user for the UI.
 * Navigation / toasts stay in the component.
 */
export function useLogin() {
  const saveLoginnedUser = useAuthStore((s) => s.saveLoginnedUser);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginService(toLoginRequestDto(credentials)),
    onSuccess: (res) => {
      const { user } = toAuthSession(res);
      saveLoginnedUser({
        userId: user.id,
        userName: user.name,
        email: user.email,
        role: user.role,
      });
    },
  });
}
