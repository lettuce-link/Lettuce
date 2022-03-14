import { AuthWidget } from "components/auth";
import { Card } from "../atoms/card";
import { LargePadding, WidthLimit } from "../atoms/layout";

export default function Enter() {
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
