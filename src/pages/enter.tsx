import { useIsLoggedIn } from "api/auth";
import { AuthWidget } from "components/auth";
import Router from "next/router";
import { ComfortPadding, FocusContent } from "../atoms/layout";

export default function Enter() {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    Router.replace("/");
  }

  return (
    <FocusContent>
      <ComfortPadding>
        <AuthWidget />
      </ComfortPadding>
    </FocusContent>
  );
}
