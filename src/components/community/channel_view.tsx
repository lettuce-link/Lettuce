import { useState } from "react";
import { AboutCard } from "./about";
import { Card } from "atoms/card";

export function ChannelView({ community, isLoading, infinitePosts }) {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <Split
      first={
        <Channels
          community={community}
          isLoading={isLoading}
          infinitePosts={infinitePosts}
        />
      }
      second={<Post />}
    />
  );
}

function Channels({ community, isLoading, infinitePosts }) {
  if (!community) {
    return null;
  }

  return (
    <>
      <AboutCard community={community?.community_view.community} />
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
