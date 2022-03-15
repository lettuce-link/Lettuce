import { useSetPostVote } from "api/post";
import { Card } from "atoms/card";
import { Column, Padding, Row } from "atoms/layout";
import { MoreButton } from "atoms/popup";
import { H1 } from "atoms/typography";
import { CommunityBadge } from "components/community/badge";
import { ReadonlyEditor } from "components/editor";
import { VerticalVote } from "components/vote";
import { CommunityView, PostView } from "lemmy-js-client";

export function FullPost({ postView, communityView, isLoading }) {
  if (isLoading || !postView) {
    // todo better loading state
    return null;
  }

  console.log({ isLoading, post: postView });

  return (
    <Card>
      <Padding>
        <Column>
          <PostHead postView={postView} communityView={communityView} />
          <ReadonlyEditor markdown={postView.post.body} />
        </Column>
      </Padding>
    </Card>
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
        <h1 className="title">{postView.post.name}</h1>
        <Row>
          <CommunityBadge communityView={communityView} />
        </Row>
      </Column>

      <style jsx>{`
        .title {
          margin: 0;
          line-height: 1;
        }
      `}</style>
    </Row>
  );
}
