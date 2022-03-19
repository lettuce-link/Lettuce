import { Editor, EditorState, RichUtils } from "draft-js";
import { useCallback, useMemo, useState } from "react";
import { stateToMarkdown } from "draft-js-export-markdown";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { Column, Padding, Row } from "atoms/layout";
import { RevealButton, RevealToggleButton } from "atoms/input";
import {
  RiBold,
  RiCodeFill,
  RiItalic,
  RiStrikethrough,
  RiStrikethrough2,
} from "react-icons/ri";

/**
 * # About the editor & cms stuff
 *
 * We use draft-js to display a what-you-see-is-what-you-get editor for post and comment contents.
 *
 * Since we want to be able to integrate with other instances (federation) and they use markdown for content, we must serialize the contents to Markdown and deserialize when we want to render them.
 *
 * The draft-js-export-markdown and draft-js-import-markdown libraries provide this, but I suspect they are a bit buggy (haven't looked into this too much). Might need to improve this in the future (custom converter?). But not even sure if a perfect conversion is possible.
 */

/**
 * A hook that manages editor state.
 * Returns { Editor, getMarkdown, isEmpty, clearContents } where:
 * - Editor: the component to render
 * - getMarkdown: a function for converting contents to markdown
 * - isEmpty: true iff there is no text inside
 * - clearContents: empty editor contents
 */
export function useEditor(initialMarkdown = null) {
  const [editorState, setEditorState] = useState(() => {
    if (initialMarkdown) {
      const content = stateFromMarkdown(initialMarkdown);
      return EditorState.createWithContent(content);
    } else {
      return EditorState.createEmpty();
    }
  });

  const isEmpty = !editorState.getCurrentContent().hasText();

  const Editor = ({ minHeight = "0" }) => (
    <DraftEditor
      editorState={editorState}
      setEditorState={setEditorState}
      minHeight={minHeight}
    />
  );

  function getMarkdown() {
    return stateToMarkdown(editorState.getCurrentContent());
  }

  function clearContents() {
    setEditorState(EditorState.createEmpty());
  }

  return { Editor, getMarkdown, isEmpty, clearContents };
}

/**
 * Renders the specified markdown as read-only content
 */
export function ReadonlyEditor({ markdown }) {
  const editorState = useMemo(() => {
    const content = stateFromMarkdown(markdown);
    return EditorState.createWithContent(content);
  }, [markdown]);

  return <Editor editorState={editorState} readOnly />;
}

/**
 * Displays an WYSIWYG editor.
 *
 * TODO: currently, only basic formatting can be applied with keyboard commands. We probably want a dedicated "actions" toolbar for formatting text.
 */
function DraftEditor({ editorState, setEditorState, minHeight = "0" }) {
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
      <Column gap="2px">
        <InlineStyleControls
          editorState={editorState}
          setEditorState={setEditorState}
        />

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

function preventFocusLoss(event) {
  event.preventDefault();
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
