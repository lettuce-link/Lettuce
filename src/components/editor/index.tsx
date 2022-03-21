import { Row } from "atoms/layout";
import { MultiStateButton } from "atoms/toggle";
import { Editor, EditorState } from "draft-js";
import { stateToMarkdown } from "draft-js-export-markdown";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { useCallback, useMemo, useState } from "react";
import { MarkdownEditor } from "./markdown";
import { styleMap } from "./style";
import { preventFocusLoss } from "./util";
import { DraftEditor } from "./wysiwyg";

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

  const editorProps = {
    editorState,
    setEditorState,
    markdown,
    setMarkdown,
    isMarkdown,
    toggleMode,
  };

  function getMarkdown() {
    return stateToMarkdown(editorState.getCurrentContent());
  }

  function clearContents() {
    setEditorState(EditorState.createEmpty());
  }

  return { editorProps, getMarkdown, isEmpty, clearContents };
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

export function LettuceEditor({
  editorState,
  setEditorState,
  markdown,
  setMarkdown,
  minHeight = "0",
  isMarkdown,
  toggleMode,
}) {
  // todo: we're losing the nice transition on the ModeToggle bc react rerenders this when the parent node is switched out.
  // the solution is called "reparenting" i think? apparently there's a solution using portals. anwyay im not about to spend 4h making this transition work.
  return (
    <HybridEditor
      editorState={editorState}
      setEditorState={setEditorState}
      markdown={markdown}
      setMarkdown={setMarkdown}
      minHeight={minHeight}
      isMarkdown={isMarkdown}
      modeToggle={
        <ModeToggle isMarkdown={isMarkdown} toggleMarkdown={toggleMode} />
      }
    />
  );
}

function HybridEditor({
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

  return (
    <Editor customStyleMap={styleMap} editorState={editorState} readOnly />
  );
}
