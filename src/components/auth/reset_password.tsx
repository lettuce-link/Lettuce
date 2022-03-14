import { Form, Field, TextInput, LinkButton, Submit } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { H1, Advice } from "atoms/typography";
import { View } from "./view";

export function ResetPassword({ email, setEmail, setView }) {
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
