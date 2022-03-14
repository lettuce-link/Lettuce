import { useClient } from "api/auth";
import { Field, Form, LinkButton, Submit, TextInput } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { Advice, H1 } from "atoms/typography";
import { useCallback } from "react";
import { useCaptcha } from "./captcha";
import { View } from "./view";

enum RegistrationError {
  AlreadyExists = "user_already_exists",
  RegistrationClosed = "registration_closed",
  CaptchaIncorrect = "captcha_incorrect",
  ContainsSlurs = "slurs",
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]*$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;

function getUsernameError(username) {
  if (username.length === 0) {
    return `Can contain letters, numbers, and underscores`;
  }

  if (!USERNAME_REGEX.test(username)) {
    return "Usernames can only contain letters, numbers, and underscores (_)";
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return `Must have at least ${USERNAME_MIN_LENGTH} characters.`;
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return `Sorry, usernames can have at most ${USERNAME_MAX_LENGTH} characters.`;
  }
}

const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 60;
function getPasswordError(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Must have at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Sorry, passwords can have at most ${MAX_PASSWORD_LENGTH} characters.`;
  }

  return false;
}

export function Register({
  username,
  setUsername,
  password,
  setPassword,
  setView,
}) {
  const client = useClient();

  const usernameError = getUsernameError(username);
  const passwordError = getPasswordError(password);
  const isValid = !(usernameError || passwordError);

  const onSubmit = useCallback(() => {
    client.register({ username, password }).then((response) => {
      console.log(response);
    });
  }, [username, password, client]);

  const { needsCaptcha, Captcha } = useCaptcha();

  return (
    <>
      <H1>New Account</H1>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Username">
            <TextInput value={username} setValue={setUsername} />
            {usernameError && <Advice>{usernameError}</Advice>}
          </Field>
          <Field prompt="Password">
            <TextInput
              type="password"
              value={password}
              setValue={setPassword}
            />
            {passwordError && <Advice>{passwordError}</Advice>}
          </Field>
          {needsCaptcha && (
            <Field prompt="Captcha">
              <Captcha />
            </Field>
          )}
          <Row justify="space-between">
            <Advice>
              Got an account?{" "}
              <LinkButton onClick={() => setView(View.Login)}>Login</LinkButton>
            </Advice>
            <Submit value="Join" disabled={!isValid} />
          </Row>
        </Column>
      </Form>
    </>
  );
}
