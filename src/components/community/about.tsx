import { newPostLink } from "api/link";
import { Card } from "atoms/card";
import { Button } from "atoms/input";
import { Padding, Row } from "atoms/layout";
import { H1 } from "atoms/typography";
import { useRouter } from "next/router";

export function AboutCard({ community }) {
  if (!community) {
    return null;
  }

  const router = useRouter();
  const openNewPostPage = () => router.push(newPostLink(community.name));

  return (
    <Card>
      <Padding padding="16px">
        <Row justify="space-between">
          <H1 margin="0">{community.title}</H1>
          <Button onClick={openNewPostPage}>New Post</Button>
        </Row>
      </Padding>
    </Card>
  );
}
