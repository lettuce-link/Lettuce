import { ListingType, PostView, SortType } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { useAuthRequest, useClient } from "./auth";

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

/**
 * For a given configuration, returns an "infinite" list of posts. This
 *
 * @return { posts, isLoading, hasMore, requestMore } where:
 * posts: the posts
 * isLoading: currently fetching new posts
 * hasMore: there are more posts
 * requestMore: fetch the next page of posts. Noop if already fetching or has no more posts.
 */
// todo: infinite loading not really tested, just the 1st page. sry if buggy.
// todo: there will be other places where we want to use infinite scrolling on a paginated api. perhaps we should implement this generically to reuse?
export function usePosts({
  type_,
  community_name,
  saved_only = false,
  sort = SortType.Active,
}: Filter): InfinitePosts {
  const client = useClient();

  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  // reset everything when user logs in/out or filters change
  useEffect(() => {
    setPosts([]);
    setLoading(false);
    setHasMore(true);
  }, [client, type_, community_name, saved_only, sort]);

  useAuthRequest(
    (client) => {
      setLoading(true);

      let isCancelled = false;

      client
        .getPosts({
          page: currentPage,
          limit: PAGE_SIZE,
          type_,
          sort,
          community_name,
          saved_only,
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

export function useHomePosts(sort: SortType = SortType.Active): InfinitePosts {
  return usePosts({
    sort,
    type_: ListingType.All,
  });
}
