import { Manager, Socket } from "socket.io-client";

let manager: Manager | null = null;
let sockets = new Map<string, Socket>();
let listenersBound = false;

// Cross-domain (vercel ↔ render) the httpOnly cookie is NOT sent on the socket
// handshake, so we fetch the JWT from our own same-origin route and pass it in
// the handshake `auth`. One in-flight fetch is shared across the 5 namespace
// connects; it's cleared on settle so each later (re)connect gets a fresh token.
let tokenPromise: Promise<string | null> | null = null;

async function fetchSocketToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/socket-token", { credentials: "include" });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: unknown };
    return typeof data.token === "string" ? data.token : null;
  } catch {
    return null;
  }
}

function getSocketToken(): Promise<string | null> {
  if (!tokenPromise) {
    tokenPromise = fetchSocketToken().finally(() => {
      tokenPromise = null;
    });
  }
  return tokenPromise;
}

function getManager() {
  if (manager) return manager;

  manager = new Manager(
    process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3002",
    {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
      // Send the httpOnly `token` cookie on the engine.io handshake so the
      // socket server can verify the JWT. localhost:3000 and :3002 are the
      // same site (host `localhost`), so the SameSite=Lax cookie is sent.
      withCredentials: true,
    },
  );

  return manager;
}

export function getNamespaceSocket<S extends Socket>(
  nsp: string,
  auth: Record<string, unknown>,
): S {
  const existing = sockets.get(nsp);
  if (existing) return existing as S;

  // `auth` as a function is re-evaluated on every (re)connect attempt, so the
  // token is refreshed on reconnect. socket.io waits for the callback, letting
  // us resolve the async token fetch before the handshake goes out.
  const socket = getManager().socket(nsp, {
    auth: (cb: (data: Record<string, unknown>) => void) => {
      getSocketToken().then((token) =>
        cb({ ...auth, ...(token ? { token } : {}) }),
      );
    },
  });
  sockets.set(nsp, socket);

  return socket as S;
}

export function disposeAll() {
  sockets.forEach((socket) => socket.close());
  sockets.clear();
  manager = null;
  listenersBound = false;
}

export function connectManager() {
  const m = getManager();
  if (!listenersBound) {
    m.on("open", () => console.log("[manager] engine OPEN"));
    m.on("close", (reason) => console.log("[manager] engine CLOSE:", reason));
    m.on("error", (err) => console.log("[manager] engine ERROR:", err));
    m.on("reconnect_attempt", (n) =>
      console.log("[manager] reconnect attempt", n),
    );
    listenersBound = true;
  }
  m.connect();
}
