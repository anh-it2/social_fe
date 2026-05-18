import type { FriendsService } from "./friends.port";
import { friendsApi } from "./friends.api";

/**
 * SINGLE BACKEND SWAP POINT.
 *
 * Now wired to the real REST backend (social-platform-be /friends*) via
 * friends.api.ts. The mock (./friends.mock) is kept for offline/dev — swap
 * this line back to `friendsMock` to use it. No UI/hook/store changes.
 */
export const friendsService: FriendsService = friendsApi;

export type { FriendsService } from "./friends.port";
