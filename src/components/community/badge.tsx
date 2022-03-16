import { Badge, SmallIcon } from "components/badge";
import { CommunityView } from "lemmy-js-client";

export function CommunityBadge({
  communityView,
}: {
  communityView: CommunityView;
}) {
  return (
    <Badge>
      <SmallIcon />
      {communityView.community.name}
    </Badge>
  );
}
