export function Column({ children, gap = "32px", align = "stretch" }) {
  return (
    <div className="Column">
      {children}
      <style jsx>{`
        .Column {
          display: flex;
          flex-direction: column;

          align-items: ${align};

          gap: ${gap};
        }
      `}</style>
    </div>
  );
}

export function Row({
  children,
  gap = "16px",
  justify = "start",
  align = "baseline",
  wrap = false,
}) {
  return (
    <div className="Row">
      {children}
      <style jsx>{`
        .Row {
          display: flex;
          flex-direction: row;
          justify-content: ${justify};

          align-items: ${align};

          gap: ${gap};

          ${wrap ? "flex-wrap: wrap;" : ""}
        }
      `}</style>
    </div>
  );
}

export function LargePadding({ children }) {
  return (
    <div className="LargePadding">
      {children}
      <style jsx>{`
        .LargePadding {
          padding: 64px;
        }
      `}</style>
    </div>
  );
}

export function Padding({ children, padding = "16px" }) {
  return (
    <div className="Padding">
      {children}
      <style jsx>{`
        .Padding {
          padding: ${padding};
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}

/**
 * Limits the width of the contents, and centers the element.
 */
export function WidthLimit({
  children,
  centered = true,
  limit = "var(--small-content)",
}) {
  return (
    <div className="WidthLimit">
      {children}
      <style jsx>{`
        .WidthLimit {
          max-width: ${limit};

          ${centered && "margin: 0 auto"}
        }
      `}</style>
    </div>
  );
}
