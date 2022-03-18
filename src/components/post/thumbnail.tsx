import { SelectableBox } from "atoms/card";
import { Column, Padding, Row } from "atoms/layout";
import { InfoList, Strong } from "atoms/typography";
import { CommunityBadge } from "components/community/badge";
import { PersonMention } from "components/person/badge";
import { PostView } from "lemmy-js-client";

/**
 * A small post title+basic info
 * (intended as a channel selector)
 */
export function PostThumbnail({
  postView,
  isSelected,
  onSelect,
}: {
  postView: PostView;
  isSelected;
  onSelect;
}) {
  return (
    <SelectableBox isSelected={isSelected} onSelect={onSelect}>
      <Padding padding="16px 8px">
        <Row gap="16px" align="start">
          <Column gap="8px">
            <Strong>{postView.post.name}</Strong>
            <InfoList>
              <PersonMention person={postView.creator} />
              <CommunityBadge community={postView.community} />
            </InfoList>
          </Column>
        </Row>
      </Padding>
    </SelectableBox>
  );
}
