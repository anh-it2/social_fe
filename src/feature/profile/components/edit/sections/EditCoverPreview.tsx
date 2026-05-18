"use client";

import { App, Button, Flex, Typography, Upload } from "antd";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { Icon } from "../../Icon";
import { gradientBg } from "../../../data/mock";
import { EditCard } from "../EditCard";
import {
  EDIT_AVATAR_GRADIENT,
  EDIT_AVATAR_SIZE,
  EDIT_COVER_GRADIENT,
  EDIT_COVER_HEIGHT,
} from "../data/edit-profile.constants";
import type { EditProfileValues } from "../data/edit-profile.schema";

const { Text } = Typography;

const MAX_BYTES = 4 * 1024 * 1024;

export function EditCoverPreview() {
  const { message } = App.useApp();
  const { control, setValue } = useFormContext<EditProfileValues>();
  const name = useWatch({ control, name: "name" });
  const avatarUrl = useWatch({ control, name: "avatarUrl" });
  const coverUrl = useWatch({ control, name: "coverUrl" });

  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const makeBeforeUpload = (field: "avatarUrl" | "coverUrl") => (raw: File) => {
    if (!raw.type.startsWith("image/")) {
      message.error("Only images allowed");
      return Upload.LIST_IGNORE;
    }
    if (raw.size > MAX_BYTES) {
      message.error("File too big (max 4MB)");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : "";
      if (!url) return;
      setValue(field, url, { shouldDirty: true });
      message.success(
        field === "avatarUrl" ? "Profile picture updated" : "Cover photo updated"
      );
    };
    reader.onerror = () => message.error("Failed to read image");
    reader.readAsDataURL(raw);
    return false;
  };

  const removeAvatar = () => {
    setValue("avatarUrl", "", { shouldDirty: true });
    message.success("Profile picture removed");
  };

  return (
    <EditCard
      title="Cover & Avatar"
      description="Upload images that represent you. Avatar shows on every post."
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: EDIT_COVER_HEIGHT,
          borderRadius: 14,
          background: coverUrl ? "#000" : EDIT_COVER_GRADIENT,
        }}
      >
        {coverUrl && (
          <Image className="[object-fit:cover]"
            src={coverUrl}
            alt="cover preview"
            fill
            unoptimized
            sizes="(min-width: 960px) 912px, 100vw"  />
        )}
        <div className="absolute right-4 top-4">
          <Upload
            accept="image/*"
            beforeUpload={makeBeforeUpload("coverUrl")}
            showUploadList={false}
          >
            <Button
              type="text"
              className="!h-9 !rounded-3xl !border-0 !px-4 bg-[rgba(0,0,0,0.5)] text-[#fff]"  >
              <Flex align="center" gap={6}>
                <Icon name="photo_camera" size={16} color="#fff" />
                <span className="text-xs font-semibold">
                  {coverUrl ? "Change Cover" : "Upload Cover"}
                </span>
              </Flex>
            </Button>
          </Upload>
        </div>
      </div>

      <Flex align="center" gap={20} className="!w-full">
        <div
          className="relative flex shrink-0 items-center justify-center overflow-hidden"
          style={{
            width: EDIT_AVATAR_SIZE,
            height: EDIT_AVATAR_SIZE,
            borderRadius: "50%",
            background: avatarUrl ? "#000" : gradientBg([...EDIT_AVATAR_GRADIENT]),
            border: "4px solid var(--color-bg-secondary)",
            boxShadow: "0 4px 24px #4096ff40",
          }}
        >
          {avatarUrl ? (
            <Image className="[object-fit:cover]"
              src={avatarUrl}
              alt="avatar preview"
              fill
              unoptimized
              sizes="120px"  />
          ) : (
            <Text
              className="!text-3xl !font-bold text-[#fff] [letter-spacing:1px]"  >
              {initials || "?"}
            </Text>
          )}
        </div>
        <Flex vertical gap={8}>
          <Text
            className="!text-sm !font-semibold text-[var(--color-text)]"  >
            Profile picture
          </Text>
          <Text className="!text-xs text-[var(--color-text-muted)]" >
            JPG, PNG. Max 4MB. Square recommended.
          </Text>
          <Flex gap={8}>
            <Upload
              accept="image/*"
              beforeUpload={makeBeforeUpload("avatarUrl")}
              showUploadList={false}
            >
              <Button
                type="text"
                className="!h-9 !rounded-3xl !border-0 !px-4"
                style={{
                  background: gradientBg([...EDIT_AVATAR_GRADIENT]),
                  color: "#fff",
                }}
              >
                <span className="text-xs font-semibold">Upload</span>
              </Button>
            </Upload>
            <Button
              type="text"
              onClick={removeAvatar}
              disabled={!avatarUrl}
              className="!h-9 !rounded-3xl !border !px-4 [border-color:var(--color-border)] bg-[transparent] text-[var(--color-text-secondary)]"  >
              <span className="text-xs font-semibold">Remove</span>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </EditCard>
  );
}
