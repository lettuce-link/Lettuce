import { useIsLoggedIn } from "api/auth";
import { AuthWidget } from "components/auth";
import Router from "next/router";
import { Card } from "../atoms/card";
import { LargePadding, WidthLimit } from "../atoms/layout";

export default function Enter() {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    Router.replace("/");
  }

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
