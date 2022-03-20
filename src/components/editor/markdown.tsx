import { TextArea } from "atoms/input";
import { Column, Row } from "atoms/layout";

export function MarkdownEditor({
  contents,
  setContents,
  minHeight = "0",
  modeToggle,
}) {
  return (
    <div>
      <Column gap="4px">
        <Row align="end" justify="end" wrap>
          {modeToggle}
        </Row>

        <div className="wrapper">
          <TextArea value={contents} setValue={setContents} />
        </div>
      </Column>

      <style jsx>{`
        .wrapper {
          background: var(--background-weak);
          border-radius: var(--small-corner-round);

          padding: 8px;
        }
      `}</style>
    </div>
  );
}
