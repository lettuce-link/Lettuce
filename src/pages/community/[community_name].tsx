import { CommunityPage } from "components/community/community";
import { useRouter } from "next/router";

export default function CommunityPageWrapper() {
  const router = useRouter();

  const { community_name: name } = router.query;

  return <CommunityPage name={name} />;
}
