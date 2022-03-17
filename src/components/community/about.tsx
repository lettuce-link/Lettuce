import { newPostLink } from "util/link";
import { Card, SelectableCard } from "atoms/card";
import { Button } from "atoms/input";
import { Column, Padding, Row } from "atoms/layout";
import { H1, H2, H3, InfoList, SecondaryInfo } from "atoms/typography";
import { useRouter } from "next/router";
import { CommunityModeratorView, CommunityView } from "lemmy-js-client";
import { CommunityBadge } from "./badge";
import { MultiStateButton } from "atoms/toggle";
import { useClient, useIsLoggedIn } from "api/auth";
import { useCallback, useState } from "react";
import { useShowToast } from "components/toast";
import { ReadonlyEditor } from "components/editor";
import { PersonBadge } from "components/person/badge";

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
  moderators,
  online,
}: {
  communityView: CommunityView;
  moderators: CommunityModeratorView[];
  online: number;
}) {
  if (!communityView) {
    return null;
  }

  const community = communityView.community;

  return (
    <Padding padding="16px">
      <H2>{community.title}</H2>
      <Column gap="16px">
        <SecondaryInfo>
          <CommunityBadge community={community} />
        </SecondaryInfo>
        <Row>
          <JoinButton communityView={communityView} />
          <SecondaryInfo>
            <InfoList>
              <div>{communityView.counts.subscribers} users</div>
              <div>{online} online</div>
            </InfoList>
          </SecondaryInfo>
        </Row>
        <ReadonlyEditor markdown={community.description || ""} />
        <CommunityModerators moderators={moderators} />
        <CommunityStatistics communityView={communityView} />
      </Column>
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

function CommunityModerators({
  moderators,
}: {
  moderators: CommunityModeratorView[];
}) {
  return (
    <div>
      <H3>Moderators</H3>
      {moderators.map((moderator) => (
        <PersonBadge person={moderator.moderator} />
      ))}
    </div>
  );
}

function CommunityStatistics({
  communityView,
}: {
  communityView: CommunityView;
}) {
  return (
    <div>
      <H3>Statistics</H3>
      <ul>
        <li>Created {communityView.community.published}</li>
        <li>
          {communityView.counts.users_active_month} active users this month
        </li>
        <li>{communityView.counts.posts} posts</li>
        <li>{communityView.counts.comments} comments</li>
      </ul>

      <style jsx>{`
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          display: block;
        }
      `}</style>
    </div>
  );
}
