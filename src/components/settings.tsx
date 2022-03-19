import { useAuthGuard, useClient } from "api/auth";
import { Card } from "atoms/card";
import { ValidationMessage } from "atoms/feedback";
import { Field, Form, Submit, TextInput } from "atoms/input";
import { WidthLimit, LargePadding, Column, Row } from "atoms/layout";
import { H1, H2 } from "atoms/typography";
import { useCallback, useState } from "react";
import { validatePassword } from "util/auth";
import { useShowToast } from "./toast";

export function SettingsPage() {
  useAuthGuard();

  return (
    <main>
      <WidthLimit>
        <Card>
          <LargePadding>
            <H1>User Settings</H1>
            <ChangePasswordForm />
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

function validateCurrentPassword(password) {
  if (password.length === 0) {
    return "For security reasons, you must enter your current password in order to change it";
  }

  return false;
}

function ChangePasswordForm() {
  const client = useClient();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const oldPasswordValidation = validateCurrentPassword(oldPassword);
  const newPasswordValidation = validatePassword(newPassword);
  const isValid = !oldPasswordValidation && !newPasswordValidation;

  const { showSuccess, showError } = useShowToast();

  const onSubmit = useCallback(() => {
    client.changePassword({ oldPassword, newPassword }).then((response) => {
      // @ts-ignore
      if (response.error) {
        console.error(response);
        showError(
          "Your password could not be updated. Please make sure you entered the correct current password!"
        );
      } else {
        showSuccess("Your password has been updated.");
        setOldPassword("");
        setNewPassword("");
      }
    });
  }, [client, oldPassword, newPassword]);
  return (
    <Form onSubmit={onSubmit}>
      <Column gap="32px">
        <H2>Change Password</H2>
        <Field prompt="Current Password">
          <TextInput
            type="password"
            value={oldPassword}
            setValue={setOldPassword}
          />
          <ValidationMessage message={oldPasswordValidation} />
        </Field>
        <Field prompt="New Password">
          <TextInput
            type="password"
            value={newPassword}
            setValue={setNewPassword}
          />
          <ValidationMessage message={newPasswordValidation} />
        </Field>
        <Row justify="end">
          <Submit value="Update" disabled={!isValid} />
        </Row>
      </Column>
    </Form>
  );
}
