import { useSite } from "../api/site";

export function Header() {
  const site = useSite()?.site;

  if (!site) {
    return null;
  }

  const siteDetails = site.site_view?.site;

  return (
    <header className="Header">
      <Name siteDetails={siteDetails} />

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

function Name({ siteDetails }) {
  if (!siteDetails) {
    return null;
  }

  return (
    <div className="Name">
      {siteDetails.name}
      <style jsx>{`
        .Name {
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
