export function H1({ children }) {
  return (
    <h1>
      {children}
      <style jsx>{`
        h1 {
          font-family: var(--font-heading);
        }
      `}</style>
    </h1>
  );
}
