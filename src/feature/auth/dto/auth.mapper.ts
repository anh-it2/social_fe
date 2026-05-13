import { AuthSession, LoginCredentials, RegisterCredentials } from "../types";
import {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from "./auth.dto";

// ─── Client → Server (Model → DTO) ─────────────────────────────────

export function toLoginRequestDto(
  credentials: LoginCredentials,
): LoginRequestDTO {
  return {
    username: credentials.username,
    password: credentials.password,
  };
}

export function toRegisterRequestDto(
  credentials: RegisterCredentials,
): RegisterRequestDTO {
  return {
    fullName: credentials.fullName,
    email: credentials.email,
    username: credentials.username,
    password: credentials.password,
  };
}

// ─── Server → Client (DTO → Model) ─────────────────────────────────

export function toAuthSession(
  dto: LoginResponseDTO | RegisterResponseDTO,
): AuthSession | null {
  if (!dto.data) return null;
  return {
    userId: dto.data.userId,
    username: dto.data.username,
    token: dto.data.token,
  };
}
