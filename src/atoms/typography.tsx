export function H1({ children }) {
  return (
    <h1>
      {children}
      <style jsx>{`
        h1 {
          font: var(--font-heading);
          margin: 16px 0;
        }
      `}</style>
    </h1>
  );
}
