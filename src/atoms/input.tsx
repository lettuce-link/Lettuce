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
          border-radius: 4px;

          font: var(--font-body);

          width: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}

export function Submit({ value }) {
  return (
    <>
      <input className="Submit" type="submit" value={value} />
      <style jsx>{`
        .Submit {
          border: none;
          padding: 8px 16px;
          border-radius: 4px;

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
  return (
    <button className="LinkButton" onClick={onClick}>
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
        }
      `}</style>
    </button>
  );
}
