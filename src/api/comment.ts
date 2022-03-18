import { useCallback } from "react";
import { useClient, useIsLoggedIn, redirectToAuthentication } from "./auth";

/**
 * Given a comment ID, returns a function to vote on that ID, with either -1 (downvote), 0 (cancel vote) or 1 (upvote).
 */
export function useSetCommentVote(id) {
  const client = useClient();
  const isLoggedIn = useIsLoggedIn();

  return useCallback(
    (vote) => {
      if (!isLoggedIn) {
        redirectToAuthentication();

        return Promise.resolve(false);
      }

      return client.likeComment(id, vote).then((response) => {
        // todo error handling
        return true;
      });
    },
    [id, isLoggedIn, client]
  );
}
