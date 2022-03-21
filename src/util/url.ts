import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

export function useUrlParameter(key): [string, (s: string) => void] {
  const router = useRouter();

  const search = window.location.search;
  const parameters = useMemo(() => new URLSearchParams(search), [search]);

  const setParameter = useCallback(
    (value) => {
      let url = new URL(window.location.href);
      url.searchParams.set(key, value);
      router.push(url);
    },
    [parameters]
  );

  return [parameters.get(key), setParameter];
}
