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
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </form>
  );
}

export function TextInput({ type = "text", name, value, setValue }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function Submit({ value }) {
  return <input type="submit" value={value} />;
}
