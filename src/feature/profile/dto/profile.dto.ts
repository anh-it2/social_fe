// Wire shape between the browser and the Next route handler
// (/api/profile), which proxies social-platform-be GET/PATCH
// /users/me/profile. Field-identical to EditProfileValues so the
// edit-profile form maps 1:1 with no translation.

export interface ProfileDTO {
  name: string;
  bio: string;
  location: string;
  work: string;
  education: string;
  relationship: string;
  avatarUrl: string;
  coverUrl: string;
}

export interface ProfileResponseDTO {
  profile: ProfileDTO;
}

/** Non-2xx body returned by the route handler. */
export interface ProfileErrorDTO {
  message: string;
}

// Public (non-self) user — social-platform-be GET /users/:id → PublicUser.
// Used to resolve another person's display name when viewing their profile
// and they aren't already in the friends store.
export interface PublicUserDTO {
  id: string;
  name: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  location: string;
  work: string;
  education: string;
  relationship: string;
  friends: PublicProfileFriendDTO[];
  stats: PublicProfileStatsDTO;
}

export interface PublicProfileFriendDTO {
  id: string;
  name: string;
  avatarUrl?: string | null;
  location?: string;
}

export interface PublicProfileStatsDTO {
  posts: number;
  friends: number;
  photos: number;
  videos: number;
  likes: number;
}

export interface PublicUserResponseDTO {
  user: PublicUserDTO;
}
