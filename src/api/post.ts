import { useShowToast } from "components/toast";
import { useCallback, useEffect, useState } from "react";
import {
  redirectToAuthentication,
  useAuthRequest,
  useClient,
  useIsLoggedIn,
} from "./auth";
import {
  useNewSubscribtion as useNewSubscription,
  useNewWebsocketClient,
} from "./websocket";

enum PostUpdateType {
  Join = "PostJoin",
  CreateComment = "CreateComment",
}

export function usePost(id) {
  const [postResponse, setPostResponse] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useAuthRequest(
    (client) => {
      setLoading(true);

      if (!id) {
        setPostResponse(null);
        return;
      }

      client.getPost(id).then((response) => {
        setPostResponse(response);
        setLoading(false);
      });
    },
    [id]
  );

  function addComment(newCommentView) {
    setPostResponse((currentResponse) => ({
      ...currentResponse,
      comments: [...currentResponse.comments, newCommentView],
    }));
  }

  useNewSubscription(
    (client) => {
      if (!id) {
        return;
      }
      client.postJoin(id);
    },
    (message) => {
      if (message.op === PostUpdateType.CreateComment) {
        const newComment = message.data.comment_view;
        addComment(newComment);
      }
    },
    [id]
  );

  return { ...(postResponse || {}), isLoading };
}

export function useSetPostVote(id) {
  const client = useClient();
  const isLoggedIn = useIsLoggedIn();

  return useCallback(
    (vote) => {
      if (!isLoggedIn) {
        redirectToAuthentication();

        return Promise.resolve(false);
      }

      return client.likePost(id, vote).then((response) => {
        // todo error handling
        return true;
      });
    },
    [id, isLoggedIn, client]
  );
}
