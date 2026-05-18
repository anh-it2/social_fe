"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { App, Flex, Typography } from "antd";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { TopNav } from "@/shared/components/topnav/TopNav";
import {
  EDIT_PAGE_MAX_WIDTH,
  EDIT_PAGE_PADDING,
  EDIT_PROFILE_DEFAULTS,
} from "./data/edit-profile.constants";
import { editProfileSchema, type EditProfileValues } from "./data/edit-profile.schema";
import { EditActions } from "./EditActions";
import { EditAboutSection } from "./sections/EditAboutSection";
import { EditCoverPreview } from "./sections/EditCoverPreview";
import { EditIdentitySection } from "./sections/EditIdentitySection";
import { EditPageHeader } from "./EditPageHeader";
import { useProfileMeta } from "./data/useProfileMeta";
import { publishPresenceProfile } from "@/feature/presence/socket";

const { Text } = Typography;

export function EditProfilePage() {
  const nav = useNavigation();
  const { message } = App.useApp();
  const { meta, hydrated, save } = useProfileMeta();
  const methods = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: EDIT_PROFILE_DEFAULTS,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (hydrated) methods.reset(meta);
  }, [hydrated, meta, methods]);

  async function onSubmit(values: EditProfileValues) {
    try {
      // 1. Persist to social-platform-be (DB = source of truth).
      await save(values);
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Could not save profile",
      );
      return;
    }
    // 2. Only after the write succeeds, announce to everyone online so
    //    their views update in realtime (variant 1a).
    publishPresenceProfile(values.avatarUrl, values.name);
    message.success("Profile updated");
    nav.push("/profile");
  }

  const hasFieldErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full bg-[var(--color-bg)]"  >
      <TopNav />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full"
          noValidate
        >
          <Flex
            vertical
            gap={24}
            className="!mx-auto !w-full"
            style={{
              maxWidth: EDIT_PAGE_MAX_WIDTH,
              padding: EDIT_PAGE_PADDING,
            }}
          >
            <EditPageHeader />
            <EditCoverPreview />
            <EditIdentitySection />
            <EditAboutSection />
            {hasFieldErrors && (
              <Text
                className="!text-sm text-[var(--color-error)]"  >
                Please fill out the required fields marked with *.
              </Text>
            )}
            {methods.formState.errors.root && (
              <Text type="danger" className="!text-sm">
                {methods.formState.errors.root.message}
              </Text>
            )}
            <EditActions submitting={methods.formState.isSubmitting} />
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  );
}
