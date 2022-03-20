import { RevealToggleButton } from "atoms/input";
import { Column, Padding, Row } from "atoms/layout";
import { Editor, EditorState, RichUtils } from "draft-js";
import { useCallback } from "react";
import { RiBold, RiCodeFill, RiItalic } from "react-icons/ri";
import { preventFocusLoss } from "./util";

const STYLE_BOLD = "BOLD";
const STYLE_ITALIC = "ITALIC";
const STYLE_CODE = "CODE";

function useStyleControl(editorState, setEditorState, styleName) {
  const currentStyle = editorState.getCurrentInlineStyle();

  const hasStyle = currentStyle.includes(styleName);

  const toggleStyle = useCallback(() => {
    setEditorState((editorState) => {
      return RichUtils.toggleInlineStyle(editorState, styleName);
    });
  }, [setEditorState, styleName]);

  return [hasStyle, toggleStyle];
}

function InlineStyleControls({
  editorState,
  setEditorState,
}: {
  editorState: EditorState;
  setEditorState;
}) {
  const [hasBold, toggleBold] = useStyleControl(
    editorState,
    setEditorState,
    STYLE_BOLD
  );
  const [hasItalic, toggleItalic] = useStyleControl(
    editorState,
    setEditorState,
    STYLE_ITALIC
  );
  const [hasCode, toggleCode] = useStyleControl(
    editorState,
    setEditorState,
    STYLE_CODE
  );

  return (
    <Row gap="2px">
      <StyleButton
        name="Bold"
        isSelected={hasBold}
        onClick={toggleBold}
        Icon={RiBold}
      />
      <StyleButton
        name="Italic"
        isSelected={hasItalic}
        onClick={toggleItalic}
        Icon={RiItalic}
      />
      {/* <StyleButton
        name="Strike"
        isSelected={undefined}
        onClick={undefined}
        Icon={RiStrikethrough2}
      /> */}
      <StyleButton
        name="Code"
        isSelected={hasCode}
        onClick={toggleCode}
        Icon={RiCodeFill}
      />
    </Row>
  );
}

function StyleButton({ name, isSelected, onClick, Icon }) {
  return (
    <>
      <label className="StyleButton-label">
        <RevealToggleButton
          isSelected={isSelected}
          onClick={onClick}
          onMouseDown={preventFocusLoss}
        >
          <Padding padding="2px">
            <Icon />
          </Padding>
        </RevealToggleButton>
      </label>

      <style jsx>{`
        .StyleButton-label {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;

          font: var(--font-body);
          font-size: var(--size-small);
          color: var(--foreground-weak);
        }
      `}</style>
    </>
  );
}

/**
 * Displays an WYSIWYG editor.
 */
export function DraftEditor({
  editorState,
  setEditorState,
  minHeight = "0",
  modeToggle,
}) {
  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return "handled";
    }

    return "not-handled";
  }
  return (
    <div>
      <Column gap="4px">
        <Row align="end" justify="space-between" wrap>
          <InlineStyleControls
            editorState={editorState}
            setEditorState={setEditorState}
          />
          {modeToggle}
        </Row>

        <div className="wrapper">
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </Column>

      <style jsx>{`
        .wrapper {
          background: var(--background-weak);
          border-radius: var(--small-corner-round);

          padding: 8px;
        }
      `}</style>
      <style jsx global>{`
        .public-DraftEditor-content {
          min-height: ${minHeight};
        }
      `}</style>
    </div>
  );
}
