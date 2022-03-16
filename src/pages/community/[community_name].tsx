import { useCommunity } from "api/community";
import { useCommunityPosts } from "api/posts";
import { ChannelView } from "components/community/channel_view";
import { useScrollLimit } from "components/scroll_limit";
import { useRouter } from "next/router";

export default function CommunityPage() {
  useScrollLimit();

  const router = useRouter();

  const { community_name: name } = router.query;

  // @ts-ignore
  const { community, isLoading } = useCommunity(name);
  const infinitePosts = useCommunityPosts(name);

  return (
    <ChannelView
      communityView={community?.community_view}
      isLoading={isLoading}
      infinitePosts={infinitePosts}
    />
  );
}
