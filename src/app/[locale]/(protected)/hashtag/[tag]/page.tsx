import { HashtagPage } from "@/feature/hashtag/components/HashtagPage";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export default async function Page({ params }: PageProps) {
  const { tag } = await params;
  return <HashtagPage tag={decodeURIComponent(tag).toLowerCase()} />;
}
