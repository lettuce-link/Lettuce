import { usePost } from "api/post";
import { WidthLimit } from "atoms/layout";
import { FullPost } from "components/post/post";
import { useRouter } from "next/router";

export default function PostPage() {
  const router = useRouter();

  const { community_name: name, post_id: postId } = router.query;

  // @ts-ignore
  const { post, isLoading } = usePost(postId);

  return (
    <main>
      <WidthLimit limit="var(--large-content)">
        <FullPost
          postView={post?.post_view}
          communityView={post?.community_view}
          comments={post?.comments}
          isLoading={isLoading}
        />
      </WidthLimit>
      <style jsx>{`
        main {
          padding: 32px 16px;
        }
      `}</style>
    </main>
  );
}
