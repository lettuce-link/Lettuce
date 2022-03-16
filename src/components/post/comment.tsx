import { useSetCommentVote } from "api/comment";
import { Column, Row } from "atoms/layout";
import { H2, H3 } from "atoms/typography";
import { ReadonlyEditor } from "components/editor";
import { PersonBadge } from "components/person/badge";
import { HorizontalVote } from "components/vote";
import { Comment, CommentView, PostView } from "lemmy-js-client";
import { useMemo } from "react";
import { PostAddComment } from "./comment_editor";

export function CommentSection({ postView, comments }) {
  return (
    <Column>
      <PostAddComment postView={postView} />
      <CommentTree postView={postView} comments={comments} />
    </Column>
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
    <section>
      <H3>Comments</H3>
      <div>
        <CommentList ids={topLevel} commentMap={commentMap} />
      </div>
    </section>
  );
}

function CommentList({ ids, commentMap }) {
  return ids.map((id) => (
    <CommentThread
      key={id}
      commentMap={commentMap}
      commentNode={commentMap[id]}
    />
  ));
}

function CommentThread({
  commentMap,
  commentNode,
}: {
  commentMap;
  commentNode: CommentNode;
}) {
  const commentView = commentNode.comment;

  return (
    <div className="Comment">
      <CommentHead comment={commentView} />
      <div className="Comment-contents">
        <div className="Comment-self">
          <ReadonlyEditor markdown={commentView.comment.content} />
          <CommentActions comment={commentView} />
        </div>
        <div className="Comment-replies">
          <CommentList ids={commentNode.children} commentMap={commentMap} />
        </div>
      </div>

      <style jsx>{`
        .Comment-contents {
          margin-left: 16px;
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

function CommentActions({ comment }: { comment: CommentView }) {
  const setMyVote = useSetCommentVote(comment.comment.id);

  const { upvotes, downvotes } = comment.counts;
  const myVote = comment.my_vote || 0;
  return (
    <Row>
      <HorizontalVote
        upvotes={upvotes}
        downvotes={downvotes}
        myVote={myVote}
        setMyVote={setMyVote}
      />
    </Row>
  );
}
