import { Card } from "../atoms/card";
import { useState } from "react";
import { useClient } from "../lib/ClientProvider";
import { H1, Advice } from "../atoms/typography";
import { Column, Row, LargePadding, WidthLimit } from "../atoms/layout";
import { Form, TextInput, Submit, Field, LinkButton } from "../atoms/input";

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

function LoginForm({ username, setUsername, password, setPassword, setView }) {
  const client = useClient();

  return (
    <>
      <H1>Welcome Back!</H1>
      <Form
        onSubmit={() => client.login({ username, password }).then(console.log)}
      >
        <Column>
          <Field prompt="Username / Email">
            <TextInput value={username} setValue={setUsername} />
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
