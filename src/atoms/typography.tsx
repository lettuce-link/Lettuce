export function H1({ children }) {
  return (
    <h1>
      {children}
      <style jsx>{`
        h1 {
          font: var(--font-heading);
          margin: 8px 0;
        }
      `}</style>
    </h1>
  );
}
