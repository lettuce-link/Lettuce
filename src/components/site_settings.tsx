import { useClient } from "api/auth";
import { useAdminGuard, useSite } from "api/site";
import { Card } from "atoms/card";
import { Field, Form, Submit, TextInput } from "atoms/input";
import { Column, LargePadding, Row, WidthLimit } from "atoms/layout";
import { H1 } from "atoms/typography";
import Router from "next/router";
import { useCallback, useState } from "react";
import { homeLink } from "util/link";
import { useEditor } from "./editor";
import { useShowToast } from "./toast";

export function SiteSettingsPage() {
  useAdminGuard();

  const siteResponse = useSite();
  const site = siteResponse.site?.site_view.site;

  if (!site) {
    // todo loading state
    return null;
  }

  return (
    <main>
      <WidthLimit limit="var(--large-content)">
        <Card>
          <LargePadding>
            <SiteSettings site={site} />
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

function SiteSettings({ site }) {
  const client = useClient();
  const { showSuccess } = useShowToast();

  const [name, setName] = useState(site.name);

  const { Editor, getMarkdown } = useEditor(site.description || "");

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
