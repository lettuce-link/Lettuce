export function Column({ children, gap = "32px" }) {
  return (
    <div className="Column">
      {children}
      <style jsx>{`
        .Column {
          display: flex;
          flex-direction: column;

          gap: ${gap};
        }
      `}</style>
    </div>
  );
}

export function Row({ children, gap = "16px", justify = "start" }) {
  return (
    <div className="Row">
      {children}
      <style jsx>{`
        .Row {
          display: flex;
          flex-direction: row;
          justify-content: ${justify};
          align-items: baseline;

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
