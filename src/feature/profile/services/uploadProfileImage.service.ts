import { apiClient } from "@/shared/lib/apiClient";

type ProfileImageKind = "avatar" | "cover";

interface ProfileImageResponse {
  url: string;
}

export async function uploadProfileImageService(
  kind: ProfileImageKind,
  file: File,
): Promise<string> {
  const form = new FormData();
  form.append("file", file, file.name);

  const res = await apiClient.patch<ProfileImageResponse>(
    `/api/profile/${kind}`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data.url;
}
