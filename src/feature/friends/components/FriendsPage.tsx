"use client";

import { Flex } from "antd";
import { useState } from "react";
import { TopNav } from "@/shared/components/topnav/TopNav";
import { FriendsSubSidebar, type FriendsView } from "./FriendsSubSidebar";
import { AllFriendsView } from "./views/AllFriendsView";
import { BirthdaysView } from "./views/BirthdaysView";
import { HomeView } from "./views/HomeView";
import { ListsView } from "./views/ListsView";
import { RequestsView } from "./views/RequestsView";
import { SuggestionsView } from "./views/SuggestionsView";

export function FriendsPage() {
  const [view, setView] = useState<FriendsView>("home");

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <TopNav />
      <Flex className="!w-full !flex-1 !items-stretch">
        <FriendsSubSidebar view={view} onChange={setView} />
        <main
          className="!min-w-0 !flex-1"
          style={{ background: "var(--color-bg)" }}
        >
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
