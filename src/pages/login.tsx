import { Card } from "../atoms/card";
import { useState } from "react";
import { useClient } from "../lib/ClientProvider";
import { H1 } from "../atoms/typography";
import { Column, Row, LargePadding, WidthLimit } from "../atoms/layout";
import { Form, TextInput, Submit, Field } from "../atoms/input";

export default function Login() {
  return (
    <main>
      <WidthLimit>
        <Card>
          <LargePadding>
            <LoginWidget />
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

function LoginWidget() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const client = useClient();

  return (
    <LoginForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={() => client.login({ username, password }).then(console.log)}
    />
  );
}

function LoginForm({ username, setUsername, password, setPassword, onSubmit }) {
  return (
    <>
      <H1>Login</H1>
      <Form onSubmit={onSubmit}>
        <Column>
          <Field prompt="Username / Email">
            <TextInput
              name="username"
              value={username}
              setValue={setUsername}
            />
          </Field>
          <Field prompt="Password">
            <TextInput
              name="password"
              type="password"
              value={password}
              setValue={setPassword}
            />
          </Field>
          <Row justify="end">
            <Submit value="Login" />
          </Row>
        </Column>
      </Form>
    </>
  );
}
