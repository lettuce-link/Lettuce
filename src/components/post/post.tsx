import { usePost, useSetPostVote } from "api/post";
import { Card } from "atoms/card";
import { Column, Padding, Row, WidthLimit } from "atoms/layout";
import { MoreButton } from "atoms/popup";
import { SecondaryInfo } from "atoms/typography";
import { CommunityBadge } from "components/community/badge";
import { ReadonlyEditor } from "components/editor";
import { PersonBadge } from "components/person/badge";
import { VerticalVote } from "components/vote";
import { PostView } from "lemmy-js-client";
import { CommentSection } from "./comment";

export function PostPage({ id }) {
  const { post, isLoading } = usePost(id);

  return (
    <main>
      <WidthLimit limit="var(--large-content)">
        <Card>
          <FullPost
            postView={post?.post_view}
            comments={post?.comments}
            isLoading={isLoading}
          />
        </Card>
      </WidthLimit>
      <style jsx>{`
        main {
          padding: 32px 16px;
        }
      `}</style>
    </main>
  );
}

export function FullPost({ postView, comments, isLoading }) {
  if (isLoading || !postView) {
    // todo better loading state
    return null;
  }

  return (
    <Padding>
      <Column gap="8px">
        <PostHead postView={postView} />
        <ReadonlyEditor markdown={postView.post.body} />
        <CommentSection postView={postView} comments={comments} />
      </Column>
    </Padding>
  );
}

function PostHead({ postView }: { postView: PostView }) {
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
            <CommunityBadge community={postView.community} />
          </SecondaryInfo>
        </Row>
      </Column>
    </Row>
  );
}

export function PostTitle({ postView }) {
  return (
    <h2 className="PostTitle">
      {postView.post.name}
      <style jsx>{`
        .PostTitle {
          font: var(--font-heading-light);

          margin: 0;
          line-height: 1;
        }
      `}</style>
    </h2>
  );
}
