import { useAuth, useClient } from "api/auth";
import { ErrorMessage } from "atoms/card";
import { ValidationMessage } from "atoms/feedback";
import { Field, Form, LinkButton, Submit, TextInput } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { SecondaryInfo, H1 } from "atoms/typography";
import { useShowToast } from "components/toast";
import { useCallback, useState } from "react";
import { useCaptcha } from "./captcha";
import { View } from "./view";

enum RegistrationError {
  AlreadyExists = "user_already_exists",
  CaptchaIncorrect = "captcha_incorrect",
  ContainsSlurs = "slurs",
}

function UsernameError({ error, setView }) {
  if (error === RegistrationError.AlreadyExists) {
    return (
      <ErrorMessage>
        This user already exists! Are you trying to{" "}
        <LinkButton onClick={() => setView(View.Login)}>Log in?</LinkButton>
      </ErrorMessage>
    );
  }

  if (error === RegistrationError.ContainsSlurs) {
    return (
      <ErrorMessage>
        Woah, we've detected some potentially offensive words here. Please
        choose a different username.
      </ErrorMessage>
    );
  }

  return null;
}

function CaptchaError({ error, setView }) {
  if (error === RegistrationError.CaptchaIncorrect) {
    <ErrorMessage>Wrong Captcha text, please try again.</ErrorMessage>;
  }

  return null;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]*$/;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;

/**
 * Returns a validation message, or false if the username is valid
 * @param username
 * @returns
 */
function validateUsername(username) {
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

  return false;
}

const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 60;

/**
 * Returns a validation message, or false if the password is valid.
 * @param password
 * @returns
 */
function validatePassword(password) {
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
  const [_auth, setAuth] = useAuth();

  const usernameValidation = validateUsername(username);
  const passwordValidation = validatePassword(password);
  const isValid = !(usernameValidation || passwordValidation);

  const { showError, showSuccess } = useShowToast();
  const [error, setError] = useState(null);
  const onSubmit = useCallback(() => {
    client.register({ username, password }).then((response) => {
      // @ts-ignore bc the types are wrong
      const error = response.error;
      if (error) {
        setError(error);

        if (!Object.values(RegistrationError).includes(error)) {
          showError(
            "Sorry! Something went wrong during registration. Please report this error – check details in the console."
          );
        }
      } else {
        setError(null);

        if (response.jwt) {
          showSuccess("Welcome!");
          setAuth(response.jwt);
        } else if (response.verify_email_sent) {
          showSuccess("Success! Check your email for the verification link.");
        }
      }
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
            <ValidationMessage message={usernameValidation} />
            <UsernameError error={error} setView={setView} />
          </Field>
          <Field prompt="Password">
            <TextInput
              type="password"
              value={password}
              setValue={setPassword}
            />
            <ValidationMessage message={passwordValidation} />
          </Field>
          {needsCaptcha && (
            <Field prompt="Captcha">
              <Captcha />
              <CaptchaError error={error} setView={setView} />
            </Field>
          )}
          <Row justify="space-between">
            <SecondaryInfo>
              Got an account?{" "}
              <LinkButton onClick={() => setView(View.Login)}>Login</LinkButton>
            </SecondaryInfo>
            <Submit value="Join" disabled={!isValid} />
          </Row>
        </Column>
      </Form>
    </>
  );
}
