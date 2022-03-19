import { useCommunity } from "api/community";
import { useCommunityPosts } from "api/posts";
import { AboutCommunity, CommunityThumbnail } from "./about";
import { ChannelView } from "../channel_view";

/**
 * The community page, showing the posts in that community and info about it.
 */
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

  const AboutContent = () => (
    <AboutCommunity
      communityView={communityResponse?.community_view}
      moderators={communityResponse?.moderators}
      online={communityResponse?.online}
    />
  );

  return (
    <ChannelView
      aboutCard={aboutCard}
      AboutContent={AboutContent}
      infinitePosts={infinitePosts}
    />
  );
}
