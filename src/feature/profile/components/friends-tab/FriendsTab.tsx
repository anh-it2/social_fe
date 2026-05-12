"use client";

import { Empty, Flex, Input } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { RECENT_CHATS } from "@/shared/data/chats";
import {
  BIRTHDAYS,
  FRIENDS,
  FRIEND_REQUESTS,
  FRIEND_SUGGESTIONS,
} from "../../data/mock";
import { useOnlineNameSet } from "../../hooks/useFriendOnline";
import { BirthdayItem } from "./BirthdayItem";
import { FilterChips, type FriendsFilter } from "./FilterChips";
import { FriendCard } from "./FriendCard";
import { OnlineFriendCard } from "./OnlineFriendCard";
import { RequestCard } from "./RequestCard";
import { SectionHeader } from "./SectionHeader";
import { SuggestionCard } from "./SuggestionCard";

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function FriendsTab() {
  const t = useTranslations("Profile.friendsTab");
  const [filter, setFilter] = useState<FriendsFilter>("all");
  const [query, setQuery] = useState("");

  const onlineNames = useOnlineNameSet();

  const isOnline = (name: string, mockOnline?: boolean) =>
    Boolean(mockOnline) || onlineNames.has(norm(name));

  const q = norm(query);
  const filteredFriends = FRIENDS.filter((f) => !q || norm(f.name).includes(q));
  const onlineChatsAll = RECENT_CHATS.filter((c) => c.online);
  const onlineChats = onlineChatsAll.filter((c) => !q || norm(c.name).includes(q));
  const onlineCount = onlineChatsAll.length;

  const seeAll = t("actions.seeAll");

  const showAll = filter === "all";
  const showOnline = filter === "all" || filter === "online";
  const showRequests = filter === "all" || filter === "requests";
  const showSuggestions = filter === "all" || filter === "suggestions";
  const showBirthdays = filter === "all" || filter === "birthdays";

  return (
    <Flex
      vertical
      gap={20}
      className="!w-full !px-3 !py-4 sm:!gap-6 sm:!px-6 sm:!py-5 lg:!px-12 lg:!py-6"
      style={{ background: "var(--color-bg)" }}
    >
      <Flex
        vertical
        gap={12}
        className="!w-full !p-4 sm:!p-5"
        style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          borderRadius: 20,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <Input.Search
          allowClear
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="!w-full"
        />
        <FilterChips
          active={filter}
          onChange={setFilter}
          onlineCount={onlineCount}
          requestCount={FRIEND_REQUESTS.length}
        />
      </Flex>

      {showOnline ? (
        <section className="!w-full">
          <SectionHeader
            title={t("sections.online")}
            count={onlineChats.length}
            action={seeAll}
          />
          {onlineChats.length === 0 ? (
            <Empty
              description={
                <span style={{ color: "var(--color-text-muted)" }}>{t("empty.noOnline")}</span>
              }
            />
          ) : (
            <div className="!grid !w-full !grid-cols-1 !gap-3 sm:!gap-4 md:!grid-cols-2 xl:!grid-cols-3">
              {onlineChats.map((c) => (
                <OnlineFriendCard key={c.id} chat={c} />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {showRequests && FRIEND_REQUESTS.length > 0 ? (
        <section className="!w-full">
          <SectionHeader
            title={t("sections.requests")}
            count={FRIEND_REQUESTS.length}
            action={seeAll}
          />
          <div className="!grid !w-full !grid-cols-1 !gap-3 sm:!grid-cols-2 sm:!gap-4 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
            {FRIEND_REQUESTS.map((r) => (
              <RequestCard key={r.id} request={r} online={isOnline(r.name)} />
            ))}
          </div>
        </section>
      ) : null}

      {showBirthdays && BIRTHDAYS.length > 0 ? (
        <section className="!w-full">
          <SectionHeader
            title={t("sections.birthdays")}
            count={BIRTHDAYS.length}
            action={seeAll}
          />
          <div className="!grid !w-full !grid-cols-1 !gap-3 sm:!grid-cols-2 sm:!gap-4 xl:!grid-cols-3">
            {BIRTHDAYS.map((b) => (
              <BirthdayItem key={b.id} entry={b} online={isOnline(b.name)} />
            ))}
          </div>
        </section>
      ) : null}

      {showSuggestions && FRIEND_SUGGESTIONS.length > 0 ? (
        <section className="!w-full">
          <SectionHeader
            title={t("sections.suggestions")}
            count={FRIEND_SUGGESTIONS.length}
            action={seeAll}
          />
          <div className="!grid !w-full !grid-cols-1 !gap-3 sm:!grid-cols-2 sm:!gap-4 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
            {FRIEND_SUGGESTIONS.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} />
            ))}
          </div>
        </section>
      ) : null}

      {showAll ? (
        <section className="!w-full">
          <SectionHeader title={t("sections.all")} count={filteredFriends.length} />
          {filteredFriends.length === 0 ? (
            <Empty
              description={
                <span style={{ color: "var(--color-text-muted)" }}>{t("empty.noFriends")}</span>
              }
            />
          ) : (
            <div className="!grid !w-full !grid-cols-1 !gap-3 sm:!grid-cols-2 sm:!gap-4 md:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5">
              {filteredFriends.map((f) => (
                <FriendCard
                  key={f.id}
                  friend={f}
                  online={isOnline(f.name, f.mockOnline)}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </Flex>
  );
}
