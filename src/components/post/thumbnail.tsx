import { Card, SelectableCard } from "atoms/card";
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
  isSelected,
  onSelect,
}: {
  postView: PostView;
  isSelected;
  onSelect;
}) {
  console.log(postView);
  return (
    <SelectableCard isSelected={isSelected} onSelect={onSelect}>
      <Padding padding="8px">
        <Row gap="16px" align="start">
          <Column gap="8px">
            <PostTitle postView={postView} isCompact />
            <InfoList>
              <PersonBadge person={postView.creator} />
              <CommunityBadge community={postView.community} />
            </InfoList>
          </Column>
        </Row>
      </Padding>
    </SelectableCard>
  );
}
