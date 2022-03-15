import { useIsInverted } from "./theme";

export function H1({ children }) {
  return (
    <h1>
      {children}
      <style jsx>{`
        h1 {
          font: var(--font-heading);
          margin: 16px 0;
        }
      `}</style>
    </h1>
  );
}

export function H2({ children }) {
  return (
    <h1>
      {children}
      <style jsx>{`
        h1 {
          font: var(--font-heading);
          font-size: var(--size-medium);
          margin: 8px 0;
        }
      `}</style>
    </h1>
  );
}

export function Advice({ children }) {
  return (
    <p className="Advice">
      {children}
      <style jsx>{`
        .Advice {
          font: var(--font-body);
          color: var(--foreground-weak);
          margin: 8px 0;
        }
      `}</style>
    </p>
  );
}

export function Info({ children }) {
  const isInverted = useIsInverted();

  return (
    <p className="Info">
      {children}
      <style jsx>{`
        .Info {
          font: var(--font-body);
          color: ${isInverted
            ? "var(--foreground-inverted)"
            : "var(--foreground-strong)"};
          margin: 0;
        }
      `}</style>
    </p>
  );
}
