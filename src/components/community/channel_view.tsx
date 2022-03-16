import { useState } from "react";
import { AboutCard } from "./about";
import { Card } from "atoms/card";
import { PostThumbnail } from "components/post/thumbnail";
import { usePost } from "api/post";
import { FullPost } from "components/post/post";

export function ChannelView({ communityView, isLoading, infinitePosts }) {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <Split
      first={
        <Channels
          communityView={communityView}
          isLoading={isLoading}
          infinitePosts={infinitePosts}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
      }
      second={
        <Contents selectedPost={selectedPost} communityView={communityView} />
      }
    />
  );
}

function Channels({
  communityView,
  isLoading,
  infinitePosts,
  selectedPost,
  setSelectedPost,
}) {
  if (!communityView) {
    return null;
  }

  const {
    hasMore,
    isLoading: isMoreLoading,
    posts,
    requestMore,
  } = infinitePosts;

  return (
    <div className="Channels">
      <ol>
        <AboutCard
          community={communityView?.community}
          isSelected={selectedPost === null}
          onSelect={() => setSelectedPost(null)}
        />

        {posts.map((post) => (
          <li key={post.post.id}>
            <PostThumbnail
              postView={post}
              isSelected={selectedPost === post.post.id}
              onSelect={() => setSelectedPost(post.post.id)}
            />
          </li>
        ))}
      </ol>

      <style jsx>{`
        .Channels {
          background: var(--background-shade);
          padding: 16px;

          height: 100%;
          overflow-y: scroll;
        }

        ol {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        ol,
        li {
          margin: 0;
          padding: 0;
        }

        li {
          display: contents;
        }
      `}</style>
    </div>
  );
}

export function Contents({ selectedPost }) {
  const { post, isLoading: isPostLoading } = usePost(selectedPost);

  if (selectedPost) {
    return (
      <div className="Contents-post">
        <FullPost
          postView={post?.post_view}
          comments={post?.comments}
          isLoading={isPostLoading}
        />

        <style jsx>{`
          .Contents-post {
            background: var(--background-strong);

            height: 100%;

            overflow-y: scroll;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

function Post() {
  return <>Post</>;
}

export function Split({ first, second }) {
  return (
    <div className="Split">
      <div className="First">{first}</div>
      <div className="Second">{second}</div>

      <style jsx>{`
        .Split {
          display: flex;
          flex-direction: row;
          height: 100%;
        }

        .First {
          flex-basis: 0;
          flex-grow: 1;
        }

        .Second {
          flex-basis: 0;
          flex-grow: 2;
        }
      `}</style>
    </div>
  );
}
