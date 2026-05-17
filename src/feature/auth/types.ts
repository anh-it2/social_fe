// Domain models. The JWT lives in an httpOnly cookie set by the Next
// route handlers — it is intentionally NOT part of any client-side model.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
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
  isLoggined: boolean;
  saveLoginnedUser: (user: {
    userId: string;
    userName: string;
    email: string;
  }) => void;
  removeLogginedUser: () => void;
}
