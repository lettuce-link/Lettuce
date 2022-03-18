import { InvertedMarker } from "./theme";

/**
 * A paper-like card with a shadow and everything
 */
export function Card({ children, background = "var(--background-strong)" }) {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          background: ${background};
          border-radius: var(--large-corner-round);

          box-shadow: var(--shadow-large);
        }
      `}</style>
    </div>
  );
}

export function SelectableBox({ children, isSelected, onSelect }) {
  const background = isSelected
    ? "var(--background-strong)"
    : "var(--background-weak)";

  return (
    <div onClick={onSelect}>
      {children}
      <style jsx>{`
        div {
          background: ${background};
          cursor: pointer;
          transition: background var(--transition-quick);
        }

        div:hover {
          background: var(--background-strong);
        }
      `}</style>
    </div>
  );
}

export function ErrorMessage({ children }) {
  return (
    <div className="ErrorMessage">
      <InvertedMarker>{children}</InvertedMarker>
      <style jsx>{`
        .ErrorMessage {
          background: var(--color-error-strong);
          padding: 16px;
          margin: 8px 0;

          border-radius: var(--small-corner-round);

          color: var(--foreground-inverted);
        }
      `}</style>
    </div>
  );
}
