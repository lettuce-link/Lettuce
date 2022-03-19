import { CommunityView, ListingType, SortType } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { useClient } from "./auth";

// about the max number of items humans can easily process
// (this site is for humans)
const TRENDING_COMMUNITY_LIMIT = 6;

export function useTrendingCommunities(): CommunityView[] {
  const [communities, setCommunities] = useState(null);
  const client = useClient();

  useEffect(() => {
    if (client === null) return;
    if (communities !== null) return;

    client
      .listCommunities({
        type_: ListingType.All,
        sort: SortType.TopWeek,
        limit: TRENDING_COMMUNITY_LIMIT,
      })
      .then((response) => {
        setCommunities(response.communities);
      });
  }, [client, communities]);

  return communities;
}
