"use client";

import { useProfileView } from "../../../context/ProfileViewContext";
import { useProfileMeta } from "../../edit/data/useProfileMeta";
import type { AboutItem as AboutItemData } from "../../../data/mock";
import { AboutBio } from "./AboutBio";
import { AboutDivider } from "./AboutDivider";
import { AboutHeader } from "./AboutHeader";
import { AboutItem } from "./AboutItem";
import { CardWrapper } from "../card/CardWrapper";

interface AboutCardProps {
  onEditAbout: () => void;
}

const FIELD_META: { icon: string; gradient: [string, string] }[] = [
  { icon: "work", gradient: ["#4096ff", "#a855f7"] },
  { icon: "school", gradient: ["#a855f7", "#ec4899"] },
  { icon: "location_on", gradient: ["#f59e0b", "#f97316"] },
  { icon: "favorite", gradient: ["#ef4444", "#ec4899"] },
];

export function AboutCard({ onEditAbout }: AboutCardProps) {
  const view = useProfileView();
  const { meta, hydrated } = useProfileMeta();

  // Self: per-account profile meta. Other person: only what their
  // ProfileView exposes. No mock fallback.
  const bio = view.isSelf ? meta.bio : view.bio;
  const fields = view.isSelf
    ? [meta.work, meta.education, meta.location, meta.relationship]
    : [
        view.work ?? "",
        view.education ?? "",
        view.location ?? "",
        view.relationship ?? "",
      ];

  const items: AboutItemData[] = fields
    .map((text, i) => ({
      id: FIELD_META[i].icon,
      icon: FIELD_META[i].icon,
      text: text ?? "",
      gradient: FIELD_META[i].gradient,
    }))
    .filter((it) => it.text.trim().length > 0);

  // Avoid a flash of an empty card before per-account meta hydrates.
  if (view.isSelf && !hydrated) {
    return (
      <CardWrapper>
        <AboutHeader onEditClick={onEditAbout} />
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <AboutHeader onEditClick={view.isSelf ? onEditAbout : undefined} />
      <AboutBio text={bio} />
      {items.length > 0 ? <AboutDivider /> : null}
      {items.map((item) => (
        <AboutItem key={item.id} item={item} />
      ))}
    </CardWrapper>
  );
}
