import { useAuthGuard, useClient } from "api/auth";
import { useCommunity } from "api/community";
import { Card } from "atoms/card";
import { ValidationMessage } from "atoms/feedback";
import { Form, Field, TextInput, Submit } from "atoms/input";
import { WidthLimit, LargePadding, Column, Row } from "atoms/layout";
import { H1 } from "atoms/typography";
import { LettuceEditor, useEditor } from "components/editor";
import { useShowToast } from "components/toast";
import { CommunitySafe } from "lemmy-js-client";
import { useRouter } from "next/router";
import { useState } from "react";
import { postLink } from "util/link";

/**
 * Page for creating a new post
 */
export function NewPostPage({ name }) {
  useAuthGuard();

  const { communityResponse: communityResponse, isLoading } =
    useCommunity(name);

  if (!communityResponse || isLoading) {
    // todo loading state
    return null;
  }

  const community = communityResponse.community_view.community;

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

  const { editorProps, getMarkdown } = useEditor();

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

  // todo: if we put the Editor in a Field (which has a label for accessibility purposes), that label gets associated with all the contained WYSIWYG buttons. fix this.

  return (
    <Form onSubmit={onSubmit}>
      <Column>
        <Field prompt="Title">
          <TextInput value={title} setValue={setTitle} />
          <ValidationMessage message={titleValidation} />
        </Field>
        <LettuceEditor {...editorProps} minHeight="8em" />
        <Row justify="end">
          <Submit value="Post" disabled={!isValid} />
        </Row>
      </Column>
    </Form>
  );
}
