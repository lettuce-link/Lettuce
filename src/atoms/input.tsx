import InnerLink from "next/link";
import { useIsInverted } from "./theme";

// just a regular form wrapper
export function Form({ children, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {children}
      <style jsx>{`
        form {
          margin: 8px 0;
        }
      `}</style>
    </form>
  );
}

/**
 * A Field container – the provided prompt will be shown as an accessible field label, and you should provide children for the field input, validation messages, advice, etc.
 */
export function Field({ prompt, children }) {
  return (
    <label>
      <div className="Field-prompt">{prompt}</div>
      {children}

      <style jsx>{`
        .Field-prompt {
          color: var(--foreground-weak);
          font: var(--font-body);
          font-size: var(--size-small);

          margin: 0 0 4px;
        }
      `}</style>
    </label>
  );
}

/**
 * Your regular text input field. A different input type may be provided with `type`.
 */
export function TextInput({ type = "text", value, setValue }) {
  return (
    <>
      <input
        className="TextInput"
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <style jsx>{`
        .TextInput {
          border: none;
          background: var(--background-weak);
          padding: 8px;
          border-radius: var(--small-corner-round);

          font: var(--font-body);

          width: 100%;
          box-sizing: border-box;

          margin: 0 0 4px;
        }
      `}</style>
    </>
  );
}

/**
 * Submit button.
 */
export function Submit({ value, disabled = false }) {
  return (
    <>
      <input
        className="Submit"
        type="submit"
        value={value}
        disabled={disabled}
      />
      <style jsx>{`
        .Submit {
          border: none;
          padding: 8px 16px;
          border-radius: var(--small-corner-round);

          font: var(--font-body);
          cursor: pointer;

          ${disabled
            ? `
            color: var(--foreground-weak);
            background: var(--background-weak);
            `
            : `
            color: var(--foreground-inverted);
            background: var(--color-primary-strong);
          `};
        }
      `}</style>
      <style jsx global>{`
        // if it's not global, the transition only works one way for some reason
        // i blame styled-jsx
        .Submit {
          transition: background var(--transition-quick),
            color var(--transition-quick);
        }
      `}</style>
    </>
  );
}

export function Button({ children, onClick, icon = null }) {
  return (
    <>
      <button className="Button" onClick={onClick}>
        {icon}
        {children}
      </button>
      <style jsx>{`
        .Button {
          border: none;
          padding: 8px 16px;
          border-radius: var(--small-corner-round);

          color: var(--foreground-inverted);
          background: var(--color-primary-strong);

          font: var(--font-body);
          cursor: pointer;
        }

        // welcome to css
        button :global(svg) {
          margin-bottom: -6px;
          margin-right: 4px;
        }
      `}</style>
    </>
  );
}

/**
 * A quiet button that does its best not to attract too much attention
 */
export function ShyButton({ children, onClick }) {
  return (
    <RevealButton onClick={onClick}>
      <span className="ShyButton-contents">{children}</span>

      <style jsx>{`
        .ShyButton-contents {
          padding: 2px 4px;

          font: var(--font-body);
          color: var(--foreground-strong);
          font-size: var(--size-small);

          cursor: pointer;

          // actual height ends up pretty close anyway
          // align with icons to keep things consistent
          min-height: var(--size-icon);
          box-sizing: border-box;
        }

        .ShyButton-contents:hover {
          color: var(--foreground-strong);
        }
      `}</style>
    </RevealButton>
  );
}

/**
 * A button that looks like a link.
 * Should only be used where a link would make sense (i.e. navigation) but a button is required for technical reasons.
 */
export function LinkButton({ children, onClick }) {
  const isInverted = useIsInverted();

  return (
    <a
      className="LinkButton"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
      <style jsx>{`
        .LinkButton {
          border: none;
          background: none;
          padding: 0;

          font: var(--font-body);
          font-size: inherit;
          color: var(--color-primary-strong);

          cursor: pointer;

          ${isInverted
            ? `
          color: var(--color-primary-inverted);

          background-image: linear-gradient(to bottom, rgba(255,255,255,0.5) 33%, transparent 33%);
          background-position: 0 1.2em;
          background-repeat: repeat-x;
          background-size: 2px 6px;
          `
            : ""}
        }
      `}</style>
    </a>
  );
}

/**
 * Styled link
 */
export function Link({ children, href }) {
  const isInverted = useIsInverted();

  return (
    <InnerLink href={href}>
      <span className="LinkButton">
        {children}
        <style jsx>{`
          .LinkButton {
            border: none;
            background: none;
            padding: 0;

            font: var(--font-body);
            font-size: inherit;
            color: var(--color-primary-strong);

            cursor: pointer;

            ${isInverted
              ? `
            color: var(--color-primary-inverted);

            background-image: linear-gradient(to bottom, rgba(255,255,255,0.5) 33%, transparent 33%);
            background-position: 0 1.2em;
            background-repeat: repeat-x;
            background-size: 2px 6px;
            `
              : ""}
          }
        `}</style>
      </span>
    </InnerLink>
  );
}

function noop() {}

/**
 * A button that is rendered as regular text, until it is hovered.
 * On hover, a grey outline appears to hint that this is a clickable button.
 * This should only be used in contexts where either:
 * - it is clear from the context and text that this element represents an action (e.g. a "reply" button under a comment)
 * - it is not critical that the user immediately knows that the element is interactive (e.g. community badge links to community page, but this is not critical functionality and may be discovered over time)
 */
export function RevealButton({ children, onClick = noop, inline = false }) {
  return (
    <button className="RevealButton" onClick={onClick}>
      {children}
      <style jsx>{`
        .RevealButton {
          border: none;
          font: inherit;

          display: ${inline ? "inline-flex" : "flex"};
          background: transparent;

          border-radius: var(--small-corner-round);
          transition: background var(--transition-quick);

          cursor: pointer;
        }

        .RevealButton:hover {
          background: var(--background-transparent-dark);
        }
      `}</style>
    </button>
  );
}
