import Router from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "react-use";
import Client from "./client";

const AuthContext = createContext(null);

export function ClientProvider({ children }) {
  const [storageAuth, setStorageAuth] = useLocalStorage(
    "lemmy-auth-token",
    null
  );

  function makeClient(auth?) {
    return new Client(auth);
  }

  const [client, setClient] = useState(() => makeClient(storageAuth));

  function setAuth(value) {
    setStorageAuth(value);
    setClient(makeClient(value));
  }

  const setAuthCallback = useCallback(setAuth, []);

  return (
    <AuthContext.Provider value={[client, setAuthCallback]}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSetAuth() {
  const [_client, setAuth] = useContext(AuthContext);
  return setAuth;
}

export function useIsLoggedIn() {
  const client = useClient();
  return client.isLoggedIn();
}

/**
 * Calls the provided function with a `client` object whenever authentication status changes, or when one of the dependencies changes.
 * The provided function may return a "cleanup" callback similarly to how useEffect works.
 * @param requester
 * @param dependencies
 */
export function useAuthRequest(requester, dependencies = []) {
  const client = useClient();

  useEffect(() => {
    return requester(client);
  }, [client, ...dependencies]);
}

export function redirectToAuthentication() {
  // todo: would be nice to set the return url
  Router.push("/enter");
}

export function useAuthGuard(shouldBeLoggedIn = true) {
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (shouldBeLoggedIn && !isLoggedIn) {
      redirectToAuthentication();
    }

    if (!shouldBeLoggedIn && isLoggedIn) {
      Router.replace("/");
    }
  }, [shouldBeLoggedIn, isLoggedIn]);
}

export function useClient(): Client {
  const [client, _setAuth] = useContext(AuthContext);

  return client;
}

export function useLogout() {
  const [_client, setAuth] = useContext(AuthContext);

  return useCallback(() => {
    setAuth(null);
  }, [setAuth]);
}
