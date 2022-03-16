/**
 * A small component that represents an entity (community, person, etc).
 * You have to put stuff inside.
 * @param param0
 * @returns
 */
export function Badge({ children }) {
  return (
    <span className="Badge">
      {children}
      <style jsx>{`
        .Badge {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          gap: 2px;

          font: var(--font-body);
          color: var(--foreground-weak);
        }
      `}</style>
    </span>
  );
}

// todo: actual icons
export function SmallIcon() {
  return (
    <span className="SmallIcon">
      <style jsx>{`
        .SmallIcon {
          width: 0.8em;
          height: 0.8em;
          background: var(--color-primary-strong);

          border-radius: 100%;

          // idk it just looks better
          position: relative;
          bottom: -1px;
        }
      `}</style>
    </span>
  );
}
