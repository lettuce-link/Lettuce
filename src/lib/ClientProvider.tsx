import Client from "./client";
import React, {
  ReactChildren,
  ReactChild,
  useState,
  useContext,
  createContext,
} from "react";

const ClientContext = createContext(undefined);

export default function ClientProvider({
  children,
}: {
  children: ReactChildren | ReactChild;
}) {
  const [client] = useState(() => new Client());
  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}

export const useClient = (): Client => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const client = useContext(ClientContext);

  if (typeof client === "undefined") {
    throw new Error("Must not call useClient outside of client context");
  }

  return client;
};
