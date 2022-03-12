import LettuceClient from "./client";
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
  const host = process.env.NEXT_PUBLIC_LEMMY_EXTERNAL_HOST;
  const url = `ws://${host}/api/v3/ws`;
  console.log(url);

  const [client] = useState(() => new LettuceClient(url));

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}

export const useClient = (): LettuceClient => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const client = useContext(ClientContext);

  if (typeof client === "undefined") {
    throw new Error("Must not call useClient outside of client context");
  }

  return client;
};
