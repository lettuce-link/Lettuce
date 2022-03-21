import { useAuthGuard, useClient } from "api/auth";
import { ErrorMessage } from "atoms/card";
import { ValidationMessage } from "atoms/feedback";
import { Field, Form, Link, Submit, TextInput } from "atoms/input";
import { Column, FocusContent, ComfortPadding, Row } from "atoms/layout";
import { H1, SecondaryInfo } from "atoms/typography";
import { useShowToast } from "components/toast";
import Router from "next/router";
import { useCallback, useState } from "react";
import { communityLink } from "util/link";

export default function CreateCommunity() {
  useAuthGuard();

  return (
    <FocusContent>
      <ComfortPadding>
        <CreateCommunityWidget />
      </ComfortPadding>
    </FocusContent>
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

        Router.push(communityLink(name));
      }
    });
  }, [name, client]);

  return (
    <>
      <H1>New Community</H1>
      <SecondaryInfo>
        A place where people with similar interests come togeter to share posts
        and chat.
      </SecondaryInfo>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Name">
            <TextInput value={name} setValue={setName} />
            <ValidationMessage message={nameValidation} />
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
