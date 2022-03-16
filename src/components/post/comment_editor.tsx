import { useClient, useIsLoggedIn } from "api/auth";
import { authLink } from "util/link";
import { Field, Form, Link, Submit } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { SecondaryInfo } from "atoms/typography";
import { useEditor } from "components/editor";
import { useShowToast } from "components/toast";
import { CommentView, PostView } from "lemmy-js-client";

export function PostAddComment({ postView }: { postView: PostView }) {
  const isLoggedIn = useIsLoggedIn();
  const client = useClient();

  const { Editor, getMarkdown, isEmpty, clearContents } = useEditor();
  const { showSuccess } = useShowToast();

  function onSubmit() {
    const markdown = getMarkdown();
    client
      .createComment({
        content: markdown,
        post_id: postView.post.id,
      })
      .then((response) => {
        clearContents();
        showSuccess("Your comment has been posted");
      });
  }

  if (!isLoggedIn) {
    return <MustLogIn />;
  }

  return (
    <CommentEditor
      onSubmit={onSubmit}
      Editor={Editor}
      isEmpty={isEmpty}
      prompt={"Add Comment"}
    />
  );
}

export function CommentReply({
  comment,
  postView,
  onSuccess,
}: {
  comment: CommentView;
  postView: PostView;
  onSuccess;
}) {
  const isLoggedIn = useIsLoggedIn();
  const client = useClient();

  const { Editor, getMarkdown, isEmpty, clearContents } = useEditor();
  const { showSuccess } = useShowToast();

  function onSubmit() {
    const markdown = getMarkdown();
    client
      .createComment({
        content: markdown,
        post_id: postView.post.id,
        parent_id: comment.comment.id,
      })
      .then((response) => {
        clearContents();
        showSuccess("Your reply has been posted");
        onSuccess();
      });
  }

  if (!isLoggedIn) {
    return <MustLogIn />;
  }

  return (
    <CommentEditor
      onSubmit={onSubmit}
      Editor={Editor}
      isEmpty={isEmpty}
      prompt={"Reply"}
    />
  );
}

function CommentEditor({ onSubmit, Editor, isEmpty, prompt }) {
  return (
    <div className="PostAddComment">
      <Form onSubmit={onSubmit}>
        <Column gap="8px">
          <Field prompt={prompt}>
            <Editor />
          </Field>
          <Row justify="end">
            <Submit value="Post" disabled={isEmpty} />
          </Row>
        </Column>
      </Form>
    </div>
  );
}

function MustLogIn() {
  return (
    <SecondaryInfo>
      You must be <Link href={authLink()}>logged in</Link> to comment.
    </SecondaryInfo>
  );
}
