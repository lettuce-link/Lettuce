import { ListingType, Post, PostView, SortType } from "lemmy-js-client";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth, useAuthRequest } from "./auth";

const PAGE_SIZE = 20;

export interface Filter {
  sort?: SortType;
  type_?: ListingType;
  community_name?: string;
  saved_only?: boolean;
}

export interface InfinitePosts {
  posts: PostView[];
  isLoading: boolean;
  hasMore: boolean;
  requestMore: () => void;
}

export function usePosts({
  type_,
  community_name,
  saved_only = false,
  sort = SortType.Active,
}: Filter): InfinitePosts {
  const [auth] = useAuth();

  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  // reset everything when user logs in/out or filters change
  useEffect(() => {
    setPosts([]);
    setLoading(false);
    setHasMore(true);
  }, [auth, type_, community_name, saved_only, sort]);

  useAuthRequest(
    (client) => {
      setLoading(true);

      let isCancelled = false;

      client
        .getPosts({
          page: currentPage,
          limit: PAGE_SIZE,
        })
        .then((response) => {
          if (isCancelled) {
            return;
          }

          setPosts((posts) => [...posts, ...response.posts]);
          setLoading(false);
          setHasMore(response.posts.length >= PAGE_SIZE);
        });

      return () => {
        // currentPage won't change while loading.
        // This call means that the filters changed,
        // so we need to cancel the outdated request
        isCancelled = true;
      };
    },
    [currentPage, type_, community_name, saved_only, sort]
  );

  function requestMore() {
    if (isLoading || !hasMore) {
      return;
    }

    setCurrentPage((c) => c + 1);
  }

  return { posts, isLoading, hasMore, requestMore };
}

export function useCommunityPosts(
  name,
  sort: SortType = SortType.Active
): InfinitePosts {
  return usePosts({
    sort,
    type_: ListingType.Community,
    community_name: name,
    saved_only: false,
  });
}
