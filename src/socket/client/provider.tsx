"use client";

import React, { useEffect } from "react";
import { connectManager, disposeAll } from "./manager";
import { useAuthStore } from "@/feature/auth/stores/auth.store";

//provider is used for sync state of auth with state of connection
export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sync = (isLoginned: boolean) => {
      isLoginned ? connectManager() : disposeAll();
    };

    //sync default state
    const { isLoggined } = useAuthStore.getState();
    sync(isLoggined);

    const unsub = useAuthStore.subscribe((state, prev) => {
      if (state.isLoggined && !prev.isLoggined) {
        console.log("login");
        connectManager();
      }
      if (!state.isLoggined && prev.isLoggined) {
        disposeAll();
      }
    });

    return () => {
      unsub();
      disposeAll();
    };
  }, []);

  return <>{children}</>;
}
