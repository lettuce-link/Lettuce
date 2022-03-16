import { Badge, SmallIcon } from "components/badge";
import { CommunitySafe, CommunityView } from "lemmy-js-client";

export function CommunityBadge({ community }: { community: CommunitySafe }) {
  return (
    <Badge>
      <SmallIcon />
      {community.name}
    </Badge>
  );
}
