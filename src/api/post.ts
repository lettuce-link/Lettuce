import { useShowToast } from "components/toast";
import { useCallback, useState } from "react";
import {
  redirectToAuthentication,
  useAuthRequest,
  useClient,
  useIsLoggedIn,
} from "./auth";

export function usePost(id) {
  const [post, setPost] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useAuthRequest(
    (client) => {
      setLoading(true);

      if (!id) {
        setPost(null);
        return;
      }

      client.getPost(id).then((response) => {
        setPost(response);
        setLoading(false);
      });
    },
    [id]
  );

  return { post, isLoading };
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
