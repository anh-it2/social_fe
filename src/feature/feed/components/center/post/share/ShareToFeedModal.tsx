"use client";

import { App, Avatar, Button, Flex, Input, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { gradientBg } from "@/shared/utils/gradient";
import { CURRENT_USER } from "../../../../data/constants";
import { buildSharedPost, rootSnapshot } from "../../../../lib/sharedPost";
import type { FeedPostData } from "../../../../data/types";
import { SharedPostPreview } from "../body/SharedPostPreview";
import styles from "../../composer/modals/PostComposerModal.module.scss";

const { Text, Title } = Typography;

interface ShareToFeedModalProps {
  open: boolean;
  originalPost: FeedPostData;
  onClose: () => void;
  onSubmit: (post: FeedPostData) => void;
}

export function ShareToFeedModal({
  open,
  originalPost,
  onClose,
  onSubmit,
}: ShareToFeedModalProps) {
  const t = useTranslations("Feed.shareToFeed");
  const tReel = useTranslations("Feed.reelViewer");
  const { message } = App.useApp();
  const [caption, setCaption] = useState("");
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    submittedRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaption("");
  }, [open]);

  const handleSubmit = () => {
    submittedRef.current = true;
    onSubmit(buildSharedPost(originalPost, caption, tReel("justNow")));
    message.success(t("shared"));
    onClose();
  };

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={520}
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
    >
      <Flex
        align="center"
        justify="center"
        className="!relative !px-6 !py-3 [border-bottom:1px_solid_var(--color-border)]"  >
        <Title level={5} className="!m-0 text-[var(--color-text)]" >
          {t("title")}
        </Title>
      </Flex>

      <Flex vertical gap={12} className="!px-5 !py-4">
        <Flex align="center" gap={10}>
          <Avatar
            size={40}
            style={{ background: gradientBg(CURRENT_USER.gradient), fontWeight: 700 }}
          >
            {CURRENT_USER.initial}
          </Avatar>
          <Flex vertical gap={0}>
            <Text
              className="!text-sm !font-semibold text-[var(--color-text)]"  >
              {CURRENT_USER.name}
            </Text>
            <Flex
              align="center"
              gap={3}
              className="!rounded-full !px-1.5 !py-0.5 !w-fit bg-[var(--color-bg-tertiary)]"  >
              <Icon name="public" size={11} color="var(--color-text-muted)" />
              <Text
                className="!text-[10px] !font-semibold text-[var(--color-text-muted)]"  >
                {t("visibility")}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Input.TextArea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={t("captionPlaceholder")}
          autoSize={{ minRows: 3, maxRows: 6 }}
          maxLength={500}
          variant="borderless"
          className="[&_textarea]:!text-[var(--color-text)] [&_textarea::placeholder]:!text-[var(--color-text-placeholder)] [&_textarea::placeholder]:!opacity-100 bg-[transparent] text-[var(--color-text)] [font-size:16px] [resize:none] p-[0px]"  />

        <div className="!-mx-2">
          <SharedPostPreview post={rootSnapshot(originalPost)} compact />
        </div>

        <Button
          type="primary"
          onClick={handleSubmit}
          block
          size="large"
          className={`${styles.submitBtn} !h-10 !rounded-[10px] !font-bold`}
        >
          {t("postNow")}
        </Button>
      </Flex>
    </DarkModal>
  );
}
