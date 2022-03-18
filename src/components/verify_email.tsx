import { useClient } from "api/auth";
import Router from "next/router";
import { useEffect } from "react";
import { authLink } from "util/link";
import { useShowToast } from "./toast";

/**
 * Verify email page.
 * Makes request to verify the email and redirects to login after success.
 *
 */
export function VerifyEmailPage({ token }) {
  const client = useClient();
  const { showError, showSuccess } = useShowToast();

  useEffect(() => {
    if (!token) {
      return;
    }
    client.verifyEmail(token).then((response) => {
      // @ts-ignore
      if (response.error) {
        console.error(response);
        showError(
          "Sorry, could not verify your email. Perhaps you've already verified it?"
        );

        // tbh theres nothing better the user can do than try logging in.
        Router.push(authLink());
      } else {
        showSuccess("Thanks, you're verified. You can now log in!");
        Router.push(authLink());
      }
    });
  }, [token]);

  return null;
}
