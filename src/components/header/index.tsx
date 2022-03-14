import { useLogout } from "api/auth";
import { useSite } from "api/site";
import { Button, Link } from "atoms/input";
import { Row, Column } from "atoms/layout";
import { PopupTarget, Popup, HorizontalAlign } from "atoms/popup";
import { PersonSafe } from "lemmy-js-client";
import Head from "next/head";
import { useState } from "react";

import { MenuButton } from "./menu";

export function Header() {
  const site = useSite()?.site;

  if (!site) {
    return null;
  }

  return (
    <header className="Header">
      <Head>
        <title>{site.site_view?.site.name}</title>
      </Head>
      <Row align="center">
        <MenuButton />
        <Name siteDetails={site.site_view?.site} />
      </Row>

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
        <Popup isOpen={isOpen} horizontalAlign={HorizontalAlign.Right}>
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
