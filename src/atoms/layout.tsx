import { DesktopStyle, MobileStyle } from "./theme";

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

/**
 * Gives some breathing space on desktop.
 * On mobile, provides a small padding.
 */
export function ComfortPadding({ children }) {
  return (
    <div className="LargePadding">
      {children}
      <DesktopStyle>{`
        .LargePadding {
          padding: 64px;
        }
      `}</DesktopStyle>
      <MobileStyle>{`
        .LargePadding {
          padding: 16px;
        }
      `}</MobileStyle>
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

/**
 * A container for the main content when it is relatively small.
 * On mobile, it will take up the entire screen.
 * On desktop, it will be presented as a centered card.
 */
export function FocusContent({ children, limit = "var(--small-content)" }) {
  return (
    <div className="FocusCard-wrapper">
      <WidthLimit limit={limit}>
        <div className="FocusCard-card">{children}</div>
      </WidthLimit>

      <MobileStyle>{`
        .FocusCard-wrapper {
        }
      `}</MobileStyle>

      <DesktopStyle>{`
      .FocusCard-wrapper {
        padding: 32px 16px;
        background: var(--background-weak);
      }

      .FocusCard-card {
        background: var(--background-strong);
        border-radius: var(--large-corner-round);

        box-shadow: var(--shadow-large);
      }
    `}</DesktopStyle>
    </div>
  );
}
