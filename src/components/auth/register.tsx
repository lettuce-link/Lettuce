import { useClient, useSetAuth } from "api/auth";
import { ErrorMessage } from "atoms/card";
import { ValidationMessage } from "atoms/feedback";
import { Field, Form, LinkButton, Submit, TextInput } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { H1, SecondaryInfo } from "atoms/typography";
import { useShowToast } from "components/toast";
import { useCallback, useState } from "react";
import { validateUsername, validatePassword } from "util/auth";
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

export function Register({ usernameOrEmail, password, setPassword, setView }) {
  const [username, setUsername] = useState(usernameOrEmail);
  const [email, setEmail] = useState(usernameOrEmail);

  const client = useClient();
  const setAuth = useSetAuth();

  const usernameValidation = validateUsername(username);
  const passwordValidation = validatePassword(password);
  const isValid = !(usernameValidation || passwordValidation);

  const { showError, showSuccess } = useShowToast();
  const [error, setError] = useState(null);
  const onSubmit = useCallback(() => {
    client.register({ email, username, password }).then((response) => {
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
    });
  }, [email, username, password, client]);

  const { needsCaptcha, Captcha } = useCaptcha();

  return (
    <>
      <H1>New Account</H1>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Email">
            <TextInput type="email" value={email} setValue={setEmail} />
          </Field>
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
