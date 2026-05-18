"use client";

import { App, Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import {
  useFriendActions,
  useFriendStatus,
} from "@/feature/friends/hooks/useFriends";
import { gradientBg } from "../../../data/mock";

const { Text } = Typography;

interface FriendActionButtonProps {
  /** The profile owner's user id. */
  userId: string;
}

const pillBase =
  "!h-9 !rounded-3xl !border-0 !px-4 md:!h-10 md:!px-6";

/**
 * Friend relationship control for a profile header. Driven entirely by
 * FriendsService via hooks, so it works against the mock today and a real
 * backend later with zero changes here.
 */
export function FriendActionButton({ userId }: FriendActionButtonProps) {
  const t = useTranslations("Friends");
  const { message } = App.useApp();
  const status = useFriendStatus(userId);
  const {
    busy,
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    unfriend,
  } = useFriendActions();

  if (status === "incoming") {
    return (
      <Flex align="center" gap={8}>
        <Button
          type="text"
          disabled={busy}
          onClick={async () => {
            await acceptRequest(userId);
            message.success(t("section.requestAccepted"));
          }}
          className={pillBase}
          style={{
            background: gradientBg(["#4096ff", "#a855f7"]),
            boxShadow: "0 2px 12px #4096ff40",
          }}
        >
          <Flex align="center" gap={8}>
            <Icon name="how_to_reg" size={18} color="#FFFFFF" />
            <Text className="!text-sm !font-semibold !text-white">
              {t("action.confirm")}
            </Text>
          </Flex>
        </Button>
        <Button
          type="text"
          disabled={busy}
          onClick={async () => {
            await rejectRequest(userId);
            message.info(t("section.requestDeleted"));
          }}
          className={`${pillBase ?? ""} bg-[var(--color-bg-tertiary)]`}  >
          <Text
            className="!text-sm !font-semibold text-[var(--color-text)]"  >
            {t("action.delete")}
          </Text>
        </Button>
      </Flex>
    );
  }

  if (status === "friends") {
    return (
      <Button
        type="text"
        disabled={busy}
        onClick={async () => {
          await unfriend(userId);
          message.info(t("section.removed"));
        }}
        className={`${pillBase ?? ""} bg-[var(--color-bg-tertiary)]`}  >
        <Flex align="center" gap={8}>
          <Icon name="group" size={18} color="var(--color-text)" />
          <Text
            className="!text-sm !font-semibold text-[var(--color-text)]"  >
            {t("action.friends")}
          </Text>
        </Flex>
      </Button>
    );
  }

  if (status === "requested") {
    return (
      <Button
        type="text"
        disabled={busy}
        onClick={async () => {
          await cancelRequest(userId);
          message.info(t("section.requestDeleted"));
        }}
        className={`${pillBase ?? ""} bg-[var(--color-bg-tertiary)]`}  >
        <Flex align="center" gap={8}>
          <Icon name="schedule" size={18} color="var(--color-text)" />
          <Text
            className="!text-sm !font-semibold text-[var(--color-text)]"  >
            {t("action.requested")}
          </Text>
        </Flex>
      </Button>
    );
  }

  return (
    <Button
      type="text"
      disabled={busy}
      onClick={async () => {
        await sendRequest(userId);
        message.success(t("section.added"));
      }}
      className={pillBase}
      style={{
        background: gradientBg(["#4096ff", "#a855f7"]),
        boxShadow: "0 2px 12px #4096ff40",
      }}
    >
      <Flex align="center" gap={8}>
        <Icon name="person_add" size={18} color="#FFFFFF" />
        <Text className="!text-sm !font-semibold !text-white">
          {t("action.addFriend")}
        </Text>
      </Flex>
    </Button>
  );
}
