import { Badge, SmallIcon } from "components/badge";
import { PersonSafe } from "lemmy-js-client";

export function PersonBadge({ person }: { person: PersonSafe }) {
  return (
    <Badge>
      <SmallIcon />
      {person.name}
    </Badge>
  );
}
