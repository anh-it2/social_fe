import { apiClient } from "@/shared/lib/apiClient";
import { AuthResponseDTO, RegisterRequestDTO } from "../dto/auth.dto";

export async function registerService(
  dto: RegisterRequestDTO,
): Promise<AuthResponseDTO> {
  const { data } = await apiClient.post<AuthResponseDTO>(
    "/api/auth/register",
    dto,
  );
  return data;
}
