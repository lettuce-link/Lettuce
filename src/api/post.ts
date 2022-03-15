import { useState } from "react";
import { useAuthRequest } from "./auth";

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
