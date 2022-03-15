import { useEffect } from "react";
import { useState } from "react";
import { useAuthRequest } from "./auth";

export function useCommunity(name: string) {
  const [community, setCommunity] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useAuthRequest(
    (client) => {
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
