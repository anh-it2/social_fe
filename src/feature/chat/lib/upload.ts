// Inline base64 over socket. Heavy payload but works cross-device without storage.
// TODO: swap to real upload — POST FormData to /api/chat/upload, server stores
// in MinIO/S3, returns public URL. Replace this helper, keep callsites.
export async function uploadChatImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const CHAT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
