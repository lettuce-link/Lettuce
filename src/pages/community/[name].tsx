import { useCommunity } from "api/community";
import { useCommunityPosts } from "api/posts";
import { AboutCard } from "components/community/about";
import { ChannelView } from "components/community/channel_view";
import { useRouter } from "next/router";

export default function CommunityPage() {
  const router = useRouter();

  // don't render anything on SSR
  // todo: improve
  if (!router.isReady) {
    return null;
  }

  const { name } = router.query;

  // @ts-ignore
  const { community, isLoading } = useCommunity(name);
  const infinitePosts = useCommunityPosts(name);

  return (
    <ChannelView
      community={community}
      isLoading={isLoading}
      infinitePosts={infinitePosts}
    />
  );
}
