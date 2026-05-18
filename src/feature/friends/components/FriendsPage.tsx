"use client";

import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { FriendsSubSidebar, type FriendsView } from "./FriendsSubSidebar";
import { AllFriendsView } from "./views/AllFriendsView";
import { BirthdaysView } from "./views/BirthdaysView";
import { HomeView } from "./views/HomeView";
import { ListsView } from "./views/ListsView";
import { RequestsView } from "./views/RequestsView";
import { SuggestionsView } from "./views/SuggestionsView";

const FRIENDS_VIEWS: readonly FriendsView[] = [
  "home",
  "requests",
  "suggestions",
  "all",
  "birthdays",
  "lists",
];

function isFriendsView(v: string | null): v is FriendsView {
  return v !== null && (FRIENDS_VIEWS as readonly string[]).includes(v);
}

export function FriendsPage() {
  const params = useSearchParams();
  const paramView = params.get("view");
  const [view, setView] = useState<FriendsView>(
    isFriendsView(paramView) ? paramView : "home",
  );

  // Keep the active view in sync when arriving via a deep link
  // (e.g. clicking a friend-request notification -> ?view=requests).
  useEffect(() => {
    if (isFriendsView(paramView)) setView(paramView);
  }, [paramView]);

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <TopNav />
      <Flex className="!w-full !flex-1 !items-stretch">
        <FriendsSubSidebar view={view} onChange={setView} />
        <main
          className="!min-w-0 !flex-1 bg-[var(--color-bg)]"  >
          {view === "home" && (
            <HomeView
              onSeeAllRequests={() => setView("requests")}
              onSeeAllSuggestions={() => setView("suggestions")}
            />
          )}
          {view === "requests" && <RequestsView />}
          {view === "suggestions" && <SuggestionsView />}
          {view === "all" && <AllFriendsView />}
          {view === "birthdays" && <BirthdaysView />}
          {view === "lists" && <ListsView />}
        </main>
      </Flex>
    </Flex>
  );
}
