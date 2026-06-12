"use client";

import { App, Button, Dropdown, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProfileMeta } from "../../edit/data/useProfileMeta";
import { ShareDropdownItem } from "@/shared/components/post/share-dropdown/ShareDropdownItem";
import { SendToChatModal } from "@/shared/components/post/share-dropdown/SendToChatModal";
import shareStyles from "@/shared/components/post/share-dropdown/ShareDropdown.module.scss";
import { COVER_GLASS, COVER_GLASS_FG } from "./coverGlass";
import { Icon } from "../../Icon";
import { useProfileView } from "../../../context/ProfileViewContext";

const { Text } = Typography;

export function ShareButton() {
  const t = useTranslations("Profile.actions");
  const tPost = useTranslations("Post");
  const tShare = useTranslations("Profile.share");
  const { message: api } = App.useApp();
  const { meta } = useProfileMeta();
  const view = useProfileView();
  const [open, setOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const profileUrl =
    typeof window !== "undefined" ? window.location.href : "/profile";

  const handleCopy = () => {
    void navigator.clipboard.writeText(profileUrl);
    api.success(tPost("linkCopied"));
    setOpen(false);
  };

  const handleSend = () => {
    setOpen(false);
    setSendOpen(true);
  };

  const handleSent = (recipientIds: string[]) => {
    api.success(
      tPost("shareDropdown.sendModal.sentTo", { count: recipientIds.length }),
    );
  };

  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        open={open}
        onOpenChange={setOpen}
        rootClassName={shareStyles.shareDropdownRoot}
        popupRender={() => (
          <Flex
            vertical
            className="!p-2 !w-[min(340px,calc(100vw-16px))] bg-[var(--color-bg-secondary)] [border:1px_solid_var(--color-border)] rounded-[16px] [box-shadow:0_12px_32px_rgba(0,0,0,0.45)] [overflow:hidden]"  >
            <Flex className="[padding:4px_8px_8px_8px] [border-bottom:1px_solid_var(--color-border-light)]"
              align="center"  >
              <Text
                className="!text-[17px] !font-bold text-[var(--color-text)]"  >
                {tPost("shareDropdown.header")}
              </Text>
            </Flex>
            <Flex vertical gap={2} >
              <ShareDropdownItem
                icon="link"
                gradient={["#6B7280", "#4B5563"]}
                title={tPost("copyLink")}
                description={tShare("copyLinkDesc")}
                onClick={handleCopy}
              />
              <ShareDropdownItem
                icon="chat_bubble"
                gradient={["#0084FF", "#44BCFF"]}
                title={tPost("sendMessenger")}
                description={tPost("shareDropdown.sendMessengerDesc")}
                onClick={handleSend}
              />
            </Flex>
          </Flex>
        )}
      >
        <Button
          type="text"
          className={`${COVER_GLASS} !h-9 !rounded-3xl !px-4 md:!h-10 md:!px-6`}  >
          <Flex align="center" gap={8}>
            <Icon name="share" size={18} color={COVER_GLASS_FG} />
            <Text className="!text-sm !font-semibold !text-[var(--cover-glass-fg)]">
              {t("share")}
            </Text>
          </Flex>
        </Button>
      </Dropdown>
      <SendToChatModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onSent={handleSent}
        shareUrl={profileUrl}
        refLabel={tShare("profileRef", {
          name: view.isSelf ? meta.name : (view.name ?? ""),
        })}
        title={tShare("sendModalTitle")}
        subtitle={tShare("sendModalSubtitle")}
      />
    </>
  );
}
