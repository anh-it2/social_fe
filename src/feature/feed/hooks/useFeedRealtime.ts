"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getFeedSocket } from "../socket";
import {
  POSTS_QUERY_PREFIX,
  POST_COMMENTS_PREFIX,
} from "../data/usePostMutations";

/**
 * Listens on the /feed namespace and refetches the server-ordered feed when
 * anyone else posts/edits/deletes. The payload is just an id (the BE owns
 * ordering + content), so every event collapses to one cache invalidation —
 * which refreshes both the global feed and the per-user list. Mounted once
 * globally (SocketProvider). Listeners survive socket reconnects (stable
 * namespace socket instance).
 */
export function useFeedRealtime() {
  const queryClient = useQueryClient();
  const isLoggined = useAuthStore((s) => s.isLoggined);

  useEffect(() => {
    if (!isLoggined) return;
    const socket = getFeedSocket();
    const refresh = () => {
      // A feed change can be a new/edited post OR a reaction/comment on an
      // existing one — refresh both the feed and any open comment list.
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_PREFIX });
      queryClient.invalidateQueries({ queryKey: POST_COMMENTS_PREFIX });
    };

    socket.on("feed:new", refresh);
    socket.on("feed:update", refresh);
    socket.on("feed:remove", refresh);
    return () => {
      socket.off("feed:new", refresh);
      socket.off("feed:update", refresh);
      socket.off("feed:remove", refresh);
    };
  }, [queryClient, isLoggined]);
}
