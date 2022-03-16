import { newPostLink } from "util/link";
import { Card, SelectableCard } from "atoms/card";
import { Button } from "atoms/input";
import { Padding, Row } from "atoms/layout";
import { H1 } from "atoms/typography";
import { useRouter } from "next/router";

export function AboutCard({ community, isSelected, onSelect }) {
  if (!community) {
    return null;
  }

  const router = useRouter();
  const openNewPostPage = () => router.push(newPostLink(community.name));

  return (
    <SelectableCard isSelected={isSelected} onSelect={onSelect}>
      <Padding padding="16px">
        <Row justify="space-between">
          <H1 margin="0">{community.title}</H1>
          <Button onClick={openNewPostPage}>New Post</Button>
        </Row>
      </Padding>
    </SelectableCard>
  );
}
