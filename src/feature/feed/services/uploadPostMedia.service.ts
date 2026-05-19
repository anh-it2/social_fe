import { apiClient } from "@/shared/lib/apiClient";
import type { UploadResponseDTO } from "../dto/post.dto";

/**
 * Uploads one image/video to the BE and resolves with its public URL.
 * apiClient defaults Content-Type to application/json; clear it for this
 * call so the browser sets `multipart/form-data` *with the boundary*
 * (a hardcoded value without the boundary makes the server fail to parse).
 */
export async function uploadPostMediaService(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post<UploadResponseDTO>(
    "/api/posts/upload",
    form,
    { headers: { "content-type": undefined } },
  );
  return res.data.url;
}
