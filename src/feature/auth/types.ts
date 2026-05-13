export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthSession {
  userId: string;
  username: string;
  token: string;
}

export interface AuthState{
  userId: string;
  userName: string;
  isLoggined: boolean;
  saveLoginnedUser: (user: { userName: string; userId: string }) => void;
  removeLogginedUser: () => void;
}