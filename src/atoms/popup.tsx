import { useRef } from "react";
import { useClickAway } from "react-use";
import { RiMoreFill } from "react-icons/ri";
import { RevealButton } from "./input";

/**
 * Elements that trigger a popup on click should be wrapped in a PopupTarget.
 * The Popup itself should also be a child of PopupTarget.
 */
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
  /** Align the right side of the popup with the right side of the target */
  Right,
  /** Align the left side of the popup with the left side of the target */
  Left,
}

/**
 * A hovering absolutely-positioned Popup associated with its parent, PopupTarget.
 */
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

export function MoreButton({ onClick }) {
  return (
    <div className="MoreButton">
      <RevealButton onClick={onClick}>
        <RiMoreFill className="MoreButton-icon" />
      </RevealButton>
      <style jsx global>{`
        .MoreButton {
          // compensate for how vertically thin the icon is
          // margin: -6px 0;
        }

        .MoreButton-icon {
          // display: flex;
        }
      `}</style>
    </div>
  );
}
