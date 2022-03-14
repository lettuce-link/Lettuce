import { PersonSafe } from "lemmy-js-client";
import { useState } from "react";
import { useLogout } from "../api/auth";
import { useSite } from "../api/site";
import { Button, Link } from "../atoms/input";
import { Column } from "../atoms/layout";
import { Popup, PopupTarget } from "../atoms/popup";

export function Header() {
  const site = useSite()?.site;
  console.log(site);

  if (!site) {
    return null;
  }

  return (
    <header className="Header">
      <Name siteDetails={site.site_view?.site} />

      <ToolBar person={site.my_user?.local_user_view.person} />

      <style jsx>{`
        .Header {
          padding: 16px;

          background: var(--background-strong);
          box-shadow: var(--shadow-large);

          display: flex;
          justify-content: space-between;
          align-items: baseline;
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

function ToolBar({ person }: { person?: PersonSafe }) {
  console.log(person);

  return (
    <div className="ToolBar">
      {person ? <PersonBadge person={person} /> : <AuthLink />}
      <style jsx>{``}</style>
    </div>
  );
}

function PersonBadge({ person }: { person: PersonSafe }) {
  const [isOpen, setOpen] = useState(false);
  const logout = useLogout();

  return (
    <div className="Person">
      <PopupTarget setOpen={setOpen}>
        {person.name}
        <Popup isOpen={isOpen}>
          <Column gap="8px" align="end">
            <Link href="#">Profile</Link>
            <Link href="#">Settings</Link>
            <Button onClick={logout}>Log Out</Button>
          </Column>
        </Popup>
      </PopupTarget>
    </div>
  );
}

function AuthLink() {
  return (
    <div className="AuthLink">
      <Link href="/enter">Login</Link>
    </div>
  );
}
