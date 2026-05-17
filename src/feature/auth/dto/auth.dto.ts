// Wire shapes between the browser and the Next route handlers
// (/api/auth/*). The route handler proxies social-platform-be and strips
// the token into an httpOnly cookie, so the token never crosses this DTO.

// ─── client → route handler ────────────────────────────────────────

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
}

// ─── route handler → client ────────────────────────────────────────

export interface PublicUserDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponseDTO {
  user: PublicUserDTO;
}

/** Non-2xx body returned by the route handlers. */
export interface AuthErrorDTO {
  message: string;
}
