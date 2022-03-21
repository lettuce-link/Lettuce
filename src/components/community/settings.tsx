import { useClient } from "api/auth";
import { useCommunity } from "api/community";
import { useModeratorGuard } from "api/site";
import { Card } from "atoms/card";
import { EditorField, Field, Form, Submit, TextInput } from "atoms/input";
import {
  WidthLimit,
  ComfortPadding,
  Column,
  Row,
  FocusContent,
} from "atoms/layout";
import { H1 } from "atoms/typography";
import { LettuceEditor, useEditor } from "components/editor";
import { useShowToast } from "components/toast";
import { CommunitySafe } from "lemmy-js-client";
import Router from "next/router";
import { useCallback, useState } from "react";
import { communityLink } from "util/link";

/**
 * Community moderation page (only accessible to mods)
 *
 * Currently provides only basic community settings, but may include e.g. moderator management in the future, as a separate tab or something
 */
export function CommunityModerationPage({ name }) {
  useModeratorGuard(name);

  const { communityResponse } = useCommunity(name);

  if (!communityResponse) {
    return null;
  }

  return (
    <FocusContent limit="var(--large-content)">
      <ComfortPadding>
        <CommunitySettings
          community={communityResponse.community_view.community}
        />
      </ComfortPadding>
    </FocusContent>
  );
}

function CommunitySettings({ community }: { community: CommunitySafe }) {
  const client = useClient();
  const { showSuccess } = useShowToast();

  const [title, setTitle] = useState(community.title);
  const { editorProps, getMarkdown } = useEditor(community.description || "");

  const onSubmit = useCallback(() => {
    const markdown = getMarkdown();

    client
      .editCommunity({
        community_id: community.id,
        title,
        description: markdown,
      })
      .then((response) => {
        // todo: error handling

        showSuccess("Saved community settings");
        Router.push(communityLink(community.name));
      });
  }, [client, title, getMarkdown]);

  return (
    <div>
      <H1>Edit {community.name}</H1>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Title">
            <TextInput value={title} setValue={setTitle} />
          </Field>
          <EditorField prompt="Description">
            <LettuceEditor {...editorProps} minHeight="4em" />
          </EditorField>
          <Row justify="end">
            <Submit value="Save" />
          </Row>
        </Column>
      </Form>
    </div>
  );
}
