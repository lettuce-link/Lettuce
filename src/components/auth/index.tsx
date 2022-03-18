import { useState } from "react";
import { LoginForm } from "./login";
import { Register } from "./register";
import { ResetPassword } from "./reset_password";
import { View } from "./view";

/**
 * Authentication widget for login, reset password or creating an account.
 *
 * Providing it in a single widget makes it easy to re-use input if the user realizes half-way that they want to e.g. create an account instead of logging in, avoiding the need to type it again.
 *
 * TODO: this single-page approach is not ideal if we ever want to link specifically to one of these actions (e.g. directly to register) – some Router magic (or query parameter? - ugly) might need to be implemented. Whatever.
 */
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
