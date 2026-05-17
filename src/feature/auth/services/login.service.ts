import { apiClient } from "@/shared/lib/apiClient";
import { AuthResponseDTO, LoginRequestDTO } from "../dto/auth.dto";

export async function loginService(
  dto: LoginRequestDTO,
): Promise<AuthResponseDTO> {
  const { data } = await apiClient.post<AuthResponseDTO>(
    "/api/auth/login",
    dto,
  );
  return data;
}
