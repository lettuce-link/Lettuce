import { useLogout } from "api/auth";
import { useMe, useSite } from "api/site";
import { Button, Link, RevealButton } from "atoms/input";
import { Row, Column, Padding } from "atoms/layout";
import { PopupTarget, Popup, HorizontalAlign } from "atoms/popup";
import { PersonMention } from "components/person/badge";
import { PersonSafe } from "lemmy-js-client";
import Head from "next/head";
import { useState } from "react";

import { MenuButton } from "./menu";

/**
 * The app header (sticky thing at top of page)
 */
export function Header() {
  const site = useSite();

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
        <Link href="/">
          <Name siteDetails={site.site_view?.site} />
        </Link>
      </Row>

      <ToolBar />

      <style jsx>{`
        .Header {
          padding: 16px;

          background: var(--background-strong);
          box-shadow: var(--shadow-large);

          display: flex;
          justify-content: space-between;
          align-items: center;

          z-index: 100;
          position: sticky;
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
          font: var(--font-heading-light);
          color: var(--foreground-strong);
        }
      `}</style>
    </div>
  );
}

/**
 * User toolbar.
 * Currently only shows the username/login link
 *
 * TODO: notifications, moderation button (?) etc.
 */
function ToolBar() {
  const me = useMe();
  const person = me?.local_user_view.person;

  return (
    <div className="ToolBar">
      {person ? <UserMenu person={person} /> : <AuthLink />}
      <style jsx>{``}</style>
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

function UserMenu({ person }: { person: PersonSafe }) {
  const [isOpen, setOpen] = useState(false);
  const logout = useLogout();

  return (
    <div className="Person">
      <PopupTarget setOpen={setOpen}>
        <RevealButton>
          <Padding padding="8px 16px">
            <PersonMention person={person} />
          </Padding>
        </RevealButton>
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
