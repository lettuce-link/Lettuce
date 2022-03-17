import { GetSiteResponse } from "lemmy-js-client";
import { createContext, useContext, useState } from "react";
import { useAuthRequest } from "./auth";

const SiteContext = createContext(undefined);

export function SiteProvider({ children }) {
  const [site, setSite] = useState(undefined);
  const [isLoading, setLoading] = useState(true);

  useAuthRequest((client) => {
    setLoading(true);

    client.getSite().then((site) => {
      setLoading(false);
      setSite(site);
    });
  });

  const value = {
    site,
    isLoading,
  };
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

type Site = { site?: GetSiteResponse; isLoading: boolean };
export function useSite(): Site {
  return useContext(SiteContext);
}

export function useMe() {
  const site = useSite();

  return site.site?.my_user || null;
}

export function useAmModeratorIn(communityName) {
  const me = useMe();

  if (!me) {
    return false;
  }

  return me.moderates.some((mod) => mod.community.name === communityName);
}
