export function Form({ children, onSubmit }) {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </Form>
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
