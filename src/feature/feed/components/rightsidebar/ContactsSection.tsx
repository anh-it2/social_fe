"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import { CONTACTS } from "../../data/constants";
import { ContactRow } from "./ContactRow";

const { Text } = Typography;

export function ContactsSection() {
  return (
    <Flex vertical gap={4} className="!w-full">
      <Flex
        align="center"
        justify="space-between"
        className="!h-9 !w-full !pb-2"
      >
        <Text className="!text-base !font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          Contacts
        </Text>
        <Flex align="center" gap={8}>
          <Icon name="videocam" size={22} color="var(--color-text-secondary)" />
          <Icon name="search" size={22} color="var(--color-text-secondary)" />
          <Icon name="more_horiz" size={22} color="var(--color-text-secondary)" />
        </Flex>
      </Flex>
      {CONTACTS.map((c) => (
        <ContactRow key={c.id} contact={c} />
      ))}
    </Flex>
  );
}
