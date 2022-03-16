import { Card } from "atoms/card";
import { Column, Padding, Row } from "atoms/layout";
import { MoreButton } from "atoms/popup";
import { InfoList, SecondaryInfo } from "atoms/typography";
import { CommunityBadge } from "components/community/badge";
import { PersonBadge } from "components/person/badge";
import { VerticalVote } from "components/vote";
import { CommunityView, PostView } from "lemmy-js-client";
import { PostTitle } from "./post";

export function PostThumbnail({
  postView,
  communityView,
}: {
  postView: PostView;
  communityView: CommunityView;
}) {
  return (
    <Card>
      <Padding padding="8px">
        <Row gap="16px" align="start">
          <Column gap="8px">
            <MoreButton onClick={() => {}} />
          </Column>
          <Column gap="8px">
            <PostTitle postView={postView} isCompact />
            <InfoList>
              <PersonBadge person={postView.creator} />
              <CommunityBadge communityView={communityView} />
            </InfoList>
          </Column>
        </Row>
      </Padding>
    </Card>
  );
}
