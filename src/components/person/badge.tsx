import { Badge, SmallIcon } from "components/badge";
import { PersonSafe } from "lemmy-js-client";

export function PersonBadge({ person }: { person: PersonSafe }) {
  return (
    <Badge>
      <span className="PersonBadge-symbol">@</span>
      {person.name}

      <style jsx>{`
        .PersonBadge-symbol {
          opacity: var(--opacity-fade);
        }
      `}</style>
    </Badge>
  );
}
