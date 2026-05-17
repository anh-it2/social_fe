import axios from "axios";

/**
 * Talks only to this Next server's route handlers (same origin, relative
 * URLs like /api/auth/login). `withCredentials` keeps the httpOnly auth
 * cookie flowing on every request.
 *
 * The response interceptor normalizes failures into a plain Error whose
 * message is the backend's human-readable text, so callers (and TanStack
 * Query) always surface a usable message.
 */
export const apiClient = axios.create({
  withCredentials: true,
  headers: { "content-type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      (axios.isAxiosError(error) &&
        (error.response?.data as { message?: string } | undefined)?.message) ||
      (error instanceof Error ? error.message : "Request failed");
    return Promise.reject(new Error(message));
  },
);
