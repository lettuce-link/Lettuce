import { useAuth } from "api/auth";
import { AuthWidget } from "components/auth";
import { Card } from "../atoms/card";
import { LargePadding, WidthLimit } from "../atoms/layout";

import Router from "next/router";

export default function Enter() {
  const [auth] = useAuth();

  if (auth) {
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
