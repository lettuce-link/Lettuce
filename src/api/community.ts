import { GetCommunityResponse } from "lemmy-js-client";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthRequest } from "./auth";

export function useCommunity(name?: string): {
  community: GetCommunityResponse;
  isLoading: boolean;
} {
  const [community, setCommunity] = useState(null);
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

  return { community, isLoading };
}
