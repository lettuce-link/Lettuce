import { GetSiteResponse } from "lemmy-js-client";
import { createContext, useContext, useState } from "react";
import { useAuthRequest } from "./auth";

const SiteContext = createContext(undefined);

export function SiteProvider({ children }) {
  const [site, setSite] = useState(undefined);
  const [isLoading, setLoading] = useState(true);

  useAuthRequest((client) => {
    setLoading(true);

    console.log("requesting");
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
export const useSite = (): Site => {
  return useContext(SiteContext);
};
