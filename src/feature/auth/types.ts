// Domain models. The JWT lives in an httpOnly cookie set by the Next
// route handlers — it is intentionally NOT part of any client-side model.

export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
}

export interface AuthState {
  userId: string;
  userName: string;
  email: string;
  role: UserRole;
  isLoggined: boolean;
  saveLoginnedUser: (user: {
    userId: string;
    userName: string;
    email: string;
    role?: UserRole;
  }) => void;
  removeLogginedUser: () => void;
}
