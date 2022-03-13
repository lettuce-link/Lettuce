import { useState } from "react";
import { useClient } from "../lib/ClientProvider";
import { H1 } from "../atoms/typography";
import { Form, TextInput, Submit } from "../atoms/input";

export default function Login() {
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
        <label htmlFor="username"> Username / Email:</label>
        <TextInput name="username" value={username} setValue={setUsername} />
        <label htmlFor="password"> Password:</label>
        <TextInput
          name="password"
          type="password"
          value={password}
          setValue={setPassword}
        />
        <Submit value="Login" />
      </Form>
    </>
  );
}
