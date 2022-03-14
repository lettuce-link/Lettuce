import { InvertedMarker } from "./theme";

export function Card({ children }) {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          background: var(--background-strong);
          border-radius: 8px;

          box-shadow: 0 5px 23px 0px rgba(0, 0, 0, 0.1);
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
