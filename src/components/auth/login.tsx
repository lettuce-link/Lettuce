import { useClient, useSetAuth } from "api/auth";
import { ErrorMessage } from "atoms/card";
import { Field, Form, LinkButton, Submit, TextInput } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { H1, SecondaryInfo } from "atoms/typography";
import { useShowToast } from "components/toast";
import { useCallback, useState } from "react";
import { View } from "./view";

/**
 * Possible login errors. Taken from the backend.
 */
enum LoginError {
  WrongLogin = "couldnt_find_that_username_or_email",
  WrongPassword = "password_incorrect",
  NotVerified = "email_not_verified",
}

function UsernameError({ error, setView }) {
  if (error === LoginError.WrongLogin) {
    return (
      <ErrorMessage>
        We couldn't find this username.{" "}
        <LinkButton onClick={() => setView(View.Join)}>
          Create account?
        </LinkButton>
      </ErrorMessage>
    );
  }

  if (error === LoginError.NotVerified) {
    return (
      <ErrorMessage>
        You need to verify your account. Check your email!
      </ErrorMessage>
    );
  }

  return null;
}

function PasswordError({ error, setView }) {
  if (error === LoginError.WrongPassword) {
    return (
      <ErrorMessage>
        This isn't right.{" "}
        <LinkButton onClick={() => setView(View.ResetPassword)}>
          Forgot your password?
        </LinkButton>
      </ErrorMessage>
    );
  }

  return null;
}

export function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  setView,
}) {
  const client = useClient();
  const { showError, showSuccess } = useShowToast();
  const setAuth = useSetAuth();

  const [error, setError] = useState(null);
  const onSubmit = useCallback(() => {
    client.login({ username, password }).then((response) => {
      const error = response.error;
      if (error) {
        setError(error);

        if (
          ![
            LoginError.NotVerified,
            LoginError.WrongLogin,
            LoginError.WrongPassword,
          ].includes(error)
        ) {
          showError(
            "Sorry! Something went wrong while logging in. Please report this error – check details in the console."
          );
          console.error(error);
        }
      } else {
        setError(null);
        setAuth(response.auth);
        showSuccess("You're in.");
      }
    });
  }, [username, password, client]);

  return (
    <>
      <H1>Welcome Back!</H1>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Username / Email">
            <TextInput value={username} setValue={setUsername} />
            <UsernameError error={error} setView={setView} />
          </Field>
          <Field
            prompt={
              <>
                Password{" "}
                <LinkButton onClick={() => setView(View.ResetPassword)}>
                  (Forgot password?)
                </LinkButton>
              </>
            }
          >
            <TextInput
              type="password"
              value={password}
              setValue={setPassword}
            />
            <PasswordError error={error} setView={setView} />
          </Field>
          <Row justify="space-between">
            <SecondaryInfo>
              New here?{" "}
              <LinkButton onClick={() => setView(View.Join)}>
                Join us
              </LinkButton>
            </SecondaryInfo>
            <Submit value="Login" />
          </Row>
        </Column>
      </Form>
    </>
  );
}
