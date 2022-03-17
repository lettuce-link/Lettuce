import { PersonSafe } from "lemmy-js-client";

export function PersonBadge({ person }: { person: PersonSafe }) {
  return (
    <span>
      <span className="PersonBadge-symbol">@</span>
      {person.name}

      <style jsx>{`
        span {
          color: var(--foreground-weak);
        }

        .PersonBadge-symbol {
          opacity: var(--opacity-fade);
        }
      `}</style>
    </span>
  );
}
