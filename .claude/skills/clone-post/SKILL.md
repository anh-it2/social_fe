---
name: clone-post
description: Architecture + rebuild guide for this project's feed POST feature — creating/uploading/editing/deleting/pinning posts, the global feed, media upload, and realtime feed fan-out (Next.js client + social-platform-be REST + Socket.IO relay). Use when working on posts, the composer, the feed, post media upload, post edit/delete/pin, OR when extending posts (real reactions/comments, pagination, profile-of-other-user feed). Triggers on "post feature", "create post", "upload post", "post feed", "rebuild posts", "persist posts", "post DB", "/clone-post".
---

# clone-post — Feed posts: how it works + how to extend it

Verified against the live implementation across all three repos (read in full):
`project_III/src/feature/feed/`, `social-platform-be/src/modules/post/`,
`social-socket-server/src/feature/feed/`. Posts were migrated from
localStorage+mock to a real DB-backed feature; this documents the result and
the seams left for the next iteration. Sister skills: `clone-api` (the REST
binding rules this follows exactly), `clone-notification` / `clone-chat`
(same socket server, same cookie-JWT auth, same namespace model).

Three codebases:

- **Client**: `project_III/` — Next.js 16 + React 19, TanStack Query, axios,
  Socket.IO client. Posts under `src/feature/feed/`.
- **REST backend**: `social-platform-be/` — Express + Prisma + Postgres,
  port `8080`, all under `/api/v1`. Posts module `src/modules/post/`.
  **Source of truth.**
- **Socket server**: `social-socket-server/` — Socket.IO, port `3002`,
  `tsx watch`. Feed namespace `src/feature/feed/`. **Relay only — never
  touches the DB.**

REST owns persistence; the socket is a best-effort fan-out (persist-then-
announce, clone-api §7). No post data ever lives in localStorage anymore.

---

## 1. Data model (`social-platform-be/prisma/schema.prisma`, model `Post`)

`Post`: `id`, `authorId` (→User, `onDelete: Cascade`), `text @default("")`,
`imageUrl?`, `videoUrl?`, `feeling Json?`, `isLive`, seven per-reaction
counters `like|love|care|haha|wow|sad|angryCount Int @default(0)`,
`commentsCount`, `sharesCount`, `sharedFrom Json?`, `pinnedAt DateTime?`,
`createdAt`, `updatedAt`. Indexes: `[createdAt]`, `[authorId, createdAt]`.

`PostReaction`: `@@id([postId,userId])` (one reaction/user/post; re-react
upserts/swaps emoji), `emoji` (FE ReactionId), cascade w/ Post+User —
**source of truth**; the Post `<kind>Count` columns are denormalized totals
kept in lock-step in the SAME `$transaction` as the row write, so the feed
read needs zero aggregation. `PostComment`: `id`, `postId`, `authorId`,
`text @default("")`, `imageUrl?`, `createdAt`; `Post.commentsCount` bumped
in the same `$transaction` as the insert. Both `@@index([postId,...])`.

Deliberate shape decisions (do not "fix" without re-deciding):
- **`feeling` / `sharedFrom` are JSON snapshots**, not relations. The FE
  shapes (`Feeling = {id,emoji,label,kind}`, `SharedPostRef` = a frozen copy
  of the reshared post) are display-only, never queried by field.
- **Reactions & comments are now REAL** (relational, persisted, realtime).
  The seven `<kind>Count` columns are denormalized totals maintained
  transactionally from `PostReaction`; the FE `likes` label = their sum.
  `PostDTO.myReaction` = the requesting viewer's own reaction (per-viewer
  `reactions: { where:{userId:viewer} }` include). `commentsCount` is the
  authoritative comment total. Reacting/commenting is allowed for **any**
  authed user (NOT owner-gated — only existence checked).
- **author name/avatar are read live** via `include: { author: { select:
  { id, name, profile: { select: { avatarUrl } } } } }` — NOT denormalized
  onto Post. Rename / avatar change reflects on all past posts, no backfill.

`PostDTO` (wire, `post.model.ts` `toPostDTO`): `id`, `authorId`,
`authorName`, `authorAvatarUrl`, `text`, `imageUrl|videoUrl` (string|null),
`feeling` (obj|null), `isLive`, `reactions{7}`, **`myReaction` (string|null)**,
`commentsCount`, `sharesCount`, `sharedFrom` (obj|null), `pinnedAt` (ms|null),
`createdAt` (ms). `CommentDTO`: `id`, `postId`, `authorId`, `authorName`,
`authorAvatarUrl`, `text`, `imageUrl` (string|null), `createdAt` (ms). The
server is presentation-agnostic: initial, gradient, relative-time are **all**
computed client-side in the mapper.

**Model module is split** (one store per file, all share `post.shared.ts` =
`AUTHOR_SELECT` / `postInclude(viewerId)` / `PostRow` / `jsonWrite`):
`post.model.ts` (`postStore` + `PostDTO`/`toPostDTO`),
`post-reaction.model.ts` (`reactionStore.react/unreact`, counter-column
map + `counterDelta`), `post-comment.model.ts` (`commentStore.list/add` +
`CommentDTO`/`toCommentDTO`).

---

## 2. REST module (`social-platform-be/src/modules/post/`)

Standard clone-api module. All routes `requireAuth` (`router.use(requireAuth)`).

| Route | Handler | Notes |
|---|---|---|
| `GET /posts` | `list` | global feed; `?mine=1` → my posts; `?authorId=X` → that user's |
| `POST /posts` | `create` | `validateBody(createPostSchema)`; author = `req.user.sub` |
| `POST /posts/upload` | `uploadMedia` | **static, before `/:id`**; `singleMedia` multer mw |
| `PATCH /posts/:id` | `update` | `validateBody(updatePostSchema)`; owner-only |
| `POST /posts/:id/pin` | `pin` | `validateBody(pinPostSchema)` `{pinned}`; owner-only |
| `DELETE /posts/:id` | `remove` | owner-only |
| `POST /posts/:id/react` | `react` | `validateBody(reactPostSchema)` `{emoji}`; any authed user; upsert+counter txn → PostDTO |
| `DELETE /posts/:id/react` | `unreact` | clear my reaction; any authed user |
| `GET /posts/:id/comments` | `listComments` | oldest→newest |
| `POST /posts/:id/comments` | `addComment` | `validateBody(createCommentSchema)`; any authed user; +commentsCount txn → CommentDTO |

- Ordering (`post.model.ts`): `orderBy: [{ pinnedAt: { sort:'desc',
  nulls:'last' } }, { createdAt:'desc' }]`, `take: FEED_LIMIT (50)`. No
  cursor/pagination yet (matches the old un-paginated localStorage feed).
- Guards (`post.service.ts`): `assertOwned` (missing=404, not-yours=403)
  for edit/delete/pin; `assertExists` (404 only) for react/unreact/comment.
  Both use `postStore.findBare` (no per-viewer joins).
- `createPostSchema` `.refine` rejects an entirely empty post (mirrors FE
  `canSubmit`). `updatePostSchema` is a **full replace** of editable fields
  (text/imageUrl/videoUrl/feeling); `null` clears. JSON writes go through
  `jsonWrite()` (Prisma rejects `undefined`; `null` → `Prisma.JsonNull`).
- Mounted in `src/routes/index.ts`: `router.use('/posts', postRoutes)`.

### Media upload (local disk)

- `src/config/uploads.ts`: `UPLOAD_DIR = <cwd>/uploads` (one place;
  `ensureUploadDir()` mkdir at boot — multer won't create it).
- `app.ts`: `helmet({ crossOriginResourcePolicy: { policy:'cross-origin' }})`
  (FE :3000 loads `<img>` from BE :8080 — same-origin default would block),
  then `app.use('/uploads', express.static(UPLOAD_DIR))` **before** `/api`.
- `post.upload.ts`: multer 2.x diskStorage, random `uuid+ext` name (never
  trust client filename), 50MB / 1 file, image|video only. `singleMedia`
  wrapper converts `MulterError` → 400 `ApiError` (else generic 500).
- multer parses multipart itself → bypasses `express.json`'s 5MB limit.
- Returns `{ url: \`${env.publicBaseUrl}/uploads/<file>\` }`.
  `env.publicBaseUrl` (`PUBLIC_BASE_URL` ?? `http://localhost:${PORT}`) must
  be browser-reachable — it is embedded in `<img src>`.

---

## 3. Client tiers (`project_III/src/feature/feed/`)

clone-api flow exactly. `dto/post.dto.ts` (wire, BE-aligned) +
`dto/post.mapper.ts` (`toFeedPostData` / `toFeedComment` / `toCreatePostBody`
/ `toUpdatePostBody`). `server/postProxy.ts` reads `AUTH_COOKIE`,
axios+Bearer, envelope unwrap → `{ posts }|{ post }|{ id }|{ comments }|
{ comment }`; route handlers `src/app/api/posts/{route,[id]/route,
[id]/pin/route,[id]/react/route,[id]/comments/route,upload/route}.ts`.
One service per verb in `services/` (`getFeed`, `getMyPosts`, `createPost`,
`updatePost`, `deletePost`, `pinPost`, `uploadPostMedia`, `reactPost`
[react+unreact], `getPostComments`, `addPostComment`).

**Two query keys, one prefix** (`data/usePostMutations.ts`):
`["posts","feed"]` (global) and `["posts","mine"]` (per-user); writes
`invalidateQueries(["posts"])` so every surface reconciles.

- `data/useFeed.ts` → `["posts","feed"]` via `getFeedService`. **CenterFeed
  only.** Server-ordered (pinned-first); no client sort.
- `data/useUserPosts.ts` → `["posts","mine"]` via `getMyPostsService`.
  **Public shape `{ posts, hydrated, addPost, removePost, updatePost }` is
  unchanged from the old localStorage hook** — its ~10 consumers (profile
  feed/photos/videos/stats, saved, trending, reels, report listener) were
  NOT touched. Keep this shape stable on any future change.
- `data/usePostMutations.ts` — shared `addPost/updatePost/removePost/
  pinPost/reactPost(id,emoji|null)/addComment(id,body)` (`mutateAsync`,
  return the persisted entity). Every `onSuccess` → `invalidate(["posts"])`
  then `emitFeed*` (persist-then-announce). `reactPost(id,null)` = unreact.
  `addComment` also busts `["post-comments", id]`.
- `data/usePostComments.ts` — `usePostComments(postId, enabled)` →
  `["post-comments", postId]` (key from `postCommentsKey`); **lazy**
  (`enabled` = comment section open). `FeedPost` seeds its `reaction` state
  from `post.myReaction` and **resyncs via a `useEffect` on
  `post.myReaction`** (server truth after a feed refetch; carries the repo's
  `// eslint-disable-next-line react-hooks/set-state-in-effect`).
- Both feed queries `enabled: isLoggined`, `retry:false`,
  `refetchOnWindowFocus:false`, `staleTime:30_000` (useProfileMeta pattern).

### Composer (`components/center/composer/modals/PostComposerModal.tsx`)

`onSubmit: (post) => void | Promise<unknown>`. Raw `File` kept in
`rawFileRef`, preview is an object URL; **upload happens on submit**
(`uploadPostMediaService` → URL), then `await onSubmit(...)`. Failure keeps
the draft open + `message.error`. **A `blob:` URL is never persisted** (guard
in `handleSubmit`). Edit mode keeps the existing hosted URL unless a new file
is picked. CenterFeed/MainFeed `handleCreate` must `return addPost(post)` so
the modal awaits the real persist.

### Ownership

`FeedPost` computes `isOwnPost = authUserId && (post.ownerId===authUserId ||
post.author.id===authUserId)` from `useAuthStore` — drives edit/delete/report
gating. The old `post.author.name === CURRENT_USER.name` mock check is gone;
do not reintroduce name-based identity. (`CURRENT_USER` survives only as the
comment-input box's own avatar/initial — cosmetic, not identity.)

### Reactions / comments wiring (`FeedPost`)

`handleReactionChange`: optimistic `setReaction(next)` → `await
reactPost(post.id, next)` → revert + `message.error` on throw → then
`emitNotification` (persist-then-announce). `handleAdd`: `await
addComment(post.id, {text,imageUrl})` → notify + `notifyMentions`.
`commentCount = post.comments` (DB-authoritative; the mutation refetches the
feed). `resolveRecipient()` is now **the real post author** (`post.ownerId
?? post.author.id`) — the owner gets the notification AND sees the count
change. `emitNotification` self-guards when recipient === me. The
`getFirstUserId()` demo scaffold is **no longer used for posts** (still wired
for mock-post reactions elsewhere if any remain).

---

## 4. Realtime (`/feed` namespace)

Server (`social-socket-server/src/feature/feed/`): `feed.dto.ts`,
`type.ts`, `feed.handler.ts`; registered in `socket/setup.ts`
(`io.of("/feed")`, `feedNsp.use(authMiddleware)` — same cookie-JWT as every
namespace). `registerFeedHandler` is the **presence pattern**: on
`feed:publish|update`/`feed:remove` it `socket.broadcast.emit`s
`feed:new|update|remove` to **everyone except the sender** (sender's own UI
already reconciled via its mutation's invalidation). No DB, no rooms — global
fan-out. Payload is opaque, only `id` required.

Client: `socket.ts` (`getFeedSocket/initFeed/disposeFeed`, mirrors
notification socket), `lib/feedEmit.ts` (fire-and-forget,
logged-in-guarded), `hooks/useFeedRealtime.ts` (one global mount in
`socket/client/provider.tsx`; needs the Query client which wraps it).
`usePostMutations` `onSuccess` → `invalidate()` then `emitFeed*` (persist-
then-announce); reactions/comments emit `feed:update` too. `useFeedRealtime`
listener collapses every event to `invalidateQueries(["posts"])` **and
`["post-comments"]`** → server-ordered refetch (correctness over optimistic
insert; the wire carries only `{id}`). This is how "B reacts/comments on A's
post" reaches A's open feed/comment list. `provider.tsx` calls
`initFeed()/disposeFeed()` alongside the other namespaces on login/logout.

---

## 5. Real now vs still mocked

**Real**: create / feed / edit / delete / pin / media upload / **reactions /
comments** — all DB-backed + realtime. Post like/comment notifications route
to the **real post author** (not `getFirstUserId()`).

**Still mocked / out of scope**:
- **Shares** (`sharesCount`, share-to-feed/reel, `handleShared`): still
  in-session; `sharesCount` never increments server-side.
- **Reels / stories** (`useUserReels`), **saved** (`useSavedReels`):
  unchanged, still localStorage/mock.
- **`FEED_POSTS` constant removed from the feed** — feed is empty until real
  posts exist. The constant may still be imported elsewhere; check before
  deleting it.
- **`firstUser` notification scaffold**: still wired for any remaining
  mock-post reactions / non-post features (clone-notification §7); posts no
  longer use it.
- Profile-of-another-user feed: `useUserPosts` is "mine" only;
  `?authorId=X` exists on the BE but no FE hook calls it yet.

---

## 6. Extending — recipes

**Real shares**: mirror reactions — increment `Post.sharesCount` in a
`POST /posts/:id/share` (txn), wire `handleShared`/`ShareMenu` to a mutation,
emit `feed:update`. Currently the only count still purely cosmetic.

**Comment delete/edit**: `PostComment` + `commentsCount` exist; add
`DELETE /posts/:id/comments/:commentId` (decrement in txn, author-or-post-
owner gated) and wire it into `CommentList`.

**Pagination**: add a `before` cursor to `listFeed`/`listByAuthor` (the
`createdAt` index is ready) → `useInfiniteQuery`. Today hard-capped at 50.
Comments are unpaginated too (`commentStore.list` returns all).

**Profile feed for other users**: add `getUserPostsService(authorId)` →
`/api/posts?authorId=` (proxy passes `req.nextUrl.search` through already)
→ a `useUserFeed(authorId)` hook keyed `["posts","user",authorId]`. Don't
overload `useUserPosts` (its "mine" semantics + stable shape are relied on).

**Known debt**: no rate limiting on create/upload/react/comment; uploaded
files never GC'd (deleting a post leaves its file + comment images on disk);
`feeling`/`sharedFrom` JSON unbounded beyond a loose zod check; counter
columns are denormalized — a manual DB edit can drift them from
`PostReaction`/`PostComment` (no reconcile job); socket fan-out is
whole-namespace (no follower graph); hardcoded socket `http://localhost:3002`
/ `API_BASE_URL` localhost defaults.

---

## 7. When editing posts in the current codebase

- Touch the wire shape? Update **both** sides together: `PostDTO`/`toPostDTO`
  (`post.model.ts`) or `CommentDTO`/`toCommentDTO` (`post-comment.model.ts`)
  on the BE, and `dto/post.dto.ts` + `dto/post.mapper.ts` on the FE.
- The model module is **split** — Post CRUD in `post.model.ts`, reactions in
  `post-reaction.model.ts`, comments in `post-comment.model.ts`, shared
  selects/types in `post.shared.ts`. Add a reaction op to the reaction store,
  not `postStore`. Keep stores from importing each other (only `post.shared`).
- Touch a `/feed` socket event? Update **both** `feed.dto.ts` files
  (server + `dto/feed.socket.dto.ts`); `tsx watch` reloads but a TS error
  blocks reload.
- Keep `useUserPosts`'s return shape stable — many non-feed surfaces depend
  on it; widening it is a cross-feature change.
- New write op → put it in `usePostMutations` (invalidate `["posts"]` +
  `emitFeed*` on success), not ad-hoc in a component.
- Schema change → `cd ../social-platform-be && npx prisma migrate dev
  --name <change>` (loads its `.env`, regenerates client).
- `npx tsc --noEmit` clean on **all three** projects + `npx eslint` on
  touched FE files before done. (Pre-existing repo-wide
  `react-hooks/set-state-in-effect` errors in `CenterFeed` /
  `PostComposerModal` / `LiveBroadcastModal` are not from this feature.)
