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

export function Padding({ children }) {
  return (
    <div className="Padding">
      {children}
      <style jsx>{`
        .Padding {
          padding: 8px 16px;
        }
      `}</style>
    </div>
  );
}

export function WidthLimit({ children, centered = true }) {
  return (
    <div className="WidthLimit">
      {children}
      <style jsx>{`
        .WidthLimit {
          max-width: var(--small-content);

          ${centered && "margin: 0 auto"}
        }
      `}</style>
    </div>
  );
}
