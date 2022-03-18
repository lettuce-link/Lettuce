import { useClient } from "api/auth";
import { useCommunity } from "api/community";
import { useModeratorGuard } from "api/site";
import { Card } from "atoms/card";
import { Field, Form, Submit, TextInput } from "atoms/input";
import { WidthLimit, LargePadding, Column, Row } from "atoms/layout";
import { H1 } from "atoms/typography";
import { useEditor } from "components/editor";
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
    <main>
      <WidthLimit limit="var(--large-content)">
        <Card>
          <LargePadding>
            <CommunitySettings
              community={communityResponse.community_view.community}
            />
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

function CommunitySettings({ community }: { community: CommunitySafe }) {
  const client = useClient();
  const { showSuccess } = useShowToast();

  const [title, setTitle] = useState(community.title);
  const { Editor, getMarkdown } = useEditor(community.description || "");

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
          <Field prompt="Description">
            <Editor minHeight="4em" />
          </Field>
          <Row justify="end">
            <Submit value="Save" />
          </Row>
        </Column>
      </Form>
    </div>
  );
}
