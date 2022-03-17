import { newPostLink } from "util/link";
import { Card, SelectableCard } from "atoms/card";
import { Button } from "atoms/input";
import { Padding, Row } from "atoms/layout";
import { H1, H2, SecondaryInfo } from "atoms/typography";
import { useRouter } from "next/router";
import { CommunityView } from "lemmy-js-client";
import { CommunityBadge } from "./badge";
import { MultiStateButton } from "atoms/toggle";
import { useClient, useIsLoggedIn } from "api/auth";
import { useCallback, useState } from "react";
import { useShowToast } from "components/toast";

export function CommunityThumbnail({ community, isSelected, onSelect }) {
  if (!community) {
    return null;
  }

  const router = useRouter();
  const openNewPostPage = () => router.push(newPostLink(community.name));

  return (
    <SelectableCard isSelected={isSelected} onSelect={onSelect}>
      <Padding padding="16px">
        <Row wrap justify="space-between">
          <H1 margin="0">{community.title}</H1>
          <Button onClick={openNewPostPage}>New Post</Button>
        </Row>
      </Padding>
    </SelectableCard>
  );
}

export function AboutCommunity({
  communityView,
}: {
  communityView: CommunityView;
}) {
  if (!communityView) {
    return null;
  }

  const community = communityView.community;

  return (
    <Padding padding="16px">
      <H2>{community.title}</H2>
      <SecondaryInfo>
        <CommunityBadge community={community} />
      </SecondaryInfo>
      <JoinButton communityView={communityView} />
    </Padding>
  );
}

function JoinButton({ communityView }: { communityView: CommunityView }) {
  const isLoggedIn = useIsLoggedIn();
  const client = useClient();

  const [isSubscribed, setSubscribed] = useState(communityView.subscribed);
  const [isLoading, setLoading] = useState(false);

  const { showSuccess } = useShowToast();

  const onClick = useCallback(() => {
    if (isLoading) {
      return;
    }

    setLoading(true);
    setSubscribed(!isSubscribed);

    // todo handle errors
    client
      .followCommunity(communityView.community.id, !isSubscribed)
      .then((response) => {
        if (isSubscribed) {
          showSuccess("Successfully left the community");
        } else {
          showSuccess("You have subscribed to this community");
        }

        setLoading(false);
      });
  }, [client, isSubscribed, isLoading]);

  if (!isLoggedIn) {
    return null;
  }

  const options = ["Join", "Leave"];
  const index = isSubscribed ? 1 : 0;

  return (
    <MultiStateButton
      options={options}
      currentIndex={index}
      onClick={onClick}
    />
  );
}
