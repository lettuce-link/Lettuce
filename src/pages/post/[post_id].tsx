import { PostPage } from "components/post/post";
import { useRouter } from "next/router";

export default function PostPageWrapper() {
  const router = useRouter();

  const { post_id: postId } = router.query;

  return <PostPage id={postId} />;
}
