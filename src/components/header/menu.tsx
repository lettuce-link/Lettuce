import { Link, RevealButton } from "atoms/input";
import { Column } from "atoms/layout";
import { PopupTarget, Popup, HorizontalAlign } from "atoms/popup";
import { useState } from "react";
import { RiMenuFill } from "react-icons/ri";

/**
 * Site-wide menu button
 */
export function MenuButton() {
  const [isOpen, setOpen] = useState(false);

  return (
    <PopupTarget setOpen={setOpen}>
      <RevealButton>
        <div className="MenuButton">
          <RiMenuFill />
        </div>
      </RevealButton>

      <Popup isOpen={isOpen} horizontalAlign={HorizontalAlign.Left}>
        <Menu />
      </Popup>

      <style jsx>{`
        .MenuButton {
          padding: 4px;
          display: flex;
        }
      `}</style>
    </PopupTarget>
  );
}

/**
 * The menu that opens when you click the menu icon.
 *
 * TODO: Currently only contains a link to create a new community. Add "my communities", "trending communities", "about", modlog, etc.
 */
function Menu() {
  return (
    <Column gap="8px" align="end">
      <Link href="/create_community">Create Community</Link>
    </Column>
  );
}
