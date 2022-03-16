import { Editor, EditorState, RichUtils } from "draft-js";
import { useMemo, useState } from "react";
import { stateToMarkdown } from "draft-js-export-markdown";
import { stateFromMarkdown } from "draft-js-import-markdown";

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

export function ReadonlyEditor({ markdown }) {
  const editorState = useMemo(() => {
    const content = stateFromMarkdown(markdown);
    return EditorState.createWithContent(content);
  }, [markdown]);

  return <Editor editorState={editorState} readOnly />;
}

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
    <div className="wrapper">
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
      />
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
