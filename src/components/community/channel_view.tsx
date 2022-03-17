import { usePost } from "api/post";
import { SelectableBox } from "atoms/card";
import { FullPost } from "components/post/post";
import { PostThumbnail } from "components/post/thumbnail";
import { useScrollLimit } from "components/scroll_limit";
import { useState } from "react";

export function ChannelView({ aboutCard, AboutContent, infinitePosts }) {
  useScrollLimit();
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <Split
      first={
        <Channels
          aboutCard={aboutCard}
          infinitePosts={infinitePosts}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
      }
      second={
        <Contents AboutContent={AboutContent} selectedPost={selectedPost} />
      }
    />
  );
}

function Channels({ aboutCard, infinitePosts, selectedPost, setSelectedPost }) {
  const {
    hasMore,
    isLoading: isMoreLoading,
    posts,
    requestMore,
  } = infinitePosts;

  return (
    <div className="Channels">
      <ol>
        <li className="Channels-sticky">
          <SelectableBox
            isSelected={selectedPost === null}
            onSelect={() => setSelectedPost(null)}
          >
            {aboutCard}
          </SelectableBox>
        </li>

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
          background: var(--background-weak);

          height: 100%;
          overflow-y: auto;
        }

        ol {
          display: flex;
          flex-direction: column;
        }

        ol,
        li {
          margin: 0;
          padding: 0;
        }

        .Channels-sticky {
          position: sticky;
          top: 0;
          z-index: 10;

          box-shadow: var(--shadow-small);
        }
      `}</style>
    </div>
  );
}

export function Contents({ AboutContent, selectedPost }) {
  const {
    post_view,
    comments,
    isLoading: isPostLoading,
  } = usePost(selectedPost);

  return (
    <div className="Contents-post">
      {selectedPost === null ? (
        <AboutContent />
      ) : (
        <FullPost
          postView={post_view}
          comments={comments}
          isLoading={isPostLoading}
        />
      )}

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
