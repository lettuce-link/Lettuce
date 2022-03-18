import { GetCommunityResponse } from "lemmy-js-client";
import { useState } from "react";
import { useAuthRequest } from "./auth";

/**
 * Given a community name, performs a request to fetch the community (getCommunity endpoint)
 * @param name the community name
 * @returns { communityResponse, isLoading }
 */
export function useCommunity(name?: string): {
  communityResponse: GetCommunityResponse;
  isLoading: boolean;
} {
  const [communityResponse, setCommunity] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useAuthRequest(
    (client) => {
      if (!name) {
        return;
      }

      setLoading(true);

      client.getCommunity(name).then((response) => {
        setLoading(false);

        setCommunity(response);
      });
    },
    [name]
  );

  return { communityResponse, isLoading };
}
