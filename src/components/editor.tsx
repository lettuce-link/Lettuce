import { Editor, EditorState, RichUtils } from "draft-js";
import { useCallback, useMemo, useState } from "react";
import { stateToMarkdown } from "draft-js-export-markdown";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { Column, Padding, Row } from "atoms/layout";
import { RevealButton, RevealToggleButton, TextArea } from "atoms/input";
import {
  RiBold,
  RiCodeFill,
  RiItalic,
  RiStrikethrough,
  RiStrikethrough2,
} from "react-icons/ri";
import { MultiStateButton } from "atoms/toggle";

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
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    if (initialMarkdown) {
      const content = stateFromMarkdown(initialMarkdown);
      return EditorState.createWithContent(content);
    } else {
      return EditorState.createEmpty();
    }
  });
  const [markdown, setMarkdown] = useState(initialMarkdown || "");

  const toggleMode = useCallback(() => {
    setIsMarkdown((isMarkdown) => {
      if (isMarkdown) {
        const content = stateFromMarkdown(markdown);
        const state = EditorState.createWithContent(content);
        setEditorState(state);
      } else {
        const markdown = stateToMarkdown(editorState.getCurrentContent());
        setMarkdown(markdown);
      }

      return !isMarkdown;
    });
  }, [editorState, markdown]);

  const isEmpty = !editorState.getCurrentContent().hasText();

  // todo: we're losing the nice transition bc react rerenders this when the parent node is switched out.
  // the solution is called "reparenting" i think? apparently there's a solution using portals. anwyay im not about to spend 4h making this transition work.
  const toggle = (
    <ModeToggle isMarkdown={isMarkdown} toggleMarkdown={toggleMode} />
  );

  const editorProps = {
    editorState,
    setEditorState,
    markdown,
    setMarkdown,
    isMarkdown,
    modeToggle: toggle,
  };

  function getMarkdown() {
    return stateToMarkdown(editorState.getCurrentContent());
  }

  function clearContents() {
    setEditorState(EditorState.createEmpty());
  }

  return { editorProps, getMarkdown, isEmpty, clearContents };
}

export function LettuceEditor({
  editorState,
  setEditorState,
  markdown,
  setMarkdown,
  minHeight = "0",
  isMarkdown,
  modeToggle,
}) {
  return isMarkdown ? (
    <MarkdownEditor
      contents={markdown}
      setContents={setMarkdown}
      modeToggle={modeToggle}
    />
  ) : (
    <DraftEditor
      editorState={editorState}
      setEditorState={setEditorState}
      minHeight={minHeight}
      modeToggle={modeToggle}
    />
  );
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

const EDIT_MODES = ["Editor", "Markdown"];
function ModeToggle({ isMarkdown, toggleMarkdown }) {
  return (
    <Row align="center" gap="8px">
      Mode:
      <MultiStateButton
        options={EDIT_MODES}
        currentIndex={isMarkdown ? 1 : 0}
        onClick={toggleMarkdown}
        onMouseDown={preventFocusLoss}
        secondary
        compact
      />
    </Row>
  );
}

/**
 * Displays an WYSIWYG editor.
 */
function DraftEditor({
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

function MarkdownEditor({
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
