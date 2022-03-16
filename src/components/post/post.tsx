import { useSetPostVote } from "api/post";
import { Card } from "atoms/card";
import { Column, Padding, Row } from "atoms/layout";
import { MoreButton } from "atoms/popup";
import { H1, SecondaryInfo } from "atoms/typography";
import { CommunityBadge } from "components/community/badge";
import { ReadonlyEditor } from "components/editor";
import { PersonBadge } from "components/person/badge";
import { VerticalVote } from "components/vote";
import { CommunityView, PostView } from "lemmy-js-client";
import { CommentSection } from "./comment";

export function FullPost({ postView, communityView, comments, isLoading }) {
  if (isLoading || !postView) {
    // todo better loading state
    return null;
  }

  return (
    <Padding>
      <Column gap="8px">
        <PostHead postView={postView} communityView={communityView} />
        <ReadonlyEditor markdown={postView.post.body} />
        <CommentSection postView={postView} comments={comments} />
      </Column>
    </Padding>
  );
}

function PostHead({
  postView,
  communityView,
}: {
  postView: PostView;
  communityView: CommunityView;
}) {
  const setVote = useSetPostVote(postView.post.id);

  return (
    <Row gap="16px" align="start">
      <Column gap="8px">
        <MoreButton onClick={() => {}} />
        <VerticalVote
          upvotes={postView.counts.upvotes}
          downvotes={postView.counts.downvotes}
          myVote={postView.my_vote || 0}
          setMyVote={setVote}
        />
      </Column>
      <Column gap="8px">
        <PostTitle postView={postView} />
        <Row>
          <SecondaryInfo>
            Posted by <PersonBadge person={postView.creator} /> in{" "}
            <CommunityBadge communityView={communityView} />
          </SecondaryInfo>
        </Row>
      </Column>
    </Row>
  );
}

export function PostTitle({ postView, isCompact = false }) {
  return (
    <h2 className="PostTitle">
      {postView.post.name}
      <style jsx>{`
        .PostTitle {
          font: var(--font-heading-light);

          ${isCompact
            ? `
          font-size: var(--size-large);
          `
            : ``}

          margin: 0;
          line-height: 1;
        }
      `}</style>
    </h2>
  );
}
