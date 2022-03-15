import { InvertedMarker } from "./theme";

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
