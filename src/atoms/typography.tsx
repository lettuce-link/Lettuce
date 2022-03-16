import React from "react";
import { Row } from "./layout";
import { useIsInverted } from "./theme";

export function H1({ children, margin = "16px 0" }) {
  return (
    <h1>
      {children}
      <style jsx>{`
        h1 {
          font: var(--font-heading);
          margin: ${margin};
        }
      `}</style>
    </h1>
  );
}

export function H2({ children }) {
  return (
    <h2>
      {children}
      <style jsx>{`
        h2 {
          font: var(--font-heading-light);
          margin: 8px 0;
        }
      `}</style>
    </h2>
  );
}

export function H3({ children }) {
  return (
    <h3>
      {children}
      <style jsx>{`
        h3 {
          font: var(--font-heading);
          font-size: var(--size-large);
          margin: 8px 0;
        }
      `}</style>
    </h3>
  );
}

export function SecondaryInfo({ children }) {
  return (
    <p className="SecondaryInfo">
      {children}
      <style jsx>{`
        .SecondaryInfo {
          font: var(--font-body);
          color: var(--foreground-weak);
          margin: 0;
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

export function InfoList({ children }) {
  return (
    <span className="InfoList">
      <Row gap="4px">
        {React.Children.map(children, (child, index) => {
          const needsSeparator = index !== 0;

          return (
            <>
              {needsSeparator && (
                <span key={`dot-${index}`} className="InfoList-dot">
                  {" "}
                  &bull;{" "}
                </span>
              )}
              {child}
            </>
          );
        })}
      </Row>

      <style jsx>{`
        .InfoList {
          font-size: var(--size-small);
        }

        .InfoList-dot {
          color: var(--foreground-weak);
        }
      `}</style>
    </span>
  );
}
