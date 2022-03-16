import { useAuthGuard, useClient } from "api/auth";
import { useCommunity } from "api/community";
import { Card } from "atoms/card";
import { ValidationMessage } from "atoms/feedback";
import { Field, Form, Submit, TextInput } from "atoms/input";
import { Column, LargePadding, Row, WidthLimit } from "atoms/layout";
import { H1 } from "atoms/typography";
import { useEditor } from "components/editor";
import { useShowToast } from "components/toast";
import { CommunitySafe } from "lemmy-js-client";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { postLink } from "util/link";

export default function NewPost() {
  const router = useRouter();

  const { community_name: name } = router.query;
  // @ts-ignore
  const { community, isLoading } = useCommunity(name);

  if (!community || isLoading) {
    // todo loading state
    return null;
  }

  return <NewPostPage community={community.community_view.community} />;
}

function NewPostPage({ community }) {
  useAuthGuard();

  return (
    <main>
      <WidthLimit>
        <Card>
          <LargePadding>
            <H1>New Post in {community.title}</H1>
            <NewPostForm community={community} />
          </LargePadding>
        </Card>
      </WidthLimit>
      <style jsx>{`
        main {
          padding: 32px 16px;
        }
      `}</style>
    </main>
  );
}

const TITLE_REGEX = /.*\S{3,}.*/;

/**
 * Returns a validation message, or false if the title is valid
 * @param title
 * @returns
 */
function validateTitle(title) {
  if (!TITLE_REGEX.test(title)) {
    return "Must contain at least one word";
  }

  return false;
}

function NewPostForm({ community }: { community: CommunitySafe }) {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const titleValidation = validateTitle(title);
  const { showSuccess } = useShowToast();

  const isValid = !titleValidation;

  const { Editor, getMarkdown } = useEditor();

  const client = useClient();

  function onSubmit() {
    const markdown = getMarkdown();
    client
      .createPost({
        name: title,
        body: markdown,
        community_id: community.id,
      })
      .then((response) => {
        showSuccess("Post created");
        router.push(postLink(response.post_view.post.id));
      });
  }

  return (
    <Form onSubmit={onSubmit}>
      <Column>
        <Field prompt="Title">
          <TextInput value={title} setValue={setTitle} />
          <ValidationMessage message={titleValidation} />
        </Field>
        <Field prompt="Content">
          <Editor minHeight="8em" />
        </Field>
        <Row justify="end">
          <Submit value="Post" disabled={!isValid} />
        </Row>
      </Column>
    </Form>
  );
}
