import { usePost } from "api/post";
import { SelectableBox } from "atoms/card";
import { DesktopStyle, MobileStyle } from "atoms/theme";
import { FullPost } from "components/post/post";
import { PostThumbnail } from "components/post/thumbnail";
import { useScrollLimit } from "components/scroll_limit";
import { useCallback, useState } from "react";
import { useIsDesktop } from "util/screen";
import { useUrlParameter } from "util/url";

/**
 * A channel-like interface for a list of posts. Think discord-like: list of channels on left (except they are post titles in our case), chat messages on the right (except they are full posts+comments). Separate scroll bars. Easy navigation (hopefully?)
 *
 * In addition to having 1 "channel" for each post, there is a sticky "about" channel – this is where you can put info about the current context (e.g. about community, about site, etc).
 * Props:
 *  aboutCard: the first sticky channel
 *  AboutContent: a component to render the About channel contents
 *  infinitePosts: posts to render as channels
 */
export function ChannelView({ aboutCard, AboutContent, infinitePosts }) {
  useScrollLimit();

  // const isDesktop = useIsDesktop();
  const [queryParameter, setQueryParameter] = useUrlParameter("active_channel");

  const isContentOpen = !!queryParameter;
  const currentChannel = getChannelFromParameter(queryParameter);

  const openPost = useCallback((post) => {
    setQueryParameter(post);
  }, []);

  return (
    <Split
      first={
        <Channels
          aboutCard={aboutCard}
          infinitePosts={infinitePosts}
          selectedPost={currentChannel}
          setSelectedPost={openPost}
        />
      }
      second={
        <Contents AboutContent={AboutContent} selectedPost={currentChannel} />
      }
      isSecondOpen={isContentOpen}
    />
  );
}

const ABOUT_CHANNEL = "about";
function getChannelFromParameter(parameter) {
  if (parameter === ABOUT_CHANNEL || !parameter) {
    return ABOUT_CHANNEL;
  }

  return Number.parseInt(parameter);
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
            isSelected={selectedPost === ABOUT_CHANNEL}
            onSelect={() => setSelectedPost(ABOUT_CHANNEL)}
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
      {selectedPost === ABOUT_CHANNEL ? (
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

export function Split({ first, second, isSecondOpen = false }) {
  return (
    <div className="Split">
      <div className="First">{first}</div>
      <div className="Second">{second}</div>

      <DesktopStyle>{`
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
      `}</DesktopStyle>

      <MobileStyle>{`
        .Split {
          display: flex;
          width: fit-content;
          height: 100%;
        }

        .First {
          width: 100vw;
          ${isSecondOpen ? "margin-left: -100vw" : ""}
        }

        .Second {
          width: 100vw;
        }
      `}</MobileStyle>
    </div>
  );
}
