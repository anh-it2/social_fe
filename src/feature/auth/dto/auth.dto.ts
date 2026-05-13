// client send to server

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface RegisterRequestDTO {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

// server send to client

export interface LoginResponseDTO {
  status: number;
  message: string;
  data?: {
    userId: string;
    username: string;
    token: string;
  };
}

export interface RegisterResponseDTO {
  status: number;
  message: string;
  data?: {
    userId: string;
    username: string;
    token: string;
  };
}
