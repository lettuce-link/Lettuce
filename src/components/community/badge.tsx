import { RevealButton } from "atoms/input";
import { CommunitySafe } from "lemmy-js-client";
import Link from "next/link";
import { communityLink } from "util/link";

/**
 * A non-interactive community mention.
 */
export function CommunityMention({ community }: { community: CommunitySafe }) {
  return (
    <span>
      <span className="CommunityBadge-symbol">!</span>
      {community.name}

      <style jsx>{`
        .CommunityBadge-symbol {
          opacity: var(--opacity-fade);
        }

        span {
          color: var(--foreground-weak);
        }
      `}</style>
    </span>
  );
}

/**
 * A community badge that links to the community when clicked
 */
export function CommunityBadge({ community }: { community: CommunitySafe }) {
  return (
    <Link href={communityLink(community.name)}>
      <RevealButton inline>
        <CommunityMention community={community} />
      </RevealButton>
    </Link>
  );
}
