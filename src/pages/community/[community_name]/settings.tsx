import { CommunityModerationPage } from "components/community/settings";
import { useRouter } from "next/router";

export default function Settings() {
  const router = useRouter();

  const { community_name: name } = router.query;

  return <CommunityModerationPage name={name} />;
}
