"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { toAuthSession, toLoginRequestDto } from "../dto/auth.mapper";
import { login } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const saveLoginnedUser = useAuthStore((state) => state.saveLoginnedUser);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await login(toLoginRequestDto({ username, password }));

      if (res.status === 200) {
        const session = toAuthSession(res);
        saveLoginnedUser({
          userId: session?.userId || "",
          userName: session?.username || "",
        });
        setSuccess(`Welcome, ${session?.username ?? "user"}!`);
        router.push("/");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
    >
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {t("submit")}
      </h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("usernameLabel")}
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="h-10 rounded-lg border border-black/10 bg-transparent px-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:text-zinc-50"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("passwordLabel")}
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="h-10 rounded-lg border border-black/10 bg-transparent px-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/10 dark:text-zinc-50"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="h-10 rounded-lg bg-zinc-900 text-sm font-medium text-zinc-50 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {loading ? t("submitLoading") : t("submit")}
      </button>
    </form>
  );
}
