import { useSite } from "api/site";
import { Row } from "atoms/layout";
import Link from "next/link";
import { MenuButton } from "./header/menu";

export function FooterNav() {
  return (
    <header className="FooterNav">
      <Row align="center">footer</Row>

      <style jsx>{`
        .FooterNav {
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
