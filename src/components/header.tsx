export function Header() {
  return (
    <header className="Header">
      <Logo />

      <style jsx>{`
        .Header {
          padding: 16px;

          background: var(--background-strong);
          box-shadow: var(--shadow-large);
        }
      `}</style>
    </header>
  );
}

function Logo() {
  return (
    <div className="Logo">
      Lettuce
      <style jsx>{`
        .Logo {
          font: var(--font-heading);
        }
      `}</style>
    </div>
  );
}

function ToolBar() {
  return (
    <div className="ToolBar">
      <style jsx>{``}</style>
    </div>
  );
}
