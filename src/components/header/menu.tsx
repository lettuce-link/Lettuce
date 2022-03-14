import { Link } from "atoms/input";
import { Column } from "atoms/layout";
import { PopupTarget, Popup, HorizontalAlign } from "atoms/popup";
import { useState } from "react";
import { RiMenuFill } from "react-icons/ri";

export function MenuButton() {
  const [isOpen, setOpen] = useState(false);

  return (
    <PopupTarget setOpen={setOpen}>
      <div className="MenuButton">
        <RiMenuFill />
      </div>
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

function Menu() {
  return (
    <Column gap="8px" align="end">
      <Link href="create_community">Create Community</Link>
    </Column>
  );
}
