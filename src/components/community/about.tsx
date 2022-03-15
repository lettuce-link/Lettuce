import { Card } from "atoms/card";
import { Padding } from "atoms/layout";
import { H2 } from "atoms/typography";

export function AboutCard({ community }) {
  if (!community) {
    return null;
  }

  console.log(community);

  return (
    <Card>
      <Padding>
        <H2>{community.title}</H2>
      </Padding>
    </Card>
  );
}
