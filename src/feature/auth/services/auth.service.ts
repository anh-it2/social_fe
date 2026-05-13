import {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from "../dto/auth.dto";

// TODO: replace with real API call once the backend is ready.
// For now this fakes a network round-trip with a short delay and
// always resolves with a 200 response.
export async function login(
  dto: LoginRequestDTO,
): Promise<LoginResponseDTO> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    status: 200,
    message: "OK",
    data: {
      userId: `user_${dto.username.trim().toLowerCase()}`,
      username: dto.username,
      token: "fake-jwt-token",
    },
  };
}

export async function register(
  dto: RegisterRequestDTO,
): Promise<RegisterResponseDTO> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    status: 200,
    message: "OK",
    data: {
      userId: `user_${dto.username.trim().toLowerCase()}`,
      username: dto.username,
      token: "fake-jwt-token",
    },
  };
}
