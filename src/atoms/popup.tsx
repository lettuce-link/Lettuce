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

export function Popup({ children, isOpen }) {
  return (
    <div className="Popup">
      {children}
      <style jsx>{`
        .Popup {
          display: ${isOpen ? "block" : "none"};

          position: absolute;
          right: 0;

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
