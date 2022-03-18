import { PersonSafe } from "lemmy-js-client";

/**
 * A non-interactive mention of a person.
 */
export function PersonMention({ person }: { person: PersonSafe }) {
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
