import { useRef } from "react";
import { useClickAway } from "react-use";

export function PopupTarget({ children, setOpen }) {
  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));

  return (
    <div
      className="PopupTarget"
      ref={ref}
      onClick={() => setOpen((isOpen) => !isOpen)}
    >
      {children}
      <style jsx>{`
        .PopupTarget {
          position: relative;
        }
      `}</style>
    </div>
  );
}

export enum HorizontalAlign {
  Right,
  Left,
}

export function Popup({ children, isOpen, horizontalAlign }) {
  return (
    <div className="Popup">
      {children}
      <style jsx>{`
        .Popup {
          display: ${isOpen ? "block" : "none"};

          position: absolute;

          ${horizontalAlign === HorizontalAlign.Right
            ? `right: 0;`
            : `left: 0;`}

          top: calc(100% + 8px);

          background: var(--background-strong);
          border-radius: var(--large-corner-round);

          box-shadow: var(--shadow-large);

          padding: 16px;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
