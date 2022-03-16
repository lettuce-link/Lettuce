import { useState } from "react";
import { AboutCard } from "./about";
import { Card } from "atoms/card";
import { PostThumbnail } from "components/post/thumbnail";
import { usePost } from "api/post";
import { FullPost } from "components/post/post";

export function ChannelView({ communityView, isLoading, infinitePosts }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const { post, isLoading: isPostLoading } = usePost(selectedPost);

  console.log(selectedPost, post);

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
        <FullPost
          postView={post?.post_view}
          communityView={communityView}
          comments={post?.comments}
          isLoading={isPostLoading}
        />
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
              communityView={communityView}
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
          flex-grow: 1;
        }

        .Second {
          flex-grow: 2;
        }

        .First {
          max-width: 400px;
        }
      `}</style>
    </div>
  );
}
