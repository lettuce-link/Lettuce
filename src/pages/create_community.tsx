import { useIsLoggedIn } from "api/auth";
import { Card } from "atoms/card";
import { Field, Form, Submit, TextInput } from "atoms/input";
import { WidthLimit, LargePadding, Row, Column } from "atoms/layout";
import { Advice, H1 } from "atoms/typography";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function CreateCommunity() {
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (Router.isReady && !isLoggedIn) {
      Router.replace("/enter");
    }
  }, []);

  return (
    <main>
      <WidthLimit>
        <Card>
          <LargePadding>
            <CreateCommunityWidget />
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

const NAME_REGEX = /^[a-zA-Z0-9_]*$/;
const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 20;

/**
 * Returns a validation message, or false if the name is valid
 * @param name
 * @returns
 */
function validateName(name) {
  if (name.length === 0) {
    return `Can contain letters, numbers, and underscores`;
  }

  if (!NAME_REGEX.test(name)) {
    return "Community names can only contain letters, numbers, and underscores (_)";
  }

  if (name.length < NAME_MIN_LENGTH) {
    return `Must have at least ${NAME_MIN_LENGTH} characters.`;
  }

  if (name.length > NAME_MAX_LENGTH) {
    return `Sorry, usernames can have at most ${NAME_MAX_LENGTH} characters.`;
  }

  return false;
}

function CreateCommunityWidget() {
  const [name, setName] = useState("");

  const nameValidation = validateName(name);
  const isValid = !nameValidation;

  return (
    <>
      <H1>New Community</H1>
      <Advice>
        A place where people with similar interests come togeter to share posts
        and chat.
      </Advice>
      <Form onSubmit={() => {}}>
        <Column>
          <Field prompt="Name">
            <TextInput value={name} setValue={setName} />
            {nameValidation && <Advice>{nameValidation}</Advice>}
          </Field>
          <Row justify="end">
            <Submit value="Create" disabled={!isValid} />
          </Row>
        </Column>
      </Form>
    </>
  );
}
