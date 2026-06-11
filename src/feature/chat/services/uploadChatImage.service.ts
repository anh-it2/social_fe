interface ChatImageUploadResponse {
  url?: string;
  message?: string;
}

export async function uploadChatImageService(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file, file.name);

  const response = await fetch("/api/chat/upload", {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const body = (await response.json().catch(() => ({}))) as ChatImageUploadResponse;

  if (!response.ok || !body.url) {
    throw new Error(body.message || "Image upload failed");
  }

  return body.url;
}
