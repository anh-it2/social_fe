import { AuthSession, LoginCredentials, RegisterCredentials } from "../types";
import {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
} from "./auth.dto";

// ─── Client → Server (Model → DTO) ─────────────────────────────────

export function toLoginRequestDto(
  credentials: LoginCredentials,
): LoginRequestDTO {
  return {
    email: credentials.email,
    password: credentials.password,
  };
}

export function toRegisterRequestDto(
  credentials: RegisterCredentials,
): RegisterRequestDTO {
  return {
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  };
}

// ─── Server → Client (DTO → Model) ─────────────────────────────────

export function toAuthSession(dto: AuthResponseDTO): AuthSession {
  return {
    user: {
      id: dto.user.id,
      name: dto.user.name,
      email: dto.user.email,
      createdAt: dto.user.createdAt,
    },
  };
}
