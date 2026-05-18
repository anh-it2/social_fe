"use client";

import { Flex, Typography } from "antd";
import { DarkModal } from "@/shared/components/modal/DarkModal";

const { Text, Title } = Typography;

interface VideoPlayerModalProps {
  open: boolean;
  src: string;
  caption?: string;
  time?: string;
  onClose: () => void;
}

export function VideoPlayerModal({
  open,
  src,
  caption,
  time,
  onClose,
}: VideoPlayerModalProps) {
  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={720}
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
    >
      <Flex vertical gap={12} className="!px-5 !py-4">
        <Flex
          align="center"
          justify="center"
          className="!w-full !overflow-hidden !rounded-xl bg-[#000]"  >
          <video
            src={src}
            controls
            autoPlay
            playsInline
            className="!w-full max-h-[540px] bg-[#000]"  />
        </Flex>
        {(caption || time) && (
          <Flex vertical gap={4}>
            {caption && (
              <Title level={5} className="!m-0 text-[var(--color-text)]" >
                {caption}
              </Title>
            )}
            {time && (
              <Text className="!text-xs text-[var(--color-text-muted)]" >
                {time}
              </Text>
            )}
          </Flex>
        )}
      </Flex>
    </DarkModal>
  );
}
