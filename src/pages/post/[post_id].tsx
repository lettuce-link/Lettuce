import { usePost } from "api/post";
import { FullPost } from "components/post/post";
import { useRouter } from "next/router";

export default function PostPage() {
  const router = useRouter();

  const { community_name: name, post_id: postId } = router.query;

  // @ts-ignore
  const { post, isLoading } = usePost(postId);

  return <FullPost postView={post?.post_view} isLoading={isLoading} />;
}
