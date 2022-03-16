import { useClient, useIsLoggedIn } from "api/auth";
import { authLink } from "api/link";
import { Field, Form, Link, Submit } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { SecondaryInfo } from "atoms/typography";
import { useEditor } from "components/editor";
import { useShowToast } from "components/toast";
import { PostView } from "lemmy-js-client";

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
        console.log(response);
        clearContents();
        showSuccess("Your comment has been posted");
      });
  }

  if (!isLoggedIn) {
    return <MustLogIn />;
  }

  return (
    <div className="PostAddComment">
      <Form onSubmit={onSubmit}>
        <Column gap="8px">
          <Field prompt="Add Comment">
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
