import { PostDetailPage } from "@/feature/feed/components/post-detail/PostDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <PostDetailPage postId={id} />;
}
