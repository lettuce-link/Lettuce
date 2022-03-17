import { useCommunity } from "api/community";
import { useCommunityPosts } from "api/posts";
import { ChannelView } from "./channel_view";

export function CommunityPage({ name }) {
  const { communityResponse: communityResponse, isLoading } =
    useCommunity(name);
  const infinitePosts = useCommunityPosts(name);

  return (
    <ChannelView
      communityView={communityResponse?.community_view}
      moderators={communityResponse?.moderators}
      online={communityResponse?.online}
      isLoading={isLoading}
      infinitePosts={infinitePosts}
    />
  );
}
