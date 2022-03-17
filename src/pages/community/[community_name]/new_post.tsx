import { NewPostPage } from "components/community/new_post";
import { useRouter } from "next/router";

export default function NewPostPageWrapper() {
  const router = useRouter();

  const { community_name: name } = router.query;

  return <NewPostPage name={name} />;
}
