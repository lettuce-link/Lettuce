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

export function TextInput({ type = "text", name, value, setValue }) {
  return (
    <>
      <input
        className="TextInput"
        type={type}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <style jsx>{`
        .TextInput {
          border: none;
          background: var(--background-weak);
          padding: 8px;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

export function Submit({ value }) {
  return <input type="submit" value={value} />;
}
