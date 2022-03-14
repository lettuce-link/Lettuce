import InnerLink from "next/link";
import { useIsInverted } from "./theme";

export function Form({ children, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
}

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
        }
      `}</style>
    </>
  );
}

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

          ${disabled
            ? `
            color: var(--foreground-weak);
            background: var(--background-weak);
            `
            : `
            color: var(--foreground-inverted);
            background: var(--color-primary-strong);
          `};

          font: var(--font-body);
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export function Button({ children, onClick }) {
  return (
    <>
      <button className="Button" onClick={onClick}>
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
      `}</style>
    </>
  );
}

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
