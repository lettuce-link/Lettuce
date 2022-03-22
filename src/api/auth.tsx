import Router from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "react-use";
import { authLink } from "util/link";
import Client from "./client";

const AuthContext = createContext(null);

/**
 * Creates a context for a shared (authenticated or not) client for the whole app, and a way to set the auth token, updating the client.
 *
 * This component should only be used once at the root of the app; then you can call `useClient` and `useSetAuth` anywhere to access/update the client at "no cost"
 */
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

    // pictrs request require jwt header
    if (value) {
      document.cookie = `jwt=${value}; path=/`;
    } else {
      document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  }

  const setAuthCallback = useCallback(setAuth, []);

  return (
    <AuthContext.Provider value={[client, setAuthCallback]}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Returns a function for setting the app authentication token. Also updates the client to use the new token.
 * Pass null to clear the token
 */
export function useSetAuth() {
  const [_client, setAuth] = useContext(AuthContext);
  return setAuth;
}

/**
 * @returns true if the user is logged in
 */
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
export function useAuthRequest(
  requester: (c: Client) => any,
  dependencies = []
) {
  const client = useClient();

  useEffect(() => {
    return requester(client);
  }, [client, ...dependencies]);
}

/**
 * Redirects the user to the login page
 */
export function redirectToAuthentication() {
  // todo: would be nice to set the return url
  Router.push(authLink());
}

/**
 * Conditionally redirects the user depending on wether they are logged in.
 * @param shouldBeLoggedIn if true, will redirect logged-out users to log in. If false, will redirect logged-in users to the homepage.
 */
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

/**
 *
 * @returns the Client singleton, a nice wrapper for easily making requests
 *
 * Note: must be called within the context of ClientProvider (since the app is wrapped in ClientProvider, can be used "anywhere")
 */
export function useClient(): Client {
  const [client, _setAuth] = useContext(AuthContext);

  return client;
}

/**
 * @returns a function for logging out the user
 */
export function useLogout() {
  const [_client, setAuth] = useContext(AuthContext);

  return useCallback(() => {
    setAuth(null);
  }, [setAuth]);
}
