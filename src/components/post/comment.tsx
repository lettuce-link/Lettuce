import { useIsLoggedIn } from "api/auth";
import { useSetCommentVote } from "api/comment";
import { ShyButton } from "atoms/input";
import { Column, Row } from "atoms/layout";
import { H3 } from "atoms/typography";
import { ReadonlyEditor } from "components/editor";
import { PersonBadge } from "components/person/badge";
import { HorizontalVote } from "components/vote";
import { CommentView, PostView } from "lemmy-js-client";
import { useMemo } from "react";
import { useToggle } from "react-use";
import { CommentReply, PostAddComment } from "./comment_editor";

export function CommentSection({ postView, comments }) {
  return (
    <section>
      <Column gap="8px">
        <H3>Comments</H3>
        <PostAddComment postView={postView} />
        <CommentTree postView={postView} comments={comments} />
      </Column>
    </section>
  );
}

class CommentNode {
  comment: CommentView;
  children: number[];

  constructor() {
    this.comment = null;
    this.children = [];
  }
}

function useTree(comments) {
  // The purpose of this function is to convert the comment list into a format that is easily traversable for rendering the comment tree.
  // It is probably not the most efficient possible, but then, the current naive implementation of comment fetching seems very naive to me. Once Lemmy grows as a platform, fetching all of the comments for large posts (millions of comments) will be infeasible in the first place. (But afaict this is not currently implemented on the BE)

  return useMemo(() => {
    const topLevel = [];
    const commentMap: Record<number, CommentNode> = {};

    comments.forEach((comment) => {
      const parent = comment.comment.parent_id;
      const id = comment.comment.id;

      if (!commentMap[id]) {
        commentMap[id] = new CommentNode();
      }
      commentMap[id].comment = comment;

      if (parent) {
        if (!commentMap[parent]) {
          commentMap[parent] = new CommentNode();
        }

        commentMap[parent].children.push(id);
      } else {
        topLevel.push(id);
      }
    });

    return { commentMap, topLevel };
  }, [comments]);
}

function CommentTree({
  postView,
  comments,
}: {
  postView: PostView;
  comments: CommentView[];
}) {
  const { commentMap, topLevel } = useTree(comments);
  return (
    <div>
      <CommentList ids={topLevel} commentMap={commentMap} postView={postView} />
    </div>
  );
}

function CommentList({ ids, commentMap, postView }) {
  return ids.map((id) => (
    <CommentThread
      key={id}
      commentMap={commentMap}
      commentNode={commentMap[id]}
      postView={postView}
    />
  ));
}

function CommentThread({
  commentMap,
  commentNode,
  postView,
}: {
  commentMap;
  commentNode: CommentNode;
  postView: PostView;
}) {
  const commentView = commentNode.comment;

  return (
    <div className="Comment">
      <CommentHead comment={commentView} />
      <div className="Comment-contents">
        <div className="Comment-self">
          <ReadonlyEditor markdown={commentView.comment.content} />
          <CommentActions comment={commentView} postView={postView} />
        </div>
        <div className="Comment-replies">
          <CommentList
            ids={commentNode.children}
            commentMap={commentMap}
            postView={postView}
          />
        </div>
      </div>

      <style jsx>{`
        .Comment-contents {
          // these should add up to a power of 2 to be consistent with everything else
          margin-left: 5px;
          border-left: 2px solid var(--background-transparent-dark);
          padding-left: 9px;
        }
      `}</style>
    </div>
  );
}

function CommentHead({ comment }: { comment: CommentView }) {
  return (
    <div>
      <PersonBadge person={comment.creator} />
    </div>
  );
}

function CommentActions({
  comment,
  postView,
}: {
  comment: CommentView;
  postView: PostView;
}) {
  const isLoggedIn = useIsLoggedIn();

  const setMyVote = useSetCommentVote(comment.comment.id);

  const [isReplyOpen, toggleReplyOpen] = useToggle(false);

  const { upvotes, downvotes } = comment.counts;
  const myVote = comment.my_vote || 0;

  return (
    <Column gap="4px">
      <Row gap="4px" align="center">
        <HorizontalVote
          upvotes={upvotes}
          downvotes={downvotes}
          myVote={myVote}
          setMyVote={setMyVote}
        />
        {isLoggedIn && <ShyButton onClick={toggleReplyOpen}>Reply</ShyButton>}
      </Row>
      {isReplyOpen && (
        <CommentReply
          comment={comment}
          postView={postView}
          onSuccess={() => toggleReplyOpen(false)}
        />
      )}
    </Column>
  );
}
