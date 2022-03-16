import { useCommunity } from "api/community";
import { useCommunityPosts } from "api/posts";
import { Padding } from "atoms/layout";
import { AboutCard } from "components/community/about";
import { ChannelView } from "components/community/channel_view";
import { useRouter } from "next/router";

export default function CommunityPage() {
  const router = useRouter();

  const { community_name: name } = router.query;

  // @ts-ignore
  const { community, isLoading } = useCommunity(name);
  const infinitePosts = useCommunityPosts(name);

  return (
    <Padding padding="16px">
      <ChannelView
        communityView={community?.community_view}
        isLoading={isLoading}
        infinitePosts={infinitePosts}
      />
    </Padding>
  );
}
