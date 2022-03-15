import { RevealButton } from "atoms/input";
import { Column } from "atoms/layout";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";

export function VerticalVote({}) {
  return (
    <Column gap="0" align="center">
      <UpDoot onClick={0} />
      <Score>42</Score>
      <DownDoot onClick={1} />
    </Column>
  );
}

function Score({ children }) {
  return (
    <span className="Score">
      {children}
      <style jsx>{`
        .Score {
          line-height: 1;
        }
      `}</style>
    </span>
  );
}

function UpDoot({ onClick }) {
  return (
    <RevealButton onClick={onClick}>
      <RiArrowUpSFill />
    </RevealButton>
  );
}

function DownDoot({ onClick }) {
  return (
    <RevealButton onClick={onClick}>
      <RiArrowDownSFill />
    </RevealButton>
  );
}
