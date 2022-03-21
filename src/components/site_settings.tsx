import { useClient } from "api/auth";
import { useAdminGuard, useSite } from "api/site";
import { Card } from "atoms/card";
import { EditorField, Field, Form, Submit, TextInput } from "atoms/input";
import {
  Column,
  ComfortPadding,
  FocusContent,
  Row,
  WidthLimit,
} from "atoms/layout";
import { H1 } from "atoms/typography";
import Router from "next/router";
import { useCallback, useState } from "react";
import { homeLink } from "util/link";
import { LettuceEditor, useEditor } from "./editor";
import { useShowToast } from "./toast";

/**
 * Site settings page for admins.
 */
export function SiteSettingsPage() {
  useAdminGuard();

  const siteResponse = useSite();
  const site = siteResponse?.site_view?.site;

  if (!site) {
    // todo loading state
    return null;
  }

  return (
    <FocusContent limit="var(--large-content)">
      <ComfortPadding>
        <SiteSettings site={site} />
      </ComfortPadding>
    </FocusContent>
  );
}

function SiteSettings({ site }) {
  const client = useClient();
  const { showSuccess } = useShowToast();

  const [name, setName] = useState(site.name);

  const { editorProps, getMarkdown } = useEditor(site.description || "");

  const onSubmit = useCallback(() => {
    const markdown = getMarkdown();

    client.editSite({ name, description: markdown }).then((response) => {
      // todo: error handling

      showSuccess("Saved site settings");
      Router.push(homeLink());
    });
  }, [client, name, getMarkdown]);

  return (
    <div>
      <H1>Edit Site</H1>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Name">
            <TextInput value={name} setValue={setName} />
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
