import { usePost, useSetPostVote } from "api/post";
import { Column, FocusContent, Padding, Row } from "atoms/layout";
import { MoreButton } from "atoms/popup";
import { SecondaryInfo } from "atoms/typography";
import { CommunityBadge } from "components/community/badge";
import { ReadonlyEditor } from "components/editor";
import { SafeImage } from "components/image";
import { PersonMention } from "components/person/badge";
import { VerticalVote } from "components/vote";
import { Post, PostView } from "lemmy-js-client";
import { usePostImages } from "util/image";
import { CommentSection } from "./comment";

export function PostPage({ id }) {
  const { post_view, comments, isLoading } = usePost(id);

  return (
    <FocusContent limit="var(--large-content)">
      <FullPost
        postView={post_view}
        comments={comments}
        isLoading={isLoading}
      />
    </FocusContent>
  );
}

export function FullPost({ postView, comments, isLoading }) {
  if (isLoading || !postView) {
    // todo better loading state
    return null;
  }

  return (
    <Column gap="0">
      <PostImage post={postView.post} />
      <Padding>
        <Column gap="8px">
          <PostHead postView={postView} />
          <ReadonlyEditor markdown={postView.post.body} />
          <CommentSection postView={postView} comments={comments} />
        </Column>
      </Padding>
    </Column>
  );
}

function PostImage({ post }: { post: Post }) {
  const images = usePostImages(post);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="PostImage">
      <SafeImage src={images[0]} />

      <style jsx>{`
        .PostImage {
          // cant believe how often flex fixes all my problems
          display: flex;
        }
      `}</style>
    </div>
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
            Posted by <PersonMention person={postView.creator} /> in{" "}
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
