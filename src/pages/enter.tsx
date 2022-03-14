import { Card, ErrorMessage } from "../atoms/card";
import { useState, useCallback } from "react";
import { H1, Advice } from "../atoms/typography";
import { Column, Row, LargePadding, WidthLimit } from "../atoms/layout";
import { Form, TextInput, Submit, Field, LinkButton } from "../atoms/input";
import { useShowToast } from "../components/toast";
import { useClient } from "../atoms/client";

export default function Enter() {
  return (
    <main>
      <WidthLimit>
        <Card>
          <LargePadding>
            <AuthWidget />
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

enum View {
  Login,
  Join,
  ResetPassword,
}

function AuthWidget() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [view, setView] = useState(View.Login);

  if (view === View.Login) {
    return (
      <LoginForm
        username={usernameOrEmail}
        setUsername={setUsernameOrEmail}
        password={password}
        setPassword={setPassword}
        setView={setView}
      />
    );
  }

  if (view === View.Join) {
    return (
      <RegisterForm
        username={usernameOrEmail}
        setUsername={setUsernameOrEmail}
        password={password}
        setPassword={setPassword}
        setView={setView}
      />
    );
  }

  if (view === View.ResetPassword) {
    return (
      <ResetPassword
        email={usernameOrEmail}
        setEmail={setUsernameOrEmail}
        setView={setView}
      />
    );
  }
}

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

function LoginForm({ username, setUsername, password, setPassword, setView }) {
  const client = useClient();
  const { showError, showSuccess } = useShowToast();

  const [error, setError] = useState(null);
  const onSubmit = useCallback(() => {
    client.login({ username, password }).then((response) => {
      // @ts-ignore bc the types are wrong :/
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
        }
      } else {
        setError(null);
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
            <Advice>
              New here?{" "}
              <LinkButton onClick={() => setView(View.Join)}>
                Join us
              </LinkButton>
            </Advice>
            <Submit value="Login" />
          </Row>
        </Column>
      </Form>
    </>
  );
}

function RegisterForm({
  username,
  setUsername,
  password,
  setPassword,
  setView,
}) {
  return (
    <>
      <H1>New Account</H1>
      <Form onSubmit={() => {}}>
        <Column>
          <Field prompt="Username">
            <TextInput value={username} setValue={setUsername} />
          </Field>
          <Field prompt="Password">
            <TextInput
              type="password"
              value={password}
              setValue={setPassword}
            />
          </Field>
          <Row justify="space-between">
            <Advice>
              Got an account?{" "}
              <LinkButton onClick={() => setView(View.Login)}>Login</LinkButton>
            </Advice>
            <Submit value="Join" />
          </Row>
        </Column>
      </Form>
    </>
  );
}

function ResetPassword({ email, setEmail, setView }) {
  return (
    <>
      <H1>Reset Password</H1>
      <Advice>
        If you added an email address, you can use it to reset your password.
      </Advice>
      <Form onSubmit={() => {}}>
        <Column>
          <Field prompt="Email">
            <TextInput value={email} setValue={setEmail} />
          </Field>
          <Row justify="space-between">
            <Advice>
              <LinkButton onClick={() => setView(View.Login)}>
                Return to Login
              </LinkButton>
            </Advice>
            <Submit value="Join" />
          </Row>
        </Column>
      </Form>
    </>
  );
}
