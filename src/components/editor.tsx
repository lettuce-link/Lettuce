import { Editor, EditorState, RichUtils } from "draft-js";
import { useState } from "react";
import { stateToMarkdown } from "draft-js-export-markdown";

export function useEditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const Editor = () => (
    <DraftEditor editorState={editorState} setEditorState={setEditorState} />
  );

  function getMarkdown() {
    return stateToMarkdown(editorState.getCurrentContent());
  }

  return { Editor, getMarkdown };
}

function DraftEditor({ editorState, setEditorState }) {
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
          min-height: 8em;
        }
      `}</style>
    </div>
  );
}
