export function Card({ children }) {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          background: var(--background-strong);
          border-radius: 8px;

          box-shadow: 0 5px 23px 0px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
