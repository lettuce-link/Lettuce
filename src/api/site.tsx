import {
  FederatedInstances,
  GetSiteResponse,
  MyUserInfo,
  PersonViewSafe,
  SiteView,
} from "lemmy-js-client";
import Router from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { communityLink, homeLink } from "util/link";
import { useAuthRequest } from "./auth";

const SiteContext = createContext(undefined);

/**
 * Requests the site and provides it as a shared context for the app to use.
 *
 * This component should only be used once at the root of the app; then you can call `useSite` anywhere to access the site at "no cost"
 */
export function SiteProvider({ children }) {
  const [site, setSite] = useState({});
  const [isLoading, setLoading] = useState(true);

  useAuthRequest((client) => {
    setLoading(true);

    client.getSite().then((site) => {
      setLoading(false);
      setSite(site);
    });
  });

  const value = {
    ...site,
    isLoading,
  };
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

type Site = {
  isLoading: boolean;

  site_view?: SiteView;
  admins?: PersonViewSafe[];
  online?: number;
  version?: string;
  my_user?: MyUserInfo;
  federated_instances?: FederatedInstances;
};

/**
 * Returns the current site response, along with an `isLoading` tag
 */
export function useSite(): Site {
  return useContext(SiteContext);
}

/**
 * @returns info about the current user, as returned as part of the the getSite endpoint
 * Null if the site hasn't loaded yet.
 */
export function useMe(): MyUserInfo {
  const site = useSite();

  return site?.my_user || null;
}

/**
 * Given a community name, returns true iff the current user is a moderator in that community, and the site has loaded.
 */
export function useAmModeratorIn(communityName) {
  const me = useMe();

  if (!me) {
    return false;
  }

  return me.moderates.some((mod) => mod.community.name === communityName);
}

/**
 * Redirects to the community homepage if the user is not a moderator in the specified community.
 */
export function useModeratorGuard(communityName) {
  const amModerator = useAmModeratorIn(communityName);

  useEffect(() => {
    if (!amModerator) {
      Router.push(communityLink(communityName));
    }
  }, [amModerator]);
}

/**
 * @returns true iff the current user is an adming and the site has loaded.
 */
export function useAmAdmin() {
  const me = useMe();

  if (!me) {
    return false;
  }

  return me.local_user_view.person.admin;
}

/**
 * Redirects to the homepage if the current user is not an admin
 */
export function useAdminGuard() {
  const amAdmin = useAmAdmin();

  useEffect(() => {
    if (!amAdmin) {
      Router.push(homeLink());
    }
  }, [amAdmin]);
}
