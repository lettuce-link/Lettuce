import { useTrendingCommunities } from "api/communities";
import { H2, H3 } from "atoms/typography";
import { CommunityBadge } from "./community/badge";

export function TrendingCommunities() {
  const trending = useTrendingCommunities();

  if (!trending) {
    return null;
    // todo loading state
  }

  return (
    <>
      <H3>Trending Communities</H3>
      <ol>
        {trending.map((communityView) => (
          <li>
            <CommunityBadge
              key={communityView.community.id}
              community={communityView.community}
            />
          </li>
        ))}
      </ol>

      <style jsx>{`
        ol,
        li {
          display: block;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  );
}
