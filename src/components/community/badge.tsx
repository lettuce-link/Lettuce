import { Badge, SmallIcon } from "components/badge";
import { CommunitySafe, CommunityView } from "lemmy-js-client";

export function CommunityBadge({ community }: { community: CommunitySafe }) {
  return (
    <Badge>
      <span className="CommunityBadge-symbol">!</span>
      {community.name}

      <style jsx>{`
        .CommunityBadge-symbol {
          opacity: var(--opacity-fade);
        }
      `}</style>
    </Badge>
  );
}
