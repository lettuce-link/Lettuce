import { CommunityView } from "lemmy-js-client";

export function CommunityBadge({
  communityView,
}: {
  communityView: CommunityView;
}) {
  return <span>{communityView.community.name}</span>;
}
