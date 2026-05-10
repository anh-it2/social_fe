"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { App, Flex, Typography } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { TopNav } from "@/shared/components/topnav/TopNav";
import {
  EDIT_PAGE_MAX_WIDTH,
  EDIT_PAGE_PADDING,
  EDIT_PROFILE_DEFAULTS,
} from "./edit-profile.constants";
import { editProfileSchema, type EditProfileValues } from "./edit-profile.schema";
import { EditActions } from "./EditActions";
import { EditAboutSection } from "./EditAboutSection";
import { EditCoverPreview } from "./EditCoverPreview";
import { EditIdentitySection } from "./EditIdentitySection";
import { EditPageHeader } from "./EditPageHeader";

const { Text } = Typography;

export function EditProfilePage() {
  const nav = useNavigation();
  const { message } = App.useApp();
  const methods = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: EDIT_PROFILE_DEFAULTS,
    mode: "onSubmit",
  });

  async function onSubmit(values: EditProfileValues) {
    console.log("[edit-profile] save", values);
    message.success("Profile updated");
    nav.push("/profile");
  }

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
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
