interface UploadTokenResponse {
  token?: string;
  apiBaseUrl?: string;
  message?: string;
}

interface BackendUploadResponse {
  success?: boolean;
  data?: {
    url?: string;
  };
  message?: string;
}

/**
 * Upload directly to the backend instead of relaying the file through a
 * Next/Vercel route. Vercel rejects large function request bodies before the
 * backend's Multer limit is reached, which surfaces as HTTP 413.
 */
export async function uploadPostMediaService(file: File): Promise<string> {
  const tokenResponse = await fetch("/api/socket-token", {
    credentials: "include",
    cache: "no-store",
  });
  const tokenBody = (await tokenResponse.json().catch(() => ({}))) as
    UploadTokenResponse;

  if (!tokenResponse.ok || !tokenBody.token || !tokenBody.apiBaseUrl) {
    throw new Error(tokenBody.message || "Không thể xác thực tải tệp");
  }

  const form = new FormData();
  form.append("file", file, file.name);

  const response = await fetch(
    `${tokenBody.apiBaseUrl.replace(/\/$/, "")}/posts/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenBody.token}`,
      },
      body: form,
    },
  );
  const body = (await response.json().catch(() => ({}))) as BackendUploadResponse;
  const url = body.data?.url;

  if (!response.ok || !url) {
    throw new Error(body.message || "Tải tệp lên thất bại");
  }

  return url;
}
