import { useState } from "react";
import { LoginForm } from "./login";
import { Register } from "./register";
import { ResetPassword } from "./reset_password";
import { View } from "./view";

export function AuthWidget() {
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
      <Register
        usernameOrEmail={usernameOrEmail}
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
