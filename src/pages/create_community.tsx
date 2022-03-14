import { useClient, useIsLoggedIn } from "api/auth";
import { communityLink } from "api/link";
import { Card, ErrorMessage } from "atoms/card";
import { Field, Form, Link, Submit, TextInput } from "atoms/input";
import { WidthLimit, LargePadding, Row, Column } from "atoms/layout";
import { Advice, H1 } from "atoms/typography";
import { useShowToast } from "components/toast";
import Router from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

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

enum CreateCommunityError {
  AlreadyExists = "community_already_exists",
}

function NameError({ error, name }) {
  if (error === CreateCommunityError.AlreadyExists) {
    return (
      <ErrorMessage>
        That community already exists. You can{" "}
        <Link href={communityLink(name)}>view it here</Link>!
      </ErrorMessage>
    );
  }

  return null;
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

  const [error, setError] = useState(null);
  const [previousSubmission, setPreviousSubmission] = useState(null);
  const { showError, showSuccess } = useShowToast();

  const client = useClient();
  const onSubmit = useCallback(() => {
    setPreviousSubmission(name);

    client.createCommunity({ name, title: name }).then((response) => {
      // @ts-ignore
      const error = response.error;

      if (error) {
        if (Object.values(CreateCommunityError).includes(error)) {
          setError(error);
        } else {
          showError(
            "Sorry! Something went wrong while creating the community. Please report this error – check details in the console."
          );
          console.error(error);
        }
      } else {
        setError(null);

        showSuccess("Community created!");

        Router.push(communityLink(previousSubmission));
      }
    });
  }, [name, client]);

  return (
    <>
      <H1>New Community</H1>
      <Advice>
        A place where people with similar interests come togeter to share posts
        and chat.
      </Advice>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Name">
            <TextInput value={name} setValue={setName} />
            {nameValidation && <Advice>{nameValidation}</Advice>}
            <NameError error={error} name={previousSubmission} />
          </Field>
          <Row justify="end">
            <Submit value="Create" disabled={!isValid} />
          </Row>
        </Column>
      </Form>
    </>
  );
}
