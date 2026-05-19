"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostService } from "../services/createPost.service";
import { updatePostService } from "../services/updatePost.service";
import { deletePostService } from "../services/deletePost.service";
import { pinPostService } from "../services/pinPost.service";
import {
  reactPostService,
  unreactPostService,
} from "../services/reactPost.service";
import { addPostCommentService } from "../services/addPostComment.service";
import {
  toCreatePostBody,
  toUpdatePostBody,
} from "../dto/post.mapper";
import {
  emitFeedPublish,
  emitFeedRemove,
  emitFeedUpdate,
} from "../lib/feedEmit";
import type { CreateCommentBody } from "../dto/post.dto";
import type { FeedPostData } from "./types";

// Both the global feed (["posts","feed"]) and the per-user list
// (["posts","mine"]) live under this prefix; invalidate it after any write
// so every surface (CenterFeed, profile, photos, stats) reconciles.
export const POSTS_QUERY_PREFIX = ["posts"] as const;
export const POSTS_FEED_KEY = ["posts", "feed"] as const;
export const POSTS_MINE_KEY = ["posts", "mine"] as const;
// Per-post comment lists: ["post-comments", postId].
export const POST_COMMENTS_PREFIX = ["post-comments"] as const;
export const postCommentsKey = (postId: string) =>
  ["post-comments", postId] as const;

/**
 * Shared post write-ops, backed by social-platform-be. Returned fns resolve
 * with the persisted post (or removed id) so callers can do persist-then-
 * announce (await the DB write, then emit the realtime event / toast). They
 * are also safe to call fire-and-forget.
 */
export function usePostMutations() {
  const queryClient = useQueryClient();
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: POSTS_QUERY_PREFIX }),
    [queryClient],
  );

  // persist-then-announce: the mutation already resolved (DB write done) —
  // refresh our caches, then best-effort tell other clients to refetch.
  const create = useMutation({
    mutationFn: createPostService,
    onSuccess: (post) => {
      invalidate();
      emitFeedPublish(post.id);
    },
  });
  const update = useMutation({
    mutationFn: updatePostService,
    onSuccess: (post) => {
      invalidate();
      emitFeedUpdate(post.id);
    },
  });
  const remove = useMutation({
    mutationFn: deletePostService,
    onSuccess: (id) => {
      invalidate();
      emitFeedRemove(id);
    },
  });
  const pin = useMutation({
    mutationFn: pinPostService,
    onSuccess: (post) => {
      invalidate();
      emitFeedUpdate(post.id);
    },
  });

  // Reactions/comments change the post's counts → invalidate the feed
  // (so PostStats refreshes) and announce so others refetch. Comment adds
  // also bust that post's comment-list query.
  const react = useMutation({
    mutationFn: reactPostService,
    onSuccess: (post) => {
      invalidate();
      emitFeedUpdate(post.id);
    },
  });
  const unreact = useMutation({
    mutationFn: unreactPostService,
    onSuccess: (post) => {
      invalidate();
      emitFeedUpdate(post.id);
    },
  });
  const comment = useMutation({
    mutationFn: addPostCommentService,
    // The FE Comment shape has no postId; take it from the call variables.
    onSuccess: (_created, variables) => {
      invalidate();
      queryClient.invalidateQueries({
        queryKey: postCommentsKey(variables.id),
      });
      emitFeedUpdate(variables.id);
    },
  });

  const addPost = useCallback(
    (post: FeedPostData) => create.mutateAsync(toCreatePostBody(post)),
    [create],
  );
  const updatePost = useCallback(
    (post: FeedPostData) =>
      update.mutateAsync({ id: post.id, body: toUpdatePostBody(post) }),
    [update],
  );
  const removePost = useCallback(
    (id: string) => remove.mutateAsync(id),
    [remove],
  );
  const pinPost = useCallback(
    (id: string, pinned: boolean) => pin.mutateAsync({ id, pinned }),
    [pin],
  );
  // emoji=null → clear my reaction; otherwise set/replace it.
  const reactPost = useCallback(
    (id: string, emoji: string | null) =>
      emoji === null
        ? unreact.mutateAsync(id)
        : react.mutateAsync({ id, emoji }),
    [react, unreact],
  );
  const addComment = useCallback(
    (id: string, body: CreateCommentBody) =>
      comment.mutateAsync({ id, body }),
    [comment],
  );

  return {
    addPost,
    updatePost,
    removePost,
    pinPost,
    reactPost,
    addComment,
  };
}
