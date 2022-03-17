import { useCommunity } from "api/community";
import { useCommunityPosts } from "api/posts";
import { AboutCommunity, CommunityThumbnail } from "./about";
import { ChannelView } from "./channel_view";

export function CommunityPage({ name }) {
  const { communityResponse: communityResponse, isLoading } =
    useCommunity(name);
  const infinitePosts = useCommunityPosts(name);

  if (!communityResponse) {
    // todo render loading
    return null;
  }

  const aboutCard = (
    <CommunityThumbnail
      community={communityResponse?.community_view?.community}
    />
  );

  const aboutContent = (
    <AboutCommunity
      communityView={communityResponse?.community_view}
      moderators={communityResponse?.moderators}
      online={communityResponse?.online}
    />
  );

  return (
    <ChannelView
      aboutCard={aboutCard}
      aboutContent={aboutContent}
      isLoading={isLoading}
      infinitePosts={infinitePosts}
    />
  );
}
