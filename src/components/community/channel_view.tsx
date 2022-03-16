import { useState } from "react";
import { AboutCard } from "./about";
import { Card } from "atoms/card";
import { PostThumbnail } from "components/post/thumbnail";

export function ChannelView({ communityView, isLoading, infinitePosts }) {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <Split
      first={
        <Channels
          communityView={communityView}
          isLoading={isLoading}
          infinitePosts={infinitePosts}
        />
      }
      second={<Post />}
    />
  );
}

function Channels({ communityView, isLoading, infinitePosts }) {
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
    <>
      <ol>
        <AboutCard community={communityView?.community} />

        {posts.map((post) => (
          <li key={post.post.id}>
            <PostThumbnail postView={post} communityView={communityView} />
          </li>
        ))}
      </ol>

      <style jsx>{`
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
    </>
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
