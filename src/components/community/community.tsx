import { useCommunity } from "api/community";
import { useCommunityPosts } from "api/posts";
import { ChannelView } from "./channel_view";

export function CommunityPage({ name }) {
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
